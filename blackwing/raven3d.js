// Huginn and Muninn on their perches: the only real-time 3D on the page.
// Model: "Common raven" by Virtual Museums of Małopolska (CC0), rigged in Blender (Root > Body > Neck > Head, Tail + Perch).
// Everything else (Odin, the flying ravens, the well) is 2D, rendered from 3D in Blender or drawn on a canvas.
// Renders only while the hero is on screen, at most 30 fps.
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEG = Math.PI / 180;
const api = window.blackwing3d = { ok: false };
const host = document.querySelector(".birds");

let renderer;
try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { /* no WebGL: the page still works */ }

if (renderer && host) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement; canvas.id = "raven3d"; canvas.className = "on-hero"; canvas.setAttribute("aria-hidden", "true");
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, .1, 30);
  const dir = (c, x, y, z) => { const l = new THREE.DirectionalLight(c, 0); l.position.set(x, y, z); scene.add(l); return l; };
  const amb = new THREE.AmbientLight(0x2a2c44, 0); scene.add(amb);
  // moonlight key, violet and teal rims (the iridescence of real raven feathers), a faint gold from below
  const lights = [[amb, .5], [dir(0xe8ecff, -1.2, 2.4, 2.6), 2.6], [dir(0x7f8dff, -2.4, 1.6, -2.2), 2.6], [dir(0x45d6c4, 2.6, 1.0, -2.0), 2.0], [dir(0xd9a94a, 0, -1.6, 1.4), .55]];
  let reveal = 0, revealTo = 0;
  const light = () => lights.forEach(([l, max], i) => { const k = i === 2 || i === 3 ? clamp(reveal * 2.2, 0, 1) : clamp(reveal * 1.6 - .6, 0, 1); l.intensity = max * k * k; });
  const fit = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.position.set(0, .47, Math.max(2.75, 3.75 / cam.aspect)); cam.lookAt(0, .44, 0); cam.updateProjectionMatrix(); };
  const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,226,150,1)"); r.addColorStop(.25, "rgba(232,180,80,.55)"); r.addColorStop(1, "rgba(200,140,40,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();

  let EYES = [];
  class Raven {
    constructor(src, { pos, yaw, scale = 1, attention }) {
      this.root = cloneSkinned(src); this.attention = attention;
      this.root.position.set(...pos); this.root.rotation.y = yaw; this.root.scale.setScalar(scale);
      scene.add(this.root); this.root.updateMatrixWorld(true);
      this.b = {}; this.root.traverse(o => { if (o.isBone) this.b[o.name] = o; });
      const rootQ = this.root.getWorldQuaternion(new THREE.Quaternion()).invert();
      for (const k in this.b) { const bone = this.b[k]; bone.userData.rest = bone.quaternion.clone();
        bone.userData.model = rootQ.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion())); bone.userData.scale = bone.scale.clone(); }
      this.eyes = EYES.map(src => { const e = new THREE.Group(); e.position.copy(this.b.Head.worldToLocal(this.root.localToWorld(src.clone())));
        const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); g.scale.setScalar(.05);
        e.add(new THREE.Mesh(new THREE.SphereGeometry(.0068, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffcf73 })), g); this.b.Head.add(e); return e; });
      this.yaw = this.pitch = this.roll = 0; this.vy = this.vp = this.vr = 0;
      this.aim = { yaw: 0, pitch: 0, roll: 0 }; this.nextSnap = 0; this.nextTilt = rnd(2, 5); this.nextBlink = rnd(2, 6); this.blink = 0;
      this.nextRuffle = rnd(7, 16); this.ruffle = 1; this.nextFlick = rnd(3, 8); this.flick = 1; this.seed = rnd(0, 10);
    }
    anglesTo(w) { const l = this.root.worldToLocal(w.clone()); return { yaw: clamp(Math.atan2(-l.z, l.x), -78 * DEG, 78 * DEG), pitch: clamp(Math.atan2(l.y - .67, Math.hypot(l.x, l.z)), -34 * DEG, 38 * DEG) }; }
    setBone(n, yaw, pitch, roll) { const b = this.b[n], q = new THREE.Quaternion().setFromEuler(new THREE.Euler(roll, yaw, pitch, "YZX")), m = b.userData.model;
      b.quaternion.copy(b.userData.rest).multiply(m.clone().invert().multiply(q).multiply(m)); }
    update(t, dt, look) {
      // birds snap between fixed gazes instead of panning: a stiff spring does the snap
      if (t > this.nextSnap) {
        const watching = look && Math.random() < this.attention;
        const tgt = watching ? this.anglesTo(look) : { yaw: rnd(-65, 40) * DEG, pitch: rnd(-18, 22) * DEG };
        if (!watching || Math.abs(tgt.yaw - this.aim.yaw) + Math.abs(tgt.pitch - this.aim.pitch) > 5 * DEG) { this.aim.yaw = tgt.yaw; this.aim.pitch = tgt.pitch; }
        this.nextSnap = t + (watching ? rnd(.25, .9) : rnd(.9, 2.6));
      }
      if (t > this.nextTilt) { this.aim.roll = Math.random() < .45 ? rnd(-24, 24) * DEG : 0; this.nextTilt = t + rnd(1.6, 5); }
      for (const [p, v] of [["yaw", "vy"], ["pitch", "vp"], ["roll", "vr"]]) { this[v] += ((this.aim[p] - this[p]) * 210 - this[v] * 21) * dt; this[p] += this[v] * dt; }
      this.setBone("Neck", this.yaw * .34, this.pitch * .3, this.roll * .25); this.setBone("Head", this.yaw * .66, this.pitch * .7, this.roll * .75);
      if (t > this.nextRuffle) { this.ruffle = 0; this.nextRuffle = t + rnd(10, 22); }
      if (t > this.nextFlick) { this.flick = 0; this.nextFlick = t + rnd(4, 11); }
      this.ruffle = Math.min(1, this.ruffle + dt / .9); this.flick = Math.min(1, this.flick + dt / .5);
      const rf = Math.sin(this.ruffle * Math.PI), shake = Math.sin(this.ruffle * 34) * (1 - this.ruffle) * rf, breath = Math.sin(t * 2.1 + this.seed) * .011;
      const bs = this.b.Body.userData.scale; this.b.Body.scale.set(bs.x * (1 + breath + rf * .05), bs.y * (1 + rf * .02), bs.z * (1 + breath * 1.4 + rf * .06));
      this.setBone("Body", 0, Math.sin(t * .7 + this.seed) * .012, shake * .09);
      this.setBone("Tail", shake * .1, -Math.sin(this.flick * Math.PI) * .2 + Math.sin(t * 1.3 + this.seed) * .015, 0);
      if (t > this.nextBlink) { this.blink = 1; this.nextBlink = t + rnd(2.2, 7); }
      this.blink = Math.max(0, this.blink - dt / .16); const open = 1 - Math.sin(this.blink * Math.PI);
      for (const e of this.eyes) { e.scale.set(1, Math.max(.06, open), 1); e.visible = reveal > .25; }
    }
  }

  const birds = [];
  new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/"))
    .loadAsync("blackwing/raven.glb").then(gltf => {
      gltf.scene.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const m = o.material;
        m.color.setScalar(.5); m.roughness = .6; m.metalness = .08; if (m.normalScale) m.normalScale.setScalar(1.2); if (m.map) m.map.anisotropy = 4; } });
      gltf.scene.updateMatrixWorld(true);
      const rc = new THREE.Raycaster(), mesh = []; gltf.scene.traverse(o => o.isMesh && !/perch/i.test(o.name) && mesh.push(o));
      EYES = [-1, 1].map(s => { rc.set(new THREE.Vector3(.2085, .6905, s * .3), new THREE.Vector3(0, 0, -s)); const h = rc.intersectObjects(mesh, false)[0];
        return h ? h.point.clone().add(new THREE.Vector3(0, 0, s * .0015)) : new THREE.Vector3(.2085, .6905, s * .0335); });
      birds.push(new Raven(gltf.scene, { pos: [.36, -.04, .28], yaw: -.52, attention: .92 }), new Raven(gltf.scene, { pos: [-.4, .2, -.3], yaw: Math.PI + .48, scale: .9, attention: .3 }));
      host.appendChild(canvas); fit(); api.ok = true; document.documentElement.classList.add("ravens-3d");
    }).catch(err => console.warn("Raven model failed to load", err));

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "80px 0px" }).observe(host);
  addEventListener("resize", fit);
  addEventListener("bw:hero", () => { revealTo = 1; });
  if (window.__bwHero || reduce) revealTo = 1;

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5), look = new THREE.Vector3(0, .6, 1.5);
  let lookLive = false, lastMove = 0;
  addEventListener("pointermove", e => {
    if (!visible || !api.ok) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam); if (ray.ray.intersectPlane(plane, look)) { lookLive = true; lastMove = performance.now(); }
  }, { passive: true });

  let last = 0, prev = 0, away = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!api.ok || !visible || away || document.hidden || window.blackwing?.isPaused?.()) { prev = now; return; }
    if (now - last < 32) return; last = now;
    const real = (now - (prev || now)) / 1000, dt = reduce ? 0 : Math.min(.05, real), t = now / 1000; prev = now;
    if (reveal !== revealTo) { reveal = Math.min(revealTo, reveal + real / 2.4); light(); }
    const tgt = lookLive && now - lastMove < 6000 ? look : null;
    for (const b of birds) b.update(t, dt, tgt);
    renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
  if (reduce) { reveal = revealTo = 1; light(); }

  const tmp = new THREE.Vector3();
  api.heroHeads = () => birds.map(b => { b.b.Head.getWorldPosition(tmp); tmp.project(cam); const r = host.getBoundingClientRect();
    return [r.left + (tmp.x + 1) / 2 * r.width, r.top + (1 - tmp.y) / 2 * r.height]; });
  api.setHeroAway = v => { away = v; };
}
