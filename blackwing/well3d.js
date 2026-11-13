// MÍMIR'S WELL in 3D. Everything here is built in code, no downloaded models:
// a ring of rough-hewn standing stones with glowing carved runes, the roots of Yggdrasil plunging into the water,
// and, at the bottom, Odin's eye as a sigil of light (a gold iris of fibres inside rotating rune rings) rather than a human eyeball.
// The eye is drawn into a render target and seen through a water shader that bends it with every ripple you make.
// Builds only when you get near the section; renders only while visible, at most 30 fps.
import * as THREE from "three";

const host = document.querySelector(".well-3d");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const rnd = (a, b) => a + Math.random() * (b - a);
const RUNES = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ";

if (host) {
  const near = new IntersectionObserver(es => { if (es[0].isIntersecting) { near.disconnect(); build().catch(e => { document.documentElement.classList.add("no-well3d"); console.warn("Well failed", e); }); } }, { rootMargin: "1200px 0px" });
  near.observe(host);
}

async function build() {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" }); } catch { document.documentElement.classList.add("no-well3d"); return; }
  try { await document.fonts?.load('64px "Noto Sans Runic"'); } catch {}
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.1;
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
  const canvas = renderer.domElement; canvas.setAttribute("aria-hidden", "true");
  const cam = new THREE.PerspectiveCamera(30, 1, .05, 40); cam.position.set(0, 2.2, 2.45); cam.lookAt(0, -.2, 0);
  const tex = c => { const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const cnv = (w, h = w) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return [c, c.getContext("2d")]; };
  const add = (mat) => Object.assign(mat, { transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });

  /* ---------- textures painted once ---------- */
  const irisTex = (() => { const R = 256, [c, g] = cnv(R * 2);
    const gr = g.createRadialGradient(R, R, R * .16, R, R, R); gr.addColorStop(0, "rgba(255,244,205,1)"); gr.addColorStop(.3, "rgba(242,196,92,1)"); gr.addColorStop(.66, "rgba(185,115,29,.9)"); gr.addColorStop(.92, "rgba(80,42,11,.6)"); gr.addColorStop(1, "rgba(20,10,4,0)");
    g.fillStyle = gr; g.beginPath(); g.arc(R, R, R, 0, 6.283); g.fill();
    for (let i = 0; i < 900; i++) { const a = Math.random() * 6.283, r0 = R * (.18 + Math.random() * .1), r1 = R * (.5 + Math.random() * .42), b = (Math.random() - .5) * .3;
      g.strokeStyle = Math.random() < .6 ? `rgba(255,236,180,${(.05 + Math.random() * .22).toFixed(2)})` : `rgba(60,28,6,${(.08 + Math.random() * .22).toFixed(2)})`; g.lineWidth = .6 + Math.random() * 1.6;
      g.beginPath(); g.moveTo(R + Math.cos(a) * r0, R + Math.sin(a) * r0); g.quadraticCurveTo(R + Math.cos(a + b) * (r0 + r1) / 2, R + Math.sin(a + b) * (r0 + r1) / 2, R + Math.cos(a) * r1, R + Math.sin(a) * r1); g.stroke(); }
    g.strokeStyle = "rgba(255,220,150,.55)"; g.lineWidth = 3; g.beginPath();
    for (let i = 0; i <= 80; i++) { const a = i / 80 * 6.283, rr = R * (.38 + (i % 2 ? .045 : -.02)); i ? g.lineTo(R + Math.cos(a) * rr, R + Math.sin(a) * rr) : g.moveTo(R + Math.cos(a) * rr, R + Math.sin(a) * rr); } g.stroke();
    return tex(c); })();
  const ringTex = (count, size, inner, color) => { const R = 512, [c, g] = cnv(R * 2);
    g.strokeStyle = color; g.globalAlpha = .55; g.lineWidth = 3; g.beginPath(); g.arc(R, R, R * inner, 0, 6.283); g.stroke(); g.beginPath(); g.arc(R, R, R * (inner + .14), 0, 6.283); g.stroke();
    g.globalAlpha = 1; g.fillStyle = color; g.font = `${size}px "Noto Sans Runic", serif`; g.textAlign = "center"; g.textBaseline = "middle";
    for (let i = 0; i < count; i++) { const a = i / count * 6.283; g.save(); g.translate(R + Math.cos(a) * R * (inner + .07), R + Math.sin(a) * R * (inner + .07)); g.rotate(a + Math.PI / 2); g.fillText(RUNES[i % RUNES.length], 0, 0); g.restore(); }
    return tex(c); };
  const vesicaTex = (() => { const [c, g] = cnv(1024, 512); g.strokeStyle = "rgba(255,226,160,1)"; g.lineWidth = 6; g.shadowColor = "#ffcf73"; g.shadowBlur = 24;
    g.beginPath(); g.moveTo(40, 256); g.quadraticCurveTo(512, -40, 984, 256); g.quadraticCurveTo(512, 552, 40, 256); g.stroke(); return tex(c); })();
  const softTex = (() => { const [c, g] = cnv(128); const r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, "rgba(255,255,255,1)"); r.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return tex(c); })();
  const runeGlyph = ch => { const [c, g] = cnv(128); g.fillStyle = "#ffd27a"; g.shadowColor = "#ffb84d"; g.shadowBlur = 18; g.font = '92px "Noto Sans Runic", serif'; g.textAlign = "center"; g.textBaseline = "middle"; g.fillText(ch, 64, 70); return tex(c); };

  /* ---------- the deep: Odin's eye as a sigil of light (rendered to a texture, seen through the water) ---------- */
  const deep = new THREE.Scene(); deep.background = new THREE.Color(0x04050a);
  deep.add(new THREE.AmbientLight(0x30324a, .7));
  const wall = new THREE.Mesh(new THREE.CylinderGeometry(1.0, .82, 1.9, 40, 1, true), new THREE.MeshStandardMaterial({ color: 0x1b1a20, roughness: 1, side: THREE.BackSide, flatShading: true }));
  wall.position.y = -.95; wall.scale.set(1.05, 1, 1.05); deep.add(wall);
  const eye = new THREE.Group(); eye.position.y = -.5; eye.rotation.x = -Math.PI / 2; deep.add(eye);
  const disc = (t, s, opts = {}) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(s, s), add(new THREE.MeshBasicMaterial({ map: t, ...opts }))); eye.add(m); return m; };
  const halo = disc(softTex, 2.1, { color: 0xe3a83c, opacity: .35 });
  const ringOuter = disc(ringTex(32, 46, .78, "#c9a45c"), 1.75, { opacity: .55 });
  const ringInner = disc(ringTex(20, 40, .62, "#9fe6dc"), 1.25, { opacity: .45 });
  const iris = disc(irisTex, .74);
  const pupil = new THREE.Mesh(new THREE.CircleGeometry(.12, 40), new THREE.MeshBasicMaterial({ color: 0x020203 })); pupil.position.z = .002; eye.add(pupil);
  const vesica = disc(vesicaTex, 1.5, { opacity: .7 }); vesica.scale.set(1, .5, 1);
  const gold = new THREE.PointLight(0xffc56b, 1.6, 2.4, 1.4); gold.position.set(0, -.6, 0); deep.add(gold);
  const motesDeep = (() => { const n = 40, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) { const a = rnd(0, 6.28), r = Math.sqrt(Math.random()) * .8; p.set([Math.cos(a) * r, rnd(-.9, -.1), Math.sin(a) * r], i * 3); }
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const m = new THREE.Points(g, add(new THREE.PointsMaterial({ map: softTex, color: 0xffd27a, size: .05, opacity: .7 }))); deep.add(m); return m; })();

  /* ---------- the surface world: stones, runes, roots, mist ---------- */
  const scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0x2a2c44, 1.1));
  const moon = new THREE.DirectionalLight(0xb8c0e8, .75); moon.position.set(-2, 4, 1.5); scene.add(moon);
  const rimT = new THREE.DirectionalLight(0x45d6c4, 1.0); rimT.position.set(3, 1.5, -3); scene.add(rimT);
  const glowUp = new THREE.PointLight(0xffb25a, 3, 3.4, 1.3); glowUp.position.set(0, -.05, 0); scene.add(glowUp);   // the eye lights everything from below

  // rough-hewn blocks: a box, subdivided and jittered so no two faces are flat
  const block = (() => { const g = new THREE.BoxGeometry(.34, .2, .27, 3, 2, 3).toNonIndexed(); const p = g.attributes.position; const key = {};
    for (let i = 0; i < p.count; i++) { const k = [p.getX(i), p.getY(i), p.getZ(i)].map(v => v.toFixed(3)).join(); const j = key[k] || (key[k] = [rnd(-.018, .018), rnd(-.014, .014), rnd(-.018, .018)]);
      p.setXYZ(i, p.getX(i) + j[0], p.getY(i) + j[1], p.getZ(i) + j[2]); }
    g.computeVertexNormals(); return g; })();
  // dry-stone wall: three courses of blocks, each course offset by half a block, the top course capped and rune-carved
  const stoneMat = new THREE.MeshStandardMaterial({ color: 0x3b3735, roughness: .95, flatShading: true });
  const N = 22, C = 3, stones = new THREE.InstancedMesh(block, stoneMat, N * C), M = new THREE.Matrix4(), Q = new THREE.Quaternion(), E = new THREE.Euler();
  const runeFaces = [];
  for (let c = 0; c < C; c++) for (let k = 0; k < N; k++) {
    const a = (k + (c % 2) * .5) / N * Math.PI * 2, r = 1.17 + rnd(-.015, .015), y = -.17 + c * .19;
    Q.setFromEuler(E.set(rnd(-.04, .04), -a + Math.PI / 2 + rnd(-.05, .05), rnd(-.04, .04)));
    const s = new THREE.Vector3(rnd(.98, 1.08), rnd(.88, 1.02), rnd(.95, 1.1));
    M.compose(new THREE.Vector3(Math.cos(a) * r, y, Math.sin(a) * r), Q, s); stones.setMatrixAt(c * N + k, M);
    if (c === C - 1 && k % 2 === 0) runeFaces.push([Math.cos(a) * (r - .14), y, Math.sin(a) * (r - .14), a]);   // inner face of the top course
  }
  scene.add(stones);
  // carved runes on the inner faces of the top course, kindling in turn
  const runeMeshes = runeFaces.map(([x, y, z, a], i) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.13, .13), add(new THREE.MeshBasicMaterial({ map: runeGlyph(RUNES[(i * 5) % RUNES.length]), opacity: .25, side: THREE.DoubleSide })));
    m.position.set(x, y, z); m.lookAt(0, y, 0); scene.add(m); return m; });

  // the roots of Yggdrasil: tapered, gnarled tubes that arch over the rim and plunge into the water (also drawn in the deep, refracted)
  const barkMat = new THREE.MeshStandardMaterial({ color: 0x5a4636, roughness: .9, flatShading: true });
  const rootPaths = [   // come in from beyond the frame, arch over the wall top (y ≈ .3) and dive into the water
    [[-2.4, .9, -2.2], [-1.6, .55, -1.3], [-1.08, .42, -.78], [-.78, .1, -.55], [-.6, -.4, -.4]],
    [[2.5, .8, -2.0], [1.65, .5, -1.15], [1.05, .4, -.7], [.72, .08, -.48], [.55, -.4, -.35]],
    [[.2, 1.0, -2.8], [.14, .58, -1.7], [.08, .44, -1.08], [.02, .12, -.78], [-.02, -.4, -.6]],
    [[-2.6, .6, .5], [-1.7, .45, .38], [-1.12, .4, .28], [-.84, .08, .2], [-.66, -.4, .16]]];
  const roots = rootPaths.map((pts, ri) => {
    const curve = new THREE.CatmullRomCurve3(pts.map(p => new THREE.Vector3(...p))), seg = 64, rad = 8;
    const g = new THREE.TubeGeometry(curve, seg, ri === 3 ? .1 : .15, rad, false), p = g.attributes.position, n = g.attributes.normal;
    for (let i = 0; i <= seg; i++) { const t = i / seg, taper = 1 - t * .72, knot = 1 + Math.sin(t * 23 + ri) * .12, c = curve.getPointAt(t);
      for (let j = 0; j <= rad; j++) { const v = i * (rad + 1) + j, rough = 1 + (Math.sin(j * 3.7 + i * .9 + ri) * .1);
        p.setXYZ(v, c.x + (p.getX(v) - c.x) * taper * knot * rough, c.y + (p.getY(v) - c.y) * taper * knot * rough, c.z + (p.getZ(v) - c.z) * taper * knot * rough); } }
    g.computeVertexNormals();
    scene.add(new THREE.Mesh(g, barkMat)); const dm = new THREE.Mesh(g, barkMat); dm.position.y = -.05; deep.add(dm);
    return g; });

  // mist drifting over the water, and gold motes rising from it
  const mists = Array.from({ length: 7 }, () => { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0x9aa4d8, transparent: true, opacity: .07, depthWrite: false }));
    s.scale.set(rnd(1.2, 2), rnd(.35, .6), 1); s.position.set(rnd(-1, 1), rnd(.05, .3), rnd(-.8, .8)); s.userData.v = rnd(.04, .1) * (Math.random() < .5 ? -1 : 1); scene.add(s); return s; });
  const motes = (() => { const n = 50, p = new Float32Array(n * 3); for (let i = 0; i < n; i++) p.set([rnd(-.8, .8), rnd(0, 1.2), rnd(-.8, .8)], i * 3);
    const g = new THREE.BufferGeometry(); g.setAttribute("position", new THREE.BufferAttribute(p, 3));
    const m = new THREE.Points(g, add(new THREE.PointsMaterial({ map: softTex, color: 0xffcf73, size: .035, opacity: .8 }))); scene.add(m); return m; })();

  /* ---------- the water: refracts the deep, ripples where you touch ---------- */
  const rt = new THREE.WebGLRenderTarget(4, 4, { type: THREE.HalfFloatType });
  const ripples = Array.from({ length: 8 }, () => new THREE.Vector4(0, 0, 9, 0)); let ri = 0;
  const ripple = (x, z, a = 1) => { ripples[ri].set(x, z, 0, a); ri = (ri + 1) % 8; };
  const water = new THREE.Mesh(new THREE.CircleGeometry(1.04, 96).rotateX(-Math.PI / 2), new THREE.ShaderMaterial({
    uniforms: { tScene: { value: rt.texture }, res: { value: new THREE.Vector2(1, 1) }, time: { value: 0 }, rip: { value: ripples } },
    vertexShader: "varying vec3 vPos; void main(){ vec4 w = modelMatrix * vec4(position,1.); vPos = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",
    fragmentShader: `uniform sampler2D tScene; uniform vec2 res; uniform float time; uniform vec4 rip[8]; varying vec3 vPos;
      void main(){
        vec2 p = vPos.xz, g = vec2(cos(p.x*5.+time*1.1)+cos(p.x*9.-p.y*4.+time*.7), cos(p.y*6.-time*.9)+cos(p.y*11.+p.x*3.+time*1.3))*.0035;
        for (int i = 0; i < 8; i++) { vec4 r = rip[i]; if (r.w <= 0.) continue; vec2 d = p - r.xy; float dist = length(d) + 1e-4, age = r.z;
          float k = exp(-pow((dist - age*.6)*6., 2.)) * exp(-age*1.15) * r.w; g += d/dist * cos(dist*36. - age*12.) * k * .05; }
        vec3 col = texture2D(tScene, gl_FragCoord.xy/res + g*1.1).rgb;
        vec3 n = normalize(vec3(-g.x*9., 1., -g.y*9.)), V = normalize(cameraPosition - vPos);
        float fres = pow(1. - max(dot(n, V), 0.), 3.);
        col = mix(col * vec3(.8, .88, 1.), vec3(.05, .06, .11), fres * .55);
        col += vec3(.72, .78, 1.) * pow(max(dot(n, normalize(normalize(vec3(-.5, 1., .35)) + V)), 0.), 160.) * .9;
        col *= 1. - smoothstep(.7, 1.04, length(p)) * .75;
        gl_FragColor = vec4(col, 1.);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }` }));
  scene.add(water);

  /* ---------- sizing, interaction, loop ---------- */
  const fit = () => { const w = host.clientWidth, h = host.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); cam.aspect = w / h;
    const k = Math.max(1, 2.1 / cam.aspect); cam.position.set(0, 2.2 * k ** .8, 2.45 * k); cam.lookAt(0, -.2, 0); cam.updateProjectionMatrix();
    const pr = renderer.getPixelRatio(); rt.setSize(Math.round(w * pr * .75), Math.round(h * pr * .75)); water.material.uniforms.res.value.set(w * pr, h * pr); };
  host.appendChild(canvas); fit(); addEventListener("resize", fit);
  document.documentElement.classList.add("well3d-on");

  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), look = new THREE.Vector2(), lookTo = new THREE.Vector2();
  let lastRip = 0, pointerAt = 0;
  const hit = e => { const r = canvas.getBoundingClientRect(); ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); ray.setFromCamera(ndc, cam); return ray.intersectObject(water)[0]; };
  canvas.addEventListener("pointermove", e => { const h = hit(e); if (!h) return; pointerAt = performance.now(); lookTo.set(h.point.x, h.point.z);
    if (pointerAt - lastRip > 130) { lastRip = pointerAt; ripple(h.point.x, h.point.z, .8); } });
  canvas.addEventListener("pointerdown", e => { const h = hit(e); if (h) ripple(h.point.x, h.point.z, 1.4); });

  let visible = false;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { rootMargin: "60px 0px" }).observe(host);
  let last = 0, prev = 0, nextDrip = 0, nextBlink = 0, blink = 0, nextSac = 0;
  const motePos = motes.geometry.attributes.position, deepPos = motesDeep.geometry.attributes.position;
  function frame(now) {
    requestAnimationFrame(frame);
    if (!visible || document.hidden || window.blackwing?.isPaused?.()) { prev = now; return; }
    if (now - last < 32) return; last = now;
    const t = now / 1000, dt = reduce ? 0 : Math.min(.05, (now - (prev || now)) / 1000); prev = now;
    if (!nextBlink) { nextBlink = t + 3; nextDrip = t + 1; }
    // the eye: rune rings turn against each other, the pupil follows you (or wanders), it blinks now and then
    ringOuter.rotation.z += dt * .07; ringInner.rotation.z -= dt * .11; iris.rotation.z += dt * .02;
    if (now - pointerAt > 2500 && t > nextSac) { lookTo.set(rnd(-.5, .5), rnd(-.4, .4)); nextSac = t + rnd(1.2, 3); }
    look.lerp(lookTo, 1 - Math.exp(-dt * 7));
    pupil.position.set(look.x * .14, -look.y * .14, .002); iris.position.set(look.x * .06, -look.y * .06, .001);
    if (t > nextBlink) { blink = 1; nextBlink = t + rnd(4, 9); } blink = Math.max(0, blink - dt / .35);
    const open = 1 - Math.sin(blink * Math.PI) * .92, pulse = .8 + Math.sin(t * 1.3) * .2;
    vesica.scale.y = .5 * open; iris.scale.y = open; pupil.scale.setScalar(1 + Math.sin(t * .8) * .08);
    halo.material.opacity = .3 * pulse; gold.intensity = 1.5 * pulse; glowUp.intensity = 2.8 * pulse;
    // carved runes kindle one after another
    runeMeshes.forEach((m, i) => { m.material.opacity = .22 + .6 * Math.max(0, Math.sin(t * .9 - i * .8)) ** 6; });
    for (const s of mists) { s.position.x += s.userData.v * dt; if (Math.abs(s.position.x) > 1.4) s.userData.v *= -1; }
    for (let i = 0; i < motePos.count; i++) { let y = motePos.getY(i) + dt * .12; if (y > 1.3) y = 0; motePos.setY(i, y); }
    for (let i = 0; i < deepPos.count; i++) { let y = deepPos.getY(i) + dt * .05; if (y > -.05) y = -.55; deepPos.setY(i, y); }
    motePos.needsUpdate = deepPos.needsUpdate = true;
    if (t > nextDrip && !reduce) { const a = rnd(0, 6.28), k = Math.sqrt(Math.random()) * .7; ripple(Math.cos(a) * k, Math.sin(a) * k, .7); nextDrip = t + rnd(2.2, 4.5); }
    water.material.uniforms.time.value = t;
    for (const r of ripples) if (r.w > 0) { r.z += dt; if (r.z > 4) r.w = 0; }
    renderer.setRenderTarget(rt); renderer.render(deep, cam); renderer.setRenderTarget(null); renderer.render(scene, cam);
  }
  requestAnimationFrame(frame);
}
