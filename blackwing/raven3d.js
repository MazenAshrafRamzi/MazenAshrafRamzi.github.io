// Huginn and Muninn in real 3D: a museum scan of a real common raven (Corvus corax), rigged in Blender
// (Root > Body > Neck > Head, Tail; the branch is a separate "Perch" mesh) and animated here in code.
// Model: "Common raven", Virtual Museums of Małopolska, CC0. File: blackwing/raven.glb (Draco, ~1.5 MB).
//
// Performance: ONE WebGL context serves both scenes. The canvas moves between the hero (ravens on their perches)
// and the finale (ravens on Odin's shoulders), renders only while its scene is on screen, and is capped at 30 fps.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEG = Math.PI / 180;
const api = window.blackwing3d = { ok: false };

let renderer;
try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { /* no WebGL: the page still works */ }

if (renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  const canvas = renderer.domElement;
  canvas.id = "raven3d"; canvas.setAttribute("aria-hidden", "true");

  const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,226,150,1)"); r.addColorStop(.25, "rgba(232,180,80,.55)"); r.addColorStop(1, "rgba(200,140,40,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();

  // Moonlight key, violet and teal rims (the iridescence real raven feathers have), a faint gold glow from below.
  function addLights(scene) {
    const dir = (c, x, y, z) => { const l = new THREE.DirectionalLight(c, 0); l.position.set(x, y, z); scene.add(l); return l; };
    const amb = new THREE.AmbientLight(0x2a2c44, 0); scene.add(amb);
    return [[amb, .5], [dir(0xe8ecff, -1.2, 2.4, 2.6), 2.6], [dir(0x7f8dff, -2.4, 1.6, -2.2), 2.6], [dir(0x45d6c4, 2.6, 1.0, -2.0), 2.0], [dir(0xd9a94a, 0, -1.6, 1.4), .55]];
  }

  let EYES = [];
  class Raven {
    constructor(src, stage, { pos, yaw, scale = 1, attention, perch = true, hidden = false }) {
      this.root = cloneSkinned(src); this.attention = attention; this.base = new THREE.Vector3(...pos); this.s = scale;
      this.root.position.copy(this.base); this.root.rotation.y = yaw; this.root.scale.setScalar(scale);
      this.root.traverse(o => { if (o.isMesh && /perch/i.test(o.name + (o.parent?.name || ""))) o.visible = perch; });
      this.root.visible = !hidden;
      stage.scene.add(this.root); this.root.updateMatrixWorld(true);
      this.b = {}; this.root.traverse(o => { if (o.isBone) this.b[o.name] = o; });
      const rootQ = this.root.getWorldQuaternion(new THREE.Quaternion()).invert();
      for (const k in this.b) { const bone = this.b[k];
        bone.userData.rest = bone.quaternion.clone();
        bone.userData.model = rootQ.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion()));
        bone.userData.scale = bone.scale.clone(); }
      this.eyes = EYES.map(src => {               // gold eyes: Odin's ravens see everything
        const eye = new THREE.Group(); eye.position.copy(this.b.Head.worldToLocal(this.root.localToWorld(src.clone())));
        eye.add(new THREE.Mesh(new THREE.SphereGeometry(.0068, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffcf73 })));
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); glow.scale.setScalar(.05);
        eye.add(glow); this.b.Head.add(eye); return eye; });
      this.yaw = this.pitch = this.roll = 0; this.vy = this.vp = this.vr = 0;
      this.aim = { yaw: 0, pitch: 0, roll: 0 }; this.nextSnap = 0; this.nextTilt = rnd(2, 5); this.nextBlink = rnd(2, 6); this.blink = 0;
      this.nextRuffle = rnd(7, 16); this.ruffle = 1; this.nextFlick = rnd(3, 8); this.flick = 1; this.seed = rnd(0, 10); this.landT = 1;
    }
    anglesTo(world) {
      const l = this.root.worldToLocal(world.clone());
      return { yaw: clamp(Math.atan2(-l.z, l.x), -78 * DEG, 78 * DEG), pitch: clamp(Math.atan2(l.y - .67, Math.hypot(l.x, l.z)), -34 * DEG, 38 * DEG) };
    }
    setBone(name, yaw, pitch, roll) {
      const b = this.b[name], q = new THREE.Quaternion().setFromEuler(new THREE.Euler(roll, yaw, pitch, "YZX"));
      const m = b.userData.model; b.quaternion.copy(b.userData.rest).multiply(m.clone().invert().multiply(q).multiply(m));
    }
    land() { this.root.visible = true; this.landT = 0; this.vp = -9; this.aim.pitch = -20 * DEG; this.ruffle = .15; }
    update(t, dt, look) {
      // Birds don't pan their heads: they snap between fixed gazes and hold them. A stiff spring does the snap.
      if (t > this.nextSnap) {
        const watching = look && Math.random() < this.attention;
        const tgt = watching ? this.anglesTo(look) : { yaw: rnd(-65, 40) * DEG, pitch: rnd(-18, 22) * DEG };
        if (!watching || Math.abs(tgt.yaw - this.aim.yaw) + Math.abs(tgt.pitch - this.aim.pitch) > 5 * DEG) { this.aim.yaw = tgt.yaw; this.aim.pitch = tgt.pitch; }
        this.nextSnap = t + (watching ? rnd(.25, .9) : rnd(.9, 2.6));
      }
      if (t > this.nextTilt) { this.aim.roll = Math.random() < .45 ? rnd(-24, 24) * DEG : 0; this.nextTilt = t + rnd(1.6, 5); }
      const K = 210, D = 21;
      for (const [p, v] of [["yaw", "vy"], ["pitch", "vp"], ["roll", "vr"]]) { this[v] += ((this.aim[p] - this[p]) * K - this[v] * D) * dt; this[p] += this[v] * dt; }
      this.setBone("Neck", this.yaw * .34, this.pitch * .3, this.roll * .25);
      this.setBone("Head", this.yaw * .66, this.pitch * .7, this.roll * .75);
      if (t > this.nextRuffle) { this.ruffle = 0; this.nextRuffle = t + rnd(10, 22); }
      if (t > this.nextFlick) { this.flick = 0; this.nextFlick = t + rnd(4, 11); }
      this.ruffle = Math.min(1, this.ruffle + dt / .9); this.flick = Math.min(1, this.flick + dt / .5);
      const rf = Math.sin(this.ruffle * Math.PI), shake = Math.sin(this.ruffle * 34) * (1 - this.ruffle) * rf;
      const breath = Math.sin(t * 2.1 + this.seed) * .011;
      const bs = this.b.Body.userData.scale; this.b.Body.scale.set(bs.x * (1 + breath + rf * .05), bs.y * (1 + rf * .02), bs.z * (1 + breath * 1.4 + rf * .06));
      this.setBone("Body", 0, Math.sin(t * .7 + this.seed) * .012, shake * .09);
      this.setBone("Tail", shake * .1, -Math.sin(this.flick * Math.PI) * .2 + Math.sin(t * 1.3 + this.seed) * .015, 0);
      if (this.landT < 1) {   // touchdown: drop the last few centimetres, squash a little, settle
        this.landT = Math.min(1, this.landT + dt / .55); const k = this.landT, drop = (1 - k) ** 3 * .07, sq = Math.sin(k * Math.PI) * .05 * (1 - k);
        this.root.position.y = this.base.y + drop * this.s; this.root.scale.set(this.s * (1 + sq), this.s * (1 - sq), this.s * (1 + sq));
      }
      if (t > this.nextBlink) { this.blink = 1; this.nextBlink = t + rnd(2.2, 7); }
      this.blink = Math.max(0, this.blink - dt / .16);
      const open = 1 - Math.sin(this.blink * Math.PI);
      for (const e of this.eyes) e.scale.set(1, Math.max(.06, open), 1);
    }
  }

  class Stage {
    constructor(host, camera, fit) { this.host = host; this.camera = camera; this.fitCam = fit; this.scene = new THREE.Scene(); this.lights = addLights(this.scene); this.birds = []; this.reveal = 0; this.revealTo = 0; this.visible = false; this.look = null; }
    fit() { const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); this.fitCam(w, h); }
    light() { this.lights.forEach(([l, max], i) => { const k = i === 2 || i === 3 ? clamp(this.reveal * 2.2, 0, 1) : clamp(this.reveal * 1.6 - .6, 0, 1); l.intensity = max * k * k; }); }
  }

  // ---- hero: two ravens on their perches (perspective camera)
  const heroCam = new THREE.PerspectiveCamera(26, 1, .1, 30);
  const hero = new Stage(document.querySelector(".birds"), heroCam, (w, h) => {
    heroCam.aspect = w / h; heroCam.position.set(0, .47, Math.max(2.75, 3.75 / heroCam.aspect)); heroCam.lookAt(0, .44, 0); heroCam.updateProjectionMatrix(); });
  // ---- finale: ravens land on Odin's shoulders. An orthographic camera matches Odin's SVG viewBox (-100 0 800 800),
  // so a point in the drawing is the same point in 3D (y flipped).
  const finCam = new THREE.OrthographicCamera(-100, 700, 0, -800, .1, 3000); finCam.position.set(0, 0, 1000);
  const finale = new Stage(document.querySelector(".odin-3d"), finCam, () => {});
  finale.reveal = finale.revealTo = 1; finale.light();
  const stages = [hero, finale].filter(s => s.host);

  let active = null;
  const pick = () => {
    const next = finale.host && finale.visible ? finale : hero.visible ? hero : null;
    if (next === active) return;
    active = next; if (!active) return;
    active.host.appendChild(canvas); active.fit(); canvas.classList.toggle("on-hero", active === hero);
  };
  const io = new IntersectionObserver(es => { es.forEach(e => { const s = stages.find(s => s.host === e.target); if (s) s.visible = e.isIntersecting; }); pick(); }, { rootMargin: "120px 0px" });
  stages.forEach(s => io.observe(s.host));
  addEventListener("resize", () => active && active.fit());

  // ---- pointer → a world point for the hero ravens to watch
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5), look = new THREE.Vector3(0, .6, 1.5);
  let lookLive = false, lastMove = 0;
  addEventListener("pointermove", e => {
    if (active !== hero) return;
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, heroCam); if (ray.ray.intersectPlane(plane, look)) { lookLive = true; lastMove = performance.now(); }
  }, { passive: true });

  const draco = new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/");
  api.ready = new GLTFLoader().setDRACOLoader(draco).loadAsync("blackwing/raven.glb").then(gltf => {
    gltf.scene.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const m = o.material;
      m.color.setScalar(.5); m.roughness = .6; m.metalness = .08; if (m.normalScale) m.normalScale.setScalar(1.2); if (m.map) m.map.anisotropy = 4; } });
    gltf.scene.updateMatrixWorld(true);
    const rc = new THREE.Raycaster(), mesh = []; gltf.scene.traverse(o => o.isMesh && !/perch/i.test(o.name) && mesh.push(o));
    EYES = [-1, 1].map(s => { rc.set(new THREE.Vector3(.2085, .6905, s * .3), new THREE.Vector3(0, 0, -s)); const h = rc.intersectObjects(mesh, false)[0];
      return h ? h.point.clone().add(new THREE.Vector3(0, 0, s * .0015)) : new THREE.Vector3(.2085, .6905, s * .0335); });
    if (hero.host) {
      hero.birds.push(new Raven(gltf.scene, hero, { pos: [.36, -.04, .28], yaw: -.52, attention: .92 }));          // Huginn watches you
      hero.birds.push(new Raven(gltf.scene, hero, { pos: [-.4, .2, -.3], yaw: Math.PI + .48, scale: .9, attention: .3 })); // Muninn looks elsewhere
    }
    api.src = gltf.scene; api.ok = true; pick();
    document.documentElement.classList.add("ravens-3d");
  }).catch(err => { console.warn("Raven model failed to load", err); });

  addEventListener("bw:hero", () => { hero.revealTo = 1; });
  if (window.__bwHero || reduce) hero.revealTo = 1;

  // ---- render loop: only the visible scene, only while the tab is visible, at most 30 fps
  let last = 0, prev = 0, heroAway = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!api.ok || !active || document.hidden || window.blackwing?.isPaused?.() || (active === hero && heroAway)) { prev = now; return; }
    if (now - last < 32) return; last = now;
    const real = (now - (prev || now)) / 1000, dt = reduce ? 0 : Math.min(.05, real), t = now / 1000; prev = now;
    const s = active;
    if (s.reveal !== s.revealTo) { s.reveal = Math.min(s.revealTo, s.reveal + real / 2.4); s.light(); }
    const tgt = s === hero ? (lookLive && now - lastMove < 6000 ? look : null) : null;
    for (const b of s.birds) { b.update(t, dt, b.look || tgt); for (const e of b.eyes) e.visible = s.reveal > .25; }
    renderer.render(s.scene, s.camera);
  }
  requestAnimationFrame(frame);
  if (reduce) { hero.revealTo = hero.reveal = 1; hero.light(); }

  // ---- API for blackwing.js
  const tmp = new THREE.Vector3();
  api.heroHeads = () => hero.birds.map(b => { b.b.Head.getWorldPosition(tmp); tmp.project(heroCam); const r = hero.host.getBoundingClientRect();
    return [r.left + (tmp.x + 1) / 2 * r.width, r.top + (1 - tmp.y) / 2 * r.height]; });
  api.setHeroAway = v => { heroAway = v; };
  // shoulders: [[x, y, facing], ...] in Odin's SVG units; birds stand with their toes on those points
  api.perchOnOdin = (shoulders, ears, landed) => api.ready.then(() => {
    if (finale.birds.length) return;
    const S = 280, FEET = .29;
    shoulders.forEach(([x, y, face], i) => {
      const b = new Raven(api.src, finale, { pos: [x, -y - FEET * S, 40 + i * 5], yaw: face > 0 ? -.35 : Math.PI + .35, scale: S, attention: .7, perch: false, hidden: !landed });
      b.look = new THREE.Vector3(ears[i][0], -ears[i][1], 60);   // they whisper into his ears
      finale.birds.push(b);
    });
  });
  api.land = i => finale.birds[i] && finale.birds[i].land();
  api.odinScreen = (x, y) => { const r = finale.host.getBoundingClientRect(); return [r.left + (x + 100) / 800 * r.width, r.top + y / 800 * r.height]; };
}
