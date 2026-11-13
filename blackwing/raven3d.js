// BLACKWING 3D: three scenes, ONE WebGL context. The canvas moves to whichever scene is on screen
// (hero ravens → Mímir's Well → Odin), renders only while visible, at most 30 fps, and each model loads
// only when you get near its scene.
// Models: "Common raven" by Virtual Museums of Małopolska (CC0), rigged in Blender (Root > Body > Neck > Head, Tail + Perch).
//         "ODIN Alföðr" by Tom Holbein / VDCnordic (CC BY 4.0), decimated, its sculpted ravens cut away for the real ones.
//         "Realistic Human Eye" by Alexander Antipov (CC BY 4.0).
import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { clone as cloneSkinned } from "three/addons/utils/SkeletonUtils.js";

const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const DEG = Math.PI / 180;
const api = window.blackwing3d = { ok: false };

let renderer;
try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { document.documentElement.classList.add("no-webgl"); }

if (renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.15;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement; canvas.id = "raven3d"; canvas.setAttribute("aria-hidden", "true");
  const loader = new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/draco/gltf/"));
  const once = url => { let p; return () => p || (p = loader.loadAsync(url)); };
  const loadRaven = once("blackwing/raven.glb"), loadOdin = once("blackwing/odin.glb"), loadEye = once("blackwing/eye.glb");

  const glowTex = (() => { const c = document.createElement("canvas"); c.width = c.height = 64; const g = c.getContext("2d");
    const r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, "rgba(255,230,160,1)"); r.addColorStop(.22, "rgba(240,185,80,.6)"); r.addColorStop(1, "rgba(200,140,40,0)");
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; })();
  const glow = size => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true })); s.scale.setScalar(size); return s; };
  // Moonlight key, violet and teal rims (the iridescence of real raven feathers), a faint gold from below.
  function addLights(scene, k = 1) {
    const dir = (c, x, y, z) => { const l = new THREE.DirectionalLight(c, 0); l.position.set(x, y, z); scene.add(l); return l; };
    const amb = new THREE.AmbientLight(0x2a2c44, 0); scene.add(amb);
    return [[amb, .5 * k], [dir(0xe8ecff, -1.2, 2.4, 2.6), 2.6 * k], [dir(0x7f8dff, -2.4, 1.6, -2.2), 2.6], [dir(0x45d6c4, 2.6, 1.0, -2.0), 2.0], [dir(0xd9a94a, 0, -1.6, 1.4), .55]];
  }

  /* ---------------- ravens ---------------- */
  let RAVEN = null, EYES = [];
  const ravenReady = () => RAVEN ? Promise.resolve(RAVEN) : loadRaven().then(gltf => {
    gltf.scene.traverse(o => { if (o.isMesh) { o.frustumCulled = false; const m = o.material;
      m.color.setScalar(.5); m.roughness = .6; m.metalness = .08; if (m.normalScale) m.normalScale.setScalar(1.2); if (m.map) m.map.anisotropy = 4; } });
    gltf.scene.updateMatrixWorld(true);
    const rc = new THREE.Raycaster(), mesh = []; gltf.scene.traverse(o => o.isMesh && !/perch/i.test(o.name) && mesh.push(o));
    EYES = [-1, 1].map(s => { rc.set(new THREE.Vector3(.2085, .6905, s * .3), new THREE.Vector3(0, 0, -s)); const h = rc.intersectObjects(mesh, false)[0];
      return h ? h.point.clone().add(new THREE.Vector3(0, 0, s * .0015)) : new THREE.Vector3(.2085, .6905, s * .0335); });
    return (RAVEN = gltf.scene);
  });
  class Raven {
    constructor(stage, { pos, yaw, scale = 1, attention, perch = true, hidden = false }) {
      this.root = cloneSkinned(RAVEN); this.attention = attention; this.base = new THREE.Vector3(...pos); this.s = scale;
      this.root.position.copy(this.base); this.root.rotation.y = yaw; this.root.scale.setScalar(scale);
      this.root.traverse(o => { if (o.isMesh && /perch/i.test(o.name + (o.parent?.name || ""))) o.visible = perch; });
      this.root.visible = !hidden; stage.scene.add(this.root); this.root.updateMatrixWorld(true);
      this.b = {}; this.root.traverse(o => { if (o.isBone) this.b[o.name] = o; });
      const rootQ = this.root.getWorldQuaternion(new THREE.Quaternion()).invert();
      for (const k in this.b) { const bone = this.b[k]; bone.userData.rest = bone.quaternion.clone();
        bone.userData.model = rootQ.clone().multiply(bone.getWorldQuaternion(new THREE.Quaternion())); bone.userData.scale = bone.scale.clone(); }
      this.eyes = EYES.map(src => { const e = new THREE.Group(); e.position.copy(this.b.Head.worldToLocal(this.root.localToWorld(src.clone())));
        e.add(new THREE.Mesh(new THREE.SphereGeometry(.0068, 12, 10), new THREE.MeshBasicMaterial({ color: 0xffcf73 })), glow(.05)); this.b.Head.add(e); return e; });
      this.yaw = this.pitch = this.roll = 0; this.vy = this.vp = this.vr = 0;
      this.aim = { yaw: 0, pitch: 0, roll: 0 }; this.nextSnap = 0; this.nextTilt = rnd(2, 5); this.nextBlink = rnd(2, 6); this.blink = 0;
      this.nextRuffle = rnd(7, 16); this.ruffle = 1; this.nextFlick = rnd(3, 8); this.flick = 1; this.seed = rnd(0, 10); this.landT = 1;
    }
    anglesTo(w) { const l = this.root.worldToLocal(w.clone()); return { yaw: clamp(Math.atan2(-l.z, l.x), -78 * DEG, 78 * DEG), pitch: clamp(Math.atan2(l.y - .67, Math.hypot(l.x, l.z)), -34 * DEG, 38 * DEG) }; }
    setBone(n, yaw, pitch, roll) { const b = this.b[n], q = new THREE.Quaternion().setFromEuler(new THREE.Euler(roll, yaw, pitch, "YZX")), m = b.userData.model;
      b.quaternion.copy(b.userData.rest).multiply(m.clone().invert().multiply(q).multiply(m)); }
    land() { this.root.visible = true; this.landT = 0; this.vp = -9; this.aim.pitch = -20 * DEG; this.ruffle = .15; }
    update(t, dt, look) {
      // birds snap between fixed gazes rather than panning: a stiff spring does the snap
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
      if (this.landT < 1) { this.landT = Math.min(1, this.landT + dt / .55); const k = this.landT, drop = (1 - k) ** 3 * .07, sq = Math.sin(k * Math.PI) * .05 * (1 - k);
        this.root.position.y = this.base.y + drop * this.s; this.root.scale.set(this.s * (1 + sq), this.s * (1 - sq), this.s * (1 + sq)); }
      if (t > this.nextBlink) { this.blink = 1; this.nextBlink = t + rnd(2.2, 7); }
      this.blink = Math.max(0, this.blink - dt / .16); const open = 1 - Math.sin(this.blink * Math.PI);
      for (const e of this.eyes) e.scale.set(1, Math.max(.06, open), 1);
    }
  }

  /* ---------------- stages ---------------- */
  class Stage {
    constructor(host, camera, fit, k) { this.host = host; this.camera = camera; this.fitCam = fit; this.scene = new THREE.Scene(); this.lights = addLights(this.scene, k);
      this.birds = []; this.reveal = 0; this.revealTo = 0; this.visible = false; this.ready = false; }
    fit() { const w = this.host.clientWidth, h = this.host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); this.fitCam(w, h); this.onFit?.(w, h); }
    light() { this.lights.forEach(([l, max], i) => { const k = i === 2 || i === 3 ? clamp(this.reveal * 2.2, 0, 1) : clamp(this.reveal * 1.6 - .6, 0, 1); l.intensity = max * k * k; }); }
    render() { renderer.render(this.scene, this.camera); }
  }
  const perspective = (fov, pos, at) => { const c = new THREE.PerspectiveCamera(fov, 1, .05, 30); c.position.set(...pos); c.lookAt(...at);
    return [c, (w, h) => { c.aspect = w / h; c.updateProjectionMatrix(); }]; };

  // HERO: Huginn and Muninn on their perches
  const heroCam = new THREE.PerspectiveCamera(26, 1, .1, 30);
  const hero = new Stage(document.querySelector(".birds"), heroCam, (w, h) => {
    heroCam.aspect = w / h; heroCam.position.set(0, .47, Math.max(2.75, 3.75 / heroCam.aspect)); heroCam.lookAt(0, .44, 0); heroCam.updateProjectionMatrix(); });
  hero.prepare = () => ravenReady().then(() => {
    hero.birds.push(new Raven(hero, { pos: [.36, -.04, .28], yaw: -.52, attention: .92 }), new Raven(hero, { pos: [-.4, .2, -.3], yaw: Math.PI + .48, scale: .9, attention: .3 }));
    hero.ready = true; api.ok = true; document.documentElement.classList.add("ravens-3d"); });

  // MÍMIR'S WELL: a real eye at the bottom of the water, seen through a rippling surface (render-to-texture refraction)
  const [wellCam, wellFit] = perspective(30, [0, 2.15, 2.25], [0, -.12, 0]);
  const well = new Stage(document.querySelector(".well-3d"), wellCam, wellFit, .6);
  const ripples = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 9, 0));
  let ripI = 0; const addRipple = (x, z, a = 1) => { ripples[ripI].set(x, z, 0, a); ripI = (ripI + 1) % 8; };
  well.prepare = () => loadEye().then(gltf => {
    const deep = new THREE.Scene(); deep.background = new THREE.Color(0x05060c);
    deep.add(new THREE.AmbientLight(0x30324a, .8));
    const key = new THREE.DirectionalLight(0xdfe6ff, 1.4); key.position.set(-1, 3, 2); deep.add(key);
    const gold = new THREE.PointLight(0xffc56b, 0, 3, 1.6); gold.position.set(0, .2, .3); deep.add(gold);
    const eye = gltf.scene; eye.scale.setScalar(.82); eye.position.set(0, -.52, 0); deep.add(eye);
    eye.traverse(o => { if (!o.isMesh) return; const m = o.material;
      if (m.map) { m.color.setRGB(1, .95, .86); m.emissive = new THREE.Color(0xffa63a); m.emissiveMap = m.map; m.emissiveIntensity = .09; m.roughness = .35; }  // Odin's gold
      else { m.transparent = true; m.opacity = .28; m.roughness = .02; m.metalness = 0; m.depthWrite = false; } });                        // the cornea
    const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.02, .92, 1.6, 48, 1, true), new THREE.MeshStandardMaterial({ color: 0x15141c, roughness: 1, side: THREE.BackSide }));
    wall.position.y = -.75; deep.add(wall);
    const halo = glow(.75); halo.position.set(0, -.25, .2); deep.add(halo);
    const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
    const water = new THREE.Mesh(new THREE.CircleGeometry(1, 96).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
      uniforms: { tScene: { value: rt.texture }, res: { value: new THREE.Vector2(1, 1) }, time: { value: 0 }, rip: { value: ripples } },
      vertexShader: `varying vec3 vPos; void main(){ vec4 w = modelMatrix * vec4(position,1.); vPos = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
      fragmentShader: `uniform sampler2D tScene; uniform vec2 res; uniform float time; uniform vec4 rip[8]; varying vec3 vPos;
        void main(){
          vec2 p = vPos.xz, g = vec2(cos(p.x*5.+time*1.1)+cos(p.x*9.-p.y*4.+time*.7), cos(p.y*6.-time*.9)+cos(p.y*11.+p.x*3.+time*1.3))*.004;
          for (int i = 0; i < 8; i++) { vec4 r = rip[i]; if (r.w <= 0.) continue; vec2 d = p - r.xy; float dist = length(d) + 1e-4, age = r.z;
            float k = exp(-pow((dist - age*.65)*6., 2.)) * exp(-age*1.2) * r.w; g += d/dist * cos(dist*38. - age*13.) * k * .05; }
          vec3 col = texture2D(tScene, gl_FragCoord.xy/res + g*1.6).rgb;
          vec3 n = normalize(vec3(-g.x*9., 1., -g.y*9.)), V = normalize(cameraPosition - vPos);
          float fres = pow(1. - max(dot(n, V), 0.), 3.);
          col = mix(col * vec3(.78, .86, 1.), vec3(.06, .06, .12), fres * .55);
          vec3 H = normalize(normalize(vec3(-.4, 1., .3)) + V); col += vec3(.72, .78, 1.) * pow(max(dot(n, H), 0.), 140.) * .9;
          col *= 1. - smoothstep(.72, 1., length(p)) * .7;
          gl_FragColor = vec4(col, 1.);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }` }));
    well.scene.add(water);
    // the rim: a ring of fitted, rough stones (instanced, one draw call)
    const stoneGeo = new THREE.DodecahedronGeometry(.13, 0), stones = new THREE.InstancedMesh(stoneGeo, new THREE.MeshStandardMaterial({ color: 0x3a3631, roughness: .95, flatShading: true }), 58);
    const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
    for (let i = 0; i < 58; i++) { const ring = i < 34 ? 0 : 1, n = ring ? 24 : 34, j = ring ? i - 34 : i, a = (j + (ring ? .5 : 0)) / n * Math.PI * 2, r = ring ? 1.3 : 1.12;
      Q.setFromEuler(E.set(rnd(0, 3), rnd(0, 3), rnd(0, 3)));
      M.compose(new THREE.Vector3(Math.cos(a) * r, ring ? -.1 : .02, Math.sin(a) * r), Q, new THREE.Vector3(rnd(.9, 1.3), rnd(.6, .9), rnd(.9, 1.2)).multiplyScalar(ring ? 1.2 : 1));
      stones.setMatrixAt(i, M); }
    well.scene.add(stones);
    const emberLight = new THREE.PointLight(0xffb25a, 1.2, 2.5, 1.5); emberLight.position.set(0, .15, 0); well.scene.add(emberLight);   // the eye lights the stones from below
    well.onFit = (w, h) => { const d = renderer.getPixelRatio() * .75; rt.setSize(Math.round(w * d), Math.round(h * d)); water.material.uniforms.res.value.set(w * renderer.getPixelRatio(), h * renderer.getPixelRatio()); };
    well.reveal = well.revealTo = 1; well.light();
    // the eye looks at what you point at; it drifts with small saccades otherwise
    const lookAt = new THREE.Vector3(0, 2, 2.2), cur = new THREE.Vector3(0, 2, 2.2);
    let nextSac = 0, glowT = 0;
    well.update = (t, dt) => {
      if (t > nextSac && !well.pointerLive) { lookAt.set(rnd(-.8, .8), 1.4, rnd(.6, 1.6)); nextSac = t + rnd(1.2, 3.2); }
      cur.lerp(lookAt, 1 - Math.exp(-dt * 9)); eye.lookAt(cur);
      glowT += dt; const pulse = .75 + Math.sin(glowT * 1.6) * .25; gold.intensity = 1.1 * pulse; halo.material.opacity = .28 * pulse; emberLight.intensity = 1.1 * pulse;
      water.material.uniforms.time.value = t;
      for (const r of ripples) if (r.w > 0) { r.z += dt; if (r.z > 4) r.w = 0; }
    };
    well.render = () => { renderer.setRenderTarget(rt); renderer.render(deep, wellCam); renderer.setRenderTarget(null); renderer.render(well.scene, wellCam); };
    well.pointer = p => { lookAt.set(p.x, .9, p.z + .4); };
    well.water = water; well.ready = true;
    document.documentElement.classList.add("well-3d-on");
    if (well.visible) pick(true);
  });

  // ODIN: the All-Father as a shadow; one eye burns and lights his hood. The ravens land on his shoulders.
  const [odinCam, odinFit] = perspective(27, [0, .6, 2.15], [0, .52, 0]);
  const finale = new Stage(document.querySelector(".odin-3d"), odinCam, odinFit, .16);
  let odinEye = null, eyeLight = null, eyeGlow = null, wake = 0, wakeTo = 0, flare = 0;
  const perch = [];
  finale.prepare = () => Promise.all([loadOdin(), ravenReady()]).then(([gltf]) => {
    const odin = gltf.scene; finale.scene.add(odin);
    // a shadow, not a painted statue: the model's own gold glow map is turned down to a faint smoulder
    odin.traverse(o => { if (o.isMesh) { const m = o.material; m.color.setScalar(.09); m.roughness = .85; m.metalness = .1; m.emissiveIntensity = .015; } });
    odin.updateMatrixWorld(true);
    const rc = new THREE.Raycaster(), meshes = []; odin.traverse(o => o.isMesh && meshes.push(o));
    const hit = (o, d) => { rc.set(o, d); return rc.intersectObjects(meshes, false)[0]?.point; };
    const eyeAt = hit(new THREE.Vector3(.029, .572, 1), new THREE.Vector3(0, 0, -1)) || new THREE.Vector3(.029, .572, .02);
    odinEye = new THREE.Group(); odinEye.position.copy(eyeAt).add(new THREE.Vector3(0, 0, .006));
    odinEye.add(new THREE.Mesh(new THREE.SphereGeometry(.0068, 12, 10), new THREE.MeshBasicMaterial({ color: 0xfff0c4 })));
    eyeGlow = glow(.13); odinEye.add(eyeGlow); finale.scene.add(odinEye);
    eyeLight = new THREE.PointLight(0xffb85c, 0, .14, 2); eyeLight.position.copy(eyeAt).add(new THREE.Vector3(0, -.01, .05)); finale.scene.add(eyeLight);
    // the ravens perch on the real shoulder surface (found by dropping a ray onto the model)
    const S = .36, FEET = .29;
    [[-.16, -.11, 1], [.17, -.11, -1]].forEach(([x, z, face], i) => {
      const top = hit(new THREE.Vector3(x, 1.2, z), new THREE.Vector3(0, -1, 0)) || new THREE.Vector3(x, .45, z);
      perch.push(top.clone());
      const b = new Raven(finale, { pos: [top.x, top.y - FEET * S, top.z], yaw: face > 0 ? -.3 : Math.PI + .3, scale: S, attention: .7, perch: false, hidden: true });
      b.look = new THREE.Vector3(face > 0 ? -.075 : .075, .575, -.03);    // they whisper into his ears
      finale.birds.push(b);
    });
    finale.reveal = finale.revealTo = 1; finale.light(); finale.lights[2][0].intensity = 4.2; finale.lights[3][0].intensity = 3.2; finale.lights[4][0].intensity = .15; finale.ready = true;
  });
  finale.update = (t, dt) => {
    if (!odinEye) return;
    wake += (wakeTo - wake) * (1 - Math.exp(-dt * 1.6)); flare = Math.max(0, flare - dt * 1.5);
    const k = wake * (.85 + Math.sin(t * 2.3) * .08 + Math.sin(t * 7.1) * .04) + flare * .6;
    eyeLight.intensity = .3 * k; eyeGlow.material.opacity = Math.min(1, .15 + k); odinEye.children[0].material.color.setScalar(.25 + .75 * Math.min(1, k));
  };

  const stages = [hero, well, finale].filter(s => s.host);
  let active = null;
  function pick(force) {
    const next = [finale, well, hero].find(s => s.host && s.visible && s.ready) || null;
    if (next === active && !force) return;
    active = next; if (!active) return;
    active.host.appendChild(canvas); active.fit(); canvas.classList.toggle("on-hero", active === hero);
  }
  const near = new IntersectionObserver(es => es.forEach(e => { const s = stages.find(s => s.host === e.target); if (e.isIntersecting && s && !s.loading) { s.loading = true; s.prepare().then(() => pick(true)).catch(err => console.warn("3D scene failed", err)); } }), { rootMargin: "1200px 0px" });
  const io = new IntersectionObserver(es => { es.forEach(e => { const s = stages.find(s => s.host === e.target); if (s) s.visible = e.isIntersecting; }); pick(); }, { rootMargin: "100px 0px" });
  stages.forEach(s => { near.observe(s.host); io.observe(s.host); });
  addEventListener("resize", () => active && active.fit());

  // pointer: hero ravens watch it; the well's eye follows it and the water ripples under it
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), -1.5), look = new THREE.Vector3(0, .6, 1.5), hitP = new THREE.Vector3();
  let lookLive = false, lastMove = 0, lastRip = 0;
  addEventListener("pointermove", e => {
    if (!active) return;
    const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    if (active === hero) { ray.setFromCamera(ndc, heroCam); if (ray.ray.intersectPlane(plane, look)) { lookLive = true; lastMove = performance.now(); } }
    else if (active === well && well.water) {
      ray.setFromCamera(ndc, wellCam); const h = ray.intersectObject(well.water)[0];
      well.pointerLive = !!h; if (h) { well.pointer(h.point); if (performance.now() - lastRip > 120) { lastRip = performance.now(); addRipple(h.point.x, h.point.z, .8); } }
    }
  }, { passive: true });
  addEventListener("pointerdown", e => { if (active !== well || !well.water) return; const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, wellCam);
    const h = ray.intersectObject(well.water)[0]; if (h) addRipple(h.point.x, h.point.z, 1.4); });
  let nextDrip = 0;

  addEventListener("bw:hero", () => { hero.revealTo = 1; });
  if (window.__bwHero || reduce) hero.revealTo = 1;

  let last = 0, prev = 0, heroAway = false;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!active || document.hidden || window.blackwing?.isPaused?.() || (active === hero && heroAway)) { prev = now; return; }
    if (now - last < 32) return; last = now;
    const real = (now - (prev || now)) / 1000, dt = reduce ? 0 : Math.min(.05, real), t = now / 1000; prev = now;
    const s = active;
    if (s.reveal !== s.revealTo) { s.reveal = Math.min(s.revealTo, s.reveal + real / 2.4); s.light(); }
    if (s === well && t > nextDrip && !reduce) { const a = rnd(0, 6.28), k = Math.sqrt(Math.random()) * .7; addRipple(Math.cos(a) * k, Math.sin(a) * k, .7); nextDrip = t + rnd(2.2, 4.5); }
    s.update?.(t, dt);
    const tgt = s === hero ? (lookLive && now - lastMove < 6000 ? look : null) : null;
    for (const b of s.birds) { b.update(t, dt, b.look || tgt); for (const e of b.eyes) e.visible = s.reveal > .25; }
    s.render();
  }
  requestAnimationFrame(frame);
  if (reduce) { hero.revealTo = hero.reveal = 1; hero.light(); }

  /* ---------------- API for blackwing.js ---------------- */
  const tmp = new THREE.Vector3();
  const toScreen = (v, cam, host) => { tmp.copy(v).project(cam); const r = host.getBoundingClientRect(); return [r.left + (tmp.x + 1) / 2 * r.width, r.top + (1 - tmp.y) / 2 * r.height]; };
  api.heroHeads = () => hero.birds.map(b => { b.b.Head.getWorldPosition(tmp); return toScreen(tmp.clone(), heroCam, hero.host); });
  api.setHeroAway = v => { heroAway = v; };
  api.prepareOdin = () => { if (!finale.loading) { finale.loading = true; finale.prepare().then(() => pick(true)); } return new Promise(res => { const w = () => finale.ready ? res() : setTimeout(w, 100); w(); }); };
  api.odinTargets = () => perch.map(p => toScreen(p.clone().add(new THREE.Vector3(0, .07, 0)), odinCam, finale.host));
  api.birdPx = () => { const a = toScreen(new THREE.Vector3(0, .5, 0), odinCam, finale.host), b = toScreen(new THREE.Vector3(.29, .5, 0), odinCam, finale.host); return Math.abs(b[0] - a[0]); };
  api.land = i => finale.birds[i] && finale.birds[i].land();
  api.landAll = () => finale.birds.forEach(b => { b.root.visible = true; });
  api.wakeOdin = () => { wakeTo = 1; };
  api.flareOdin = () => { flare = 1; };
}
