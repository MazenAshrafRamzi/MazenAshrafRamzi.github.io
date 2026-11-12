/* BLACKWING: raven-themed portfolio preview.
   The hero raven is built in code from ~80 individual feathers, so it can unfurl, flap and shed real feathers.
   A single pose object ({ fold, flap }) drives every feather; GSAP tweens the pose and render() redraws it. */
(() => {
const PROJECTS = window.PROJECTS || [];
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const G = window.gsap, ST = window.ScrollTrigger, MP = window.MotionPathPlugin;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const small = innerWidth < 700;
const motion = !!G && !reduce;
if (G) G.registerPlugin(...[ST, MP].filter(Boolean));
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent && parent.appendChild(e); return e; };
const lerp = (a, b, t) => a + (b - a) * t, clamp01 = t => Math.max(0, Math.min(1, t));
const rnd = (a, b) => a + Math.random() * (b - a);
let paused = false; // canvases pause while a demo/video is open

/* =====================================================================================
   1. THE RAVEN (front view, wings spread)
   ===================================================================================== */
// a single feather pointing up (-y) from its quill at 0,0
const featherD = (L, w) => `M0 0C${w} ${-L * .2} ${w * .78} ${-L * .7} 0 ${-L}C${-w * .55} ${-L * .8} ${-w * .92} ${-L * .24} 0 0Z`;
const svg = $("#raven");
const defs = el("defs", {}, svg);
defs.innerHTML = `
  <linearGradient id="fA" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#040406"/><stop offset=".5" stop-color="#0f1019"/><stop offset=".84" stop-color="#232b52"/><stop offset="1" stop-color="#5566b0"/></linearGradient>
  <linearGradient id="fB" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#040406"/><stop offset=".5" stop-color="#0e1416"/><stop offset=".84" stop-color="#1b4244"/><stop offset="1" stop-color="#3f8a86"/></linearGradient>
  <linearGradient id="fC" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#060609"/><stop offset=".7" stop-color="#171726"/><stop offset="1" stop-color="#3a4275"/></linearGradient>
  <radialGradient id="bodyG" cx="50%" cy="20%" r="80%"><stop offset="0" stop-color="#1e1d2e"/><stop offset=".6" stop-color="#0b0b12"/><stop offset="1" stop-color="#050507"/></radialGradient>
  <linearGradient id="beakG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a3946"/><stop offset=".5" stop-color="#15141c"/><stop offset="1" stop-color="#050507"/></linearGradient>
  <radialGradient id="eyeG" cx="40%" cy="40%" r="60%"><stop offset="0" stop-color="#fff2c4"/><stop offset=".5" stop-color="#e3b55a"/><stop offset="1" stop-color="#7a5418"/></radialGradient>
  <radialGradient id="haloG"><stop offset="0" stop-color="#5c3f8f" stop-opacity=".55"/><stop offset=".45" stop-color="#2c2a6b" stop-opacity=".25"/><stop offset="1" stop-color="#050507" stop-opacity="0"/></radialGradient>
  <pattern id="starPat" width="70" height="70" patternUnits="userSpaceOnUse">
    <circle cx="9" cy="12" r=".9" fill="#dfe4ff"/><circle cx="41" cy="7" r=".6" fill="#fff"/><circle cx="58" cy="31" r="1.1" fill="#c8d2ff"/>
    <circle cx="24" cy="44" r=".7" fill="#fff"/><circle cx="50" cy="60" r=".8" fill="#e8dcff"/><circle cx="6" cy="62" r=".5" fill="#fff"/><circle cx="33" cy="26" r=".4" fill="#fff"/>
  </pattern>
  <filter id="eyeGlow" x="-200%" y="-200%" width="500%" height="500%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <clipPath id="bodyClip"><path d="M-36-70C-60-40-58 20-40 60-28 86-12 100 0 104 12 100 28 86 40 60 58 20 60-40 36-70 20-82-20-82-36-70Z"/></clipPath>`;

el("circle", { cx: 0, cy: -40, r: 300, fill: "url(#haloG)" }, svg);
const root = el("g", { class: "root" }, svg);
const feathers = []; // { g, a, t, kind, i, n }

function addFeather(parent, x, y, a, L, w, fill, extra = {}) {
  const g = el("g", { transform: `translate(${x} ${y}) rotate(${a})` }, parent);
  el("path", { d: featherD(L, w), fill, stroke: "#8f9ae055", "stroke-width": .7 }, g);
  if (L > 100) el("path", { d: featherD(L, w), fill: "url(#starPat)", opacity: .45 }, g); // starlight caught in the long flight feathers
  el("path", { d: `M0 -3L0 ${-L * .9}`, stroke: "#aab3ee", "stroke-opacity": .16, "stroke-width": .8, fill: "none" }, g);
  const f = { g, x, y, a, ...extra }; feathers.push(f); return f;
}

// tail fan (drawn first, behind the body)
const tail = el("g", {}, root);
for (let i = 0; i < 9; i++) { const t = i / 8, a = lerp(158, 202, t); addFeather(tail, 0, 88, a, 150 - Math.abs(t - .5) * 50, 17, i % 2 ? "url(#fA)" : "url(#fB)", { kind: "tail" }); }

// wings: built once in local space (shoulder at 0,0, wing reaching to -x), mirrored for the right side
const wings = [];
for (const side of [-1, 1]) {
  const wrap = el("g", { transform: `translate(${side * 34} -40) scale(${-side} 1)` }, root);
  const flap = el("g", {}, wrap);
  const wing = { flap, list: [] };
  const W = [-168, -58]; // wrist
  const push = f => wing.list.push(f);
  // primaries: fan out from the wrist, longest at the top
  for (let i = 0; i < 8; i++) { const t = i / 7; push(addFeather(flap, W[0] - i * 3, W[1] - i * 2.5, lerp(-126, -56, t), lerp(150, 218, Math.sin(t * 1.35)), 15, i % 2 ? "url(#fA)" : "url(#fB)", { kind: "pri", t: .6 + t * .4 })); }
  // secondaries: along the arm, hanging toward the body
  for (let i = 0; i < 9; i++) { const t = .04 + i / 8 * .9; push(addFeather(flap, lerp(-8, -162, t), lerp(4, -54, t), lerp(-172, -130, t), 124 + Math.sin(t * Math.PI) * 14, 17, i % 2 ? "url(#fB)" : "url(#fA)", { kind: "sec", t: t * .6 })); }
  // greater coverts
  for (let i = 0; i < 10; i++) { const t = i / 9; push(addFeather(flap, lerp(-4, -160, t), lerp(-6, -64, t), lerp(-152, -112, t), lerp(74, 62, t), 17, "url(#fC)", { kind: "cov", t: t * .5 })); }
  // marginal coverts along the leading edge
  for (let i = 0; i < 9; i++) { const t = i / 8; push(addFeather(flap, lerp(0, -166, t), lerp(-14, -72, t), lerp(-128, -96, t), 36, 14, "url(#fC)", { kind: "mar", t: t * .4 })); }
  wings.push(wing);
}

// body, breast feathers, throat hackles, head
el("path", { d: "M-36-70C-60-40-58 20-40 60-28 86-12 100 0 104 12 100 28 86 40 60 58 20 60-40 36-70 20-82-20-82-36-70Z", fill: "url(#bodyG)", stroke: "#8f9ae033", "stroke-width": 1 }, root);
const breast = el("g", { "clip-path": "url(#bodyClip)" }, root);
for (let r = 0; r < 8; r++) for (let c = -3; c <= 3; c++) {
  const x = c * 15 + (r % 2 ? 7.5 : 0), y = -52 + r * 19;
  const ff = el("path", { d: featherD(26, 12), transform: `translate(${x} ${y}) rotate(${180 + c * 4})`, fill: "url(#fC)", stroke: "#9aa3e033", "stroke-width": .6 }, breast);
  ff.style.opacity = .85;
}
const head = el("g", { class: "head" }, root);
for (let i = 0; i < 9; i++) { const t = i / 8; const f = el("path", { d: featherD(38 - Math.abs(t - .5) * 20, 11), transform: `translate(${lerp(-18, 18, t)} -78) rotate(${lerp(205, 155, t)})`, fill: "url(#fC)", stroke: "#9aa3e044", "stroke-width": .6 }, head); }
el("path", { d: "M-30-112C-32-140-14-153 0-153 14-153 32-140 30-112 30-92 18-80 0-78-18-80-30-92-30-112Z", fill: "url(#bodyG)", stroke: "#9aa3e044", "stroke-width": 1 }, head);
el("path", { d: "M-24-128C-14-146 14-146 24-128", fill: "none", stroke: "#5566b0", "stroke-opacity": .35, "stroke-width": 2 }, head); // crown sheen
// the heavy raven beak (a crow's is slimmer): broad at the base, arched ridge, hooked tip
el("path", { d: "M-15-108C-9-116 9-116 15-108C14-90 9-66 3-42 1-37-1-37-3-42-9-66-14-90-15-108Z", fill: "url(#beakG)", stroke: "#7c7990", "stroke-opacity": .55, "stroke-width": .9 }, head);
el("path", { d: "M0-112C1-92 1-66 0-44", stroke: "#a19eb4", "stroke-opacity": .55, "stroke-width": 1.1, fill: "none" }, head); // culmen highlight
el("path", { d: "M-9-80C-6-70-4-58-2-48M9-80C6-70 4-58 2-48", stroke: "#050507", "stroke-opacity": .7, "stroke-width": .8, fill: "none" }, head); // gape line
for (const s of [-1, 1]) el("path", { d: `M${s * 5}-108c${s * 6} 4 ${s * 9} 10 ${s * 10} 17m${-s * 6}-19c${s * 7} 2 ${s * 12} 7 ${s * 14} 13`, stroke: "#1e1d27", "stroke-width": 1.6, fill: "none" }, head); // nasal bristles
const pupils = [], lids = [];
for (const s of [-1, 1]) {
  const eg = el("g", { filter: "url(#eyeGlow)" }, head);
  el("circle", { cx: s * 15, cy: -118, r: 6, fill: "url(#eyeG)" }, eg);
  pupils.push(el("circle", { cx: s * 15, cy: -118, r: 2.6, fill: "#050507" }, eg));
  el("circle", { cx: s * 15 - 1.6, cy: -120, r: 1.1, fill: "#fff" }, eg);
  lids.push(el("ellipse", { cx: s * 15, cy: -118, rx: 7.5, ry: 7.5, fill: "#0b0a11" }, head));
}

// --- pose → feathers
const pose = { fold: motion ? 1 : 0, flap: 0 };
function render() {
  const { fold, flap } = pose;
  root.setAttribute("transform", `translate(0 ${(-flap * 7 + fold * 30).toFixed(2)})`);
  for (const w of wings) w.flap.setAttribute("transform", `rotate(${(flap * 13 - fold * 18).toFixed(2)}) scale(${(1 - fold * .42).toFixed(3)})`);
  for (const f of feathers) {
    let a = f.a;
    if (f.kind === "tail") a = 180 + (f.a - 180) * (1 - fold * .65);
    else if (f.kind) {
      const k = clamp01(fold * 1.35 - (1 - f.t) * .35);          // wing tips fold last, unfurl last
      a = lerp(f.a, -176, k) - flap * 9 * f.t;                    // tips trail behind the stroke
    }
    f.g.setAttribute("transform", `translate(${f.x} ${f.y}) rotate(${a.toFixed(2)})`);
  }
}
render();
if (G) { G.set(lids, { scaleY: 0, transformOrigin: "50% 0%" }); } else lids.forEach(l => l.setAttribute("ry", 0));

/* =====================================================================================
   2. SMALL SIDE-VIEW RAVENS (Huginn, Muninn, the path raven, the courier)
   ===================================================================================== */
function miniRaven(g) {
  const far = el("path", { d: "M-2-6C-10-30-24-44-46-50-32-38-24-22-16-5Z", opacity: .55 }, g);
  el("path", { d: "M-30 0C-20-12 10-15 26-7L44-4 27 3C12 11-14 10-30 4L-48 11-45 1-50-6Z" }, g);
  const near = el("path", { d: "M2-5C-6-34-22-52-50-58-34-42-24-24-12-4Z" }, g);
  el("circle", { class: "meye", cx: 24, cy: -6, r: 1.6 }, g);
  if (motion) { const d = rnd(.24, .32); G.set([near, far], { transformOrigin: "50% 100%" }); G.to(near, { scaleY: -.75, duration: d, ease: "sine.inOut", yoyo: true, repeat: -1 }); G.to(far, { scaleY: -.6, duration: d, ease: "sine.inOut", yoyo: true, repeat: -1, delay: .03 }); }
  return g;
}
const twins = [miniRaven($("#huginn")), miniRaven($("#muninn"))];
const placeTwins = t => twins.forEach((g, i) => {
  const p = t + i * Math.PI, x = Math.cos(p) * 430, y = Math.sin(p) * 120 - 90, depth = (Math.sin(p) + 1) / 2;
  const dir = -Math.sin(p) >= 0 ? 1 : -1, s = .55 + depth * .55;
  g.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * dir).toFixed(3)} ${s.toFixed(3)})`);
  g.style.opacity = (.35 + depth * .65).toFixed(2);
});
placeTwins(.8);

/* =====================================================================================
   3. SKY (galaxy) + FEATHERS, one throttled loop
   ===================================================================================== */
const sky = $("#sky"), sx = sky.getContext("2d"), fc = $("#feathers"), fx = fc.getContext("2d");
let W = 0, H = 0, DPR = 1, stars = [], neb, shoot = null, nextShoot = performance.now() + rnd(4000, 9000);
const quill = new Path2D(featherD(1, .17).replace(/([\d.-]+)/g, n => n)); // unit feather (scaled per particle)
function buildSky() {
  DPR = Math.min(devicePixelRatio || 1, 1.5); W = innerWidth; H = innerHeight;
  for (const c of [sky, fc]) { c.width = W * DPR; c.height = H * DPR; }
  sx.setTransform(DPR, 0, 0, DPR, 0, 0); fx.setTransform(DPR, 0, 0, DPR, 0, 0);
  neb = document.createElement("canvas"); neb.width = W / 2; neb.height = H * 1.6 / 2;
  const n = neb.getContext("2d"), nw = neb.width, nh = neb.height;
  const blob = (x, y, r, c) => { const g = n.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, c); g.addColorStop(1, "transparent"); n.fillStyle = g; n.fillRect(0, 0, nw, nh); };
  blob(nw * .74, nh * .12, nw * .5, "rgba(92,63,143,.42)"); blob(nw * .58, nh * .2, nw * .25, "rgba(150,110,200,.18)");
  blob(nw * .12, nh * .42, nw * .45, "rgba(31,90,98,.25)"); blob(nw * .45, nh * .72, nw * .55, "rgba(36,48,107,.3)"); blob(nw * .9, nh * .9, nw * .35, "rgba(92,63,143,.2)");
  for (let i = 0; i < 900; i++) { // the milky band: a diagonal river of faint dust
    const t = Math.random(), off = (Math.random() + Math.random() - 1) * nh * .09;
    n.fillStyle = `rgba(${200 + rnd(0, 55) | 0},${200 + rnd(0, 40) | 0},255,${rnd(.04, .22).toFixed(2)})`;
    n.fillRect(t * nw, nh * .05 + t * nh * .55 + off, rnd(.4, 1.3), rnd(.4, 1.3));
  }
  const count = Math.min(small ? 220 : 520, (W * H) / 2600 | 0);
  stars = Array.from({ length: count }, () => ({ x: Math.random() * W, y: Math.random() * H * 1.5, r: Math.random() ** 3 * 1.6 + .25, a: rnd(.25, .9), tw: rnd(.6, 2.4), p: rnd(0, 6.3), d: rnd(.05, .35), gold: Math.random() < .06 }));
}
// feathers: ambient drift + bursts
const flock = [];
const addDrifter = (y = rnd(-H, 0)) => flock.push({ x: rnd(0, W), y, z: rnd(.35, 1), rot: rnd(0, 6.3), vr: rnd(-.6, .6), sway: rnd(0, 6.3), sp: rnd(.4, 1), life: Infinity, sheen: Math.random() < .5 ? "130,145,230" : "90,170,165" });
function burst(x, y, n = 10, power = 1) {
  if (reduce) return;
  for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), v = rnd(1.5, 5) * power;
    flock.push({ x, y, z: rnd(.5, 1.1), rot: rnd(0, 6.3), vr: rnd(-3, 3), sway: rnd(0, 6.3), sp: rnd(.4, 1), vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: rnd(2.2, 4), age: 0, sheen: Math.random() < .5 ? "130,145,230" : "201,164,92" }); }
}
let scrollV = 0, lastY = scrollY;
addEventListener("scroll", () => { scrollV += scrollY - lastY; lastY = scrollY; }, { passive: true });
function drawSky(now) {
  sx.clearRect(0, 0, W, H);
  const py = -scrollY * .06;
  sx.drawImage(neb, 0, py % (H * .6), W, H * 1.6);
  for (const s of stars) {
    const y = ((s.y - scrollY * s.d) % (H * 1.5) + H * 1.5) % (H * 1.5);
    if (y > H) continue;
    const al = s.a * (.55 + .45 * Math.sin(now / 1000 * s.tw + s.p));
    sx.fillStyle = s.gold ? `rgba(240,213,149,${al})` : `rgba(226,230,255,${al})`;
    sx.beginPath(); sx.arc(s.x, y, s.r, 0, 6.283); sx.fill();
  }
  if (!shoot && now > nextShoot && !reduce) shoot = { x: rnd(W * .2, W), y: rnd(0, H * .4), t: 0 };
  if (shoot) { // a shooting star now and then
    shoot.t += 1 / 30; const k = shoot.t / .9, len = 160, x = shoot.x - k * 520, y = shoot.y + k * 230;
    const g = sx.createLinearGradient(x, y, x + len, y - len * .44); g.addColorStop(0, `rgba(255,244,214,${.9 * (1 - k)})`); g.addColorStop(1, "transparent");
    sx.strokeStyle = g; sx.lineWidth = 1.4; sx.beginPath(); sx.moveTo(x, y); sx.lineTo(x + len, y - len * .44); sx.stroke();
    if (k >= 1) { shoot = null; nextShoot = now + rnd(6000, 14000); }
  }
}
function drawFeathers(dt) {
  fx.clearRect(0, 0, W, H);
  const wind = Math.max(-40, Math.min(40, scrollV)) * .06; scrollV *= .85;
  for (let i = flock.length - 1; i >= 0; i--) {
    const f = flock[i];
    if (f.vx !== undefined) { f.age += dt; f.vx *= .97; f.vy = f.vy * .97 + .06; f.x += f.vx; f.y += f.vy; if (f.age > f.life) { flock.splice(i, 1); continue; } }
    else { f.sway += dt * f.sp; f.y += (.35 + f.z * .55) * f.sp - wind * f.z; f.x += Math.sin(f.sway) * .6 * f.z; if (f.y > H + 40) { f.y = -40; f.x = rnd(0, W); } if (f.y < -60) f.y = H + 30; }
    f.rot += f.vr * dt * .6 + Math.sin(f.sway) * .004;
    const L = 26 + f.z * 26, al = f.vx !== undefined ? clamp01(1 - f.age / f.life) : .35 + f.z * .45;
    fx.save(); fx.translate(f.x, f.y); fx.rotate(f.rot); fx.scale(L, L);
    fx.globalAlpha = al; fx.fillStyle = "#0b0a12"; fx.fill(quill);
    fx.lineWidth = 1.1 / L; fx.strokeStyle = `rgba(${f.sheen},.75)`; fx.stroke(quill);
    fx.beginPath(); fx.moveTo(0, 0); fx.lineTo(0, -.92); fx.strokeStyle = `rgba(${f.sheen},.35)`; fx.stroke();
    fx.restore();
  }
}
buildSky();
for (let i = 0; i < (small ? 9 : 16); i++) addDrifter(rnd(0, H));
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { buildSky(); if (reduce) { drawSky(0); drawFeathers(0); } }, 150); });
let last = 0, tw = .8;
function loop(now) {
  requestAnimationFrame(loop);
  if (paused || document.hidden || now - last < 33) return; // ~30 fps is plenty for drifting things
  const dt = Math.min(.1, (now - (last || now)) / 1000); last = now;
  drawSky(now); drawFeathers(dt);
  if (motion && scrollY < innerHeight * 1.2) { tw += dt * .45; placeTwins(tw); }
}
if (reduce) { drawSky(0); drawFeathers(0); } else requestAnimationFrame(loop);

// screen position of a point in the raven's viewBox (for shedding feathers from the wing tips)
function ravenToScreen(vx, vy) { const r = svg.getBoundingClientRect(); return [r.left + (vx + 430) / 860 * r.width, r.top + (vy + 300) / 600 * r.height]; }

/* =====================================================================================
   4. INTRO (the eye opens) and HERO MOTION
   ===================================================================================== */
const titleEl = $(".title .word");
titleEl.innerHTML = [...titleEl.textContent].map(c => `<span class="ch">${c}</span>`).join("");
let seen = false; try { seen = sessionStorage.getItem("bw-intro") === "1"; sessionStorage.setItem("bw-intro", "1"); } catch {}
const html = document.documentElement;

function heroIn() {
  html.classList.remove("intro-on");
  if (!motion) { pose.fold = 0; render(); return startIdle(); }
  const tl = G.timeline({ onComplete: startIdle });
  tl.to(pose, { fold: 0, duration: 2.1, ease: "elastic.out(1, .55)", onUpdate: render })
    .add(() => { const [x, y] = ravenToScreen(0, -40); burst(x, y, small ? 14 : 26, 1.6); }, .25)
    .fromTo(".runes", { opacity: 0, scale: .85, rotation: -20 }, { opacity: .55, scale: 1, rotation: 0, duration: 2.4, ease: "power3.out" }, 0)
    .fromTo(".title .ch", { y: 90, opacity: 0, filter: "blur(12px)" }, { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.1, stagger: .055, ease: "power4.out" }, .35)
    .fromTo([".eyebrow", ".tagline", ".cta", ".omens", ".scroll-cue"], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: "power3.out" }, .9)
    .fromTo(".twins", { opacity: 0 }, { opacity: 1, duration: 1.5 }, .8);
}
function startIdle() {
  if (!motion) return;
  G.to(".runes", { rotation: 360, duration: 160, ease: "none", repeat: -1 });
  let up = true;
  G.to(pose, { flap: 1, duration: 1.15, ease: "sine.inOut", yoyo: true, repeat: -1, onUpdate: render,
    onRepeat() { up = !up; if (!up && Math.random() < .7 && scrollY < innerHeight) { const s = Math.random() < .5 ? -1 : 1, [x, y] = ravenToScreen(s * 330, -150); burst(x, y, 1, .4); } } });
  // blink every few seconds: an all-seeing raven still has to blink
  const blink = () => G.to(lids, { scaleY: 1, duration: .07, yoyo: true, repeat: 1, ease: "power2.in", onComplete: () => G.delayedCall(rnd(2.5, 6.5), blink) });
  G.delayedCall(2, blink);
  // fly up and away as you scroll out of the hero
  if (ST) G.to(["#raven", ".runes"], { yPercent: -18, scale: .82, opacity: .25, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
}

// the eyes and head follow the pointer
if (motion) {
  const pxTo = pupils.map(p => [G.quickTo(p, "x", { duration: .35 }), G.quickTo(p, "y", { duration: .35 })]);
  const headRot = G.quickTo(head, "rotation", { duration: .8, ease: "power3.out" });
  G.set(head, { svgOrigin: "0 -80" });
  addEventListener("pointermove", e => {
    const r = svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height * .3;
    const dx = (e.clientX - cx) / innerWidth, dy = (e.clientY - cy) / innerHeight;
    pxTo.forEach(([qx, qy]) => { qx(dx * 5); qy(dy * 4); });
    headRot(dx * 10);
  }, { passive: true });
}

if (!motion || seen) { $("#intro").remove(); requestAnimationFrame(heroIn); }
else {
  const skip = () => { if (introTl.progress() < 1) introTl.progress(1); };
  const introTl = G.timeline({ onComplete: () => { $("#intro")?.remove(); removeEventListener("keydown", skip); heroIn(); } });
  introTl.set(".eye .pupil", { scale: 1.7, transformOrigin: "50% 50%" })
    .to(".lid-top", { scaleY: 0, transformOrigin: "50% 0%", duration: 1, ease: "power3.inOut" }, .25)
    .to(".lid-bot", { scaleY: 0, transformOrigin: "50% 100%", duration: 1, ease: "power3.inOut" }, .25)
    .to(".eye .pupil", { scale: 1, duration: .8, ease: "elastic.out(1, .4)" }, 1.05)
    .to(".intro-line span", { opacity: 1, duration: .6, stagger: .35 }, .7)
    .to("#intro .eye", { scale: 7, opacity: 0, duration: .9, ease: "power3.in" }, 2.15)
    .to("#intro", { opacity: 0, duration: .5 }, 2.6);
  $("#intro").addEventListener("click", skip); addEventListener("keydown", skip, { once: true });
}

/* =====================================================================================
   5. WORK: cards, filters, previews, tilt
   ===================================================================================== */
function mediaHTML(p) {
  if (!p.img) return `<div class="poster" style="background-image:url(media/poster-${p.id}.jpg)"><b>${esc(p.title)}</b><small>${esc(p.kicker)}</small></div>`;
  const base = p.portrait
    ? `<img class="blur" src="${p.img.replace(/\.jpg$/, "-blur.jpg")}" alt="" decoding="async"><img class="fg" src="${p.img}" alt="${esc(p.title)}" loading="lazy">`
    : `<img src="${p.img}" srcset="${p.img.replace(/\.jpg$/, "-640.jpg")} 640w, ${p.img} 1280w" sizes="(max-width: 680px) 100vw, 620px" alt="${esc(p.title)}" loading="lazy" decoding="async">`;
  return base + (p.video ? `<video class="preview" muted loop playsinline preload="none" data-src="${p.video}"></video>` : "");
}
function cardHTML(p) {
  const badge = p.play ? `<span class="badge live">Playable</span>` : p.video ? `<span class="badge">▶ Video</span>` : "";
  const acts = [];
  if (p.play) acts.push(`<button class="btn gold" data-play="${p.id}">Play in browser</button>`);
  if (p.video) acts.push(`<button class="btn gold" data-watch="${p.id}">Watch</button>`);
  acts.push(`<button class="btn" data-details="${p.id}">Details</button>`);
  if (p.link) acts.push(`<a class="btn" href="${p.link}" target="_blank" rel="noopener">GitHub ↗</a>`);
  return `<article class="card${p.wide ? " wide" : ""}" data-id="${p.id}" data-cats="${p.cats.join(" ")}" style="--tint:${p.tint}">
    <div class="media${p.portrait ? " portrait" : ""}" data-open="${p.id}" role="button" tabindex="0" aria-label="${esc((p.play ? "Play " : p.video ? "Watch " : "Details: ") + p.title)}">${badge}${mediaHTML(p)}</div>
    <div class="body"><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p>
    <div class="tools">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    <div class="actions">${acts.join("")}</div></div></article>`;
}
$("#grid").innerHTML = PROJECTS.map(cardHTML).join("");
const byId = id => PROJECTS.find(p => p.id === id);
const cards = $$(".card");

let filtering = false;
$$(".chip").forEach(ch => ch.addEventListener("click", () => {
  if (filtering || ch.classList.contains("on")) return;
  $$(".chip").forEach(c => { c.classList.toggle("on", c === ch); c.setAttribute("aria-pressed", c === ch); });
  const f = ch.dataset.f, keep = c => f === "all" || c.dataset.cats.split(" ").includes(f);
  if (!motion) { cards.forEach(c => c.classList.toggle("hide", !keep(c))); return; }
  filtering = true;
  const out = cards.filter(c => !c.classList.contains("hide"));
  G.to(out, { opacity: 0, y: 20, scale: .97, duration: .22, stagger: .02, ease: "power2.in", onComplete() {
    cards.forEach(c => c.classList.toggle("hide", !keep(c)));
    const shown = cards.filter(c => !c.classList.contains("hide"));
    G.fromTo(shown, { opacity: 0, y: 40, rotationX: -12 }, { opacity: 1, y: 0, scale: 1, rotationX: 0, duration: .8, stagger: .06, ease: "back.out(1.4)", onComplete: () => { filtering = false; ST && ST.refresh(); } });
    const r = ch.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 5, .6);
  } });
}));

if (fine) {
  cards.forEach(card => {
    const v = card.querySelector("video.preview");
    const rx = motion ? G.quickTo(card, "rotationX", { duration: .6, ease: "power3.out" }) : null, ry = motion ? G.quickTo(card, "rotationY", { duration: .6, ease: "power3.out" }) : null;
    if (motion) G.set(card, { transformPerspective: 900 });
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%");
      if (rx) { rx((.5 - py) * 7); ry((px - .5) * 9); }
    });
    card.addEventListener("pointerenter", () => { if (v) { if (!v.src) v.src = v.dataset.src; v.currentTime = 0; v.play().then(() => card.classList.add("playing")).catch(() => {}); } });
    card.addEventListener("pointerleave", () => { if (rx) { rx(0); ry(0); } if (v) { v.pause(); card.classList.remove("playing"); } });
  });
}

/* =====================================================================================
   6. MODAL (play / watch / details)
   ===================================================================================== */
const modal = $("#modal"), mBody = $("#modal-body"), mTitle = $("#modal-title");
let lastFocus = null;
function openModal(title, inner) {
  lastFocus = document.activeElement; mTitle.textContent = title; mBody.innerHTML = inner; modal.hidden = false;
  document.body.style.overflow = "hidden"; paused = true; $("#modal-fs").hidden = !mBody.querySelector("iframe");
  if (motion) G.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: .35 });
  $("#modal-close").focus();
}
function closeModal() { modal.hidden = true; mBody.innerHTML = ""; document.body.style.overflow = ""; paused = false; lastFocus && lastFocus.focus(); }
$("#modal-close").onclick = closeModal;
$("#modal-fs").onclick = () => { const f = mBody.querySelector("iframe"); f && f.requestFullscreen && f.requestFullscreen(); };
addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
const play = p => openModal(`${p.title} · live WebGL · ${p.size}`, `<iframe src="${p.play}" allow="fullscreen; autoplay" allowfullscreen title="${esc(p.title)}"></iframe>`);
const watch = p => openModal(p.title, `<video src="${p.video}" poster="${p.img}" controls autoplay playsinline></video>`);
function details(p) {
  const gal = p.gallery ? `<div class="gallery">${p.gallery.map(g => `<img src="${g}" alt="${esc(p.title)} screenshot" loading="lazy">`).join("")}</div>` : "";
  const acts = [p.play && `<button class="btn gold" data-play="${p.id}">Play in browser</button>`, p.video && `<button class="btn gold" data-watch="${p.id}">Watch</button>`].filter(Boolean).join(" ");
  openModal(p.kicker, `<div class="details" style="--tint:${p.tint}"><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3>
    <p class="muted">${esc(p.blurb)}</p>${gal}<ul>${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <div class="tools">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    ${p.play ? `<p class="note">Runs live in your browser (${p.size} download). Best on a desktop with Chrome, Edge or Firefox.</p>` : ""}
    <div class="actions">${acts}</div></div>`);
}
const act = t => { const p = byId(t.dataset.play || t.dataset.watch || t.dataset.details || t.dataset.open); if (!p) return;
  if (t.dataset.play) return play(p); if (t.dataset.watch) return watch(p); if (t.dataset.details) return details(p); p.play ? play(p) : p.video ? watch(p) : details(p); };
document.addEventListener("click", e => { const t = e.target.closest("[data-play],[data-watch],[data-details],[data-open]"); if (t) act(t); });
document.addEventListener("keydown", e => { if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-open]")) { e.preventDefault(); act(e.target); } });

/* =====================================================================================
   7. SCROLL: reveals, nav, memory flight path
   ===================================================================================== */
if (motion && "IntersectionObserver" in window) {
  const groups = [
    [".lore", { y: 40, opacity: 0, filter: "blur(8px)" }], [".omen-card", { y: 60, opacity: 0 }],
    [".numeral", { x: -40, opacity: 0 }], [".sec-head h2, .contact h2", { y: 50, opacity: 0 }], [".kicker-line", { opacity: 0 }],
    [".card", { y: 70, opacity: 0, clipPath: "inset(0 0 35% 0 round 14px)" }], [".stops li", { x: 40, opacity: 0 }],
    [".trove", { y: 50, opacity: 0, rotation: -1.5 }], [".scroll-form", { y: 50, opacity: 0 }], [".contact-copy > *:not(.numeral):not(h2):not(.kicker-line)", { y: 20, opacity: 0 }]];
  for (const [sel, from] of groups) G.set(sel, from);
  const io = new IntersectionObserver(es => {
    const batch = es.filter(e => e.isIntersecting).map(e => e.target);
    if (!batch.length) return;
    batch.forEach(t => io.unobserve(t));
    G.to(batch, { x: 0, y: 0, opacity: 1, rotation: 0, filter: "blur(0px)", clipPath: "inset(0 0 0% 0 round 14px)", duration: 1.1, stagger: .09, ease: "expo.out", clearProps: "clipPath,filter" });
  }, { rootMargin: "0px 0px -8% 0px" });
  groups.forEach(([sel]) => $$(sel).forEach(t => io.observe(t)));
}

// nav: solid after the hero starts scrolling, hides going down, returns going up
let prevY = scrollY;
addEventListener("scroll", () => {
  const y = scrollY, nav = $(".nav");
  nav.classList.toggle("solid", y > 40);
  nav.classList.toggle("hide", y > prevY && y > innerHeight * .8 && modal.hidden);
  prevY = y;
}, { passive: true });

// in-page links: smooth, and never reload the page because of the <base> tag
document.addEventListener("click", e => {
  const a = e.target.closest("a[href*='#']"); if (!a) return;
  const url = new URL(a.href); if (url.pathname !== location.pathname) return;
  const t = url.hash.length > 1 && document.getElementById(url.hash.slice(1)); if (!t && url.hash !== "#top") return;
  e.preventDefault();
  (t || document.body).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.replaceState(null, "", url.hash);
});

// Muninn's flight: a raven glides down the memory path as you scroll
(() => {
  const path = $(".path"), line = $("#flightLine"); if (!path || !line) return;
  const bird = el("svg", { id: "pathRaven", viewBox: "-60 -60 120 80", "aria-hidden": "true" });
  path.appendChild(bird); miniRaven(el("g", { class: "mini" }, bird));
  const len = line.getTotalLength(), flight = $(".flight");
  let prevX = 50;
  const place = p => {
    const pt = line.getPointAtLength(len * p), r = flight.getBoundingClientRect();
    const x = pt.x / 100 * r.width, y = pt.y / 1000 * r.height;
    bird.style.transform = `translate(${x}px, ${y}px) scaleX(${pt.x >= prevX ? 1 : -1})`; prevX = pt.x;
  };
  place(0);
  if (motion && ST) ST.create({ trigger: path, start: "top 70%", end: "bottom 60%", scrub: .8, onUpdate: s => place(s.progress) });
  else place(.5);
})();

/* =====================================================================================
   8. CURSOR + feathers on click
   ===================================================================================== */
if (fine && motion) {
  const cur = $(".cursor"), cx = G.quickTo(cur, "x", { duration: .25, ease: "power3" }), cy = G.quickTo(cur, "y", { duration: .25, ease: "power3" });
  addEventListener("pointermove", e => { cur.classList.add("on"); cx(e.clientX); cy(e.clientY); cur.classList.toggle("hot", !!e.target.closest("a, button, [data-open], .chip, input, textarea")); }, { passive: true });
  document.addEventListener("pointerleave", () => cur.classList.remove("on"));
}
$(".hero").addEventListener("click", e => { if (!e.target.closest("a, button")) burst(e.clientX, e.clientY, 6, .8); });

/* =====================================================================================
   9. SEND A RAVEN: contact form → serverless API (falls back to email)
   ===================================================================================== */
const API = (window.PORTFOLIO_API || "").replace(/\/$/, "");
if (API) fetch(API + "/api/health").catch(() => {});
const courier = $("#courier");
miniRaven(el("g", { class: "mini" }, $(".cbody", courier)));
el("rect", { x: 14, y: 4, width: 16, height: 7, rx: 3, fill: "#d8c79a", stroke: "#7d6331" }, $(".cbody", courier)); // the rolled letter

function flyCourier(from) {
  if (!motion || !MP) return Promise.resolve();
  const [x0, y0] = from, x1 = innerWidth + 140, y1 = -120;
  burst(x0, y0, 14, 1.2);
  return new Promise(res => G.timeline({ onComplete: res })
    .set(courier, { opacity: 1, x: x0 - 60, y: y0 - 40, scale: .4, rotation: 0 })
    .to(courier, { scale: 1.2, duration: .4, ease: "back.out(2)" })
    .to(courier, { duration: 1.5, ease: "power2.in", motionPath: { path: [{ x: x0 - 140, y: y0 - 160 }, { x: (x0 + x1) / 2, y: y0 - 320 }, { x: x1, y: y1 }], curviness: 1.4, autoRotate: false }, scale: .6 }, .2)
    .to(courier, { opacity: 0, duration: .3 }, "-=.3"));
}

$("#contact-form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, st = $("#form-status"), btn = f.querySelector("button[type=submit]");
  const data = Object.fromEntries(new FormData(f));
  if (!API) { location.href = `mailto:mazenashraframzy@gmail.com?subject=${encodeURIComponent("Portfolio: " + data.name)}&body=${encodeURIComponent(data.message + "\n\n" + data.email)}`; return; }
  btn.disabled = true; st.textContent = "The raven is taking flight…";
  const slow = setTimeout(() => st.textContent = "Still flying. The server is waking up, which can take up to a minute…", 4000);
  const ctl = new AbortController(), cap = setTimeout(() => ctl.abort(), 60000);
  try {
    const r = await fetch(API + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || `server error ${r.status}`);
    const b = btn.getBoundingClientRect();
    await flyCourier([b.left + b.width / 2, b.top + b.height / 2]);
    $("#sent-name").textContent = String(data.name).trim().split(/\s+/)[0];
    $("#sent-email").textContent = data.email;
    st.textContent = ""; f.reset(); f.classList.add("is-sent");
    const sent = $("#form-sent"); sent.hidden = false; sent.focus({ preventScroll: true });
    if (motion) G.fromTo(sent.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: "back.out(1.6)" });
  } catch (err) {
    const why = err.name === "AbortError" ? "the server took too long" : err.name === "TypeError" ? "network error" : err.message;
    st.innerHTML = `The raven couldn't fly (${esc(why)}). Please email <a href="mailto:mazenashraframzy@gmail.com">mazenashraframzy@gmail.com</a>.`;
  } finally { clearTimeout(slow); clearTimeout(cap); btn.disabled = false; }
});
$("#send-another").addEventListener("click", () => { const f = $("#contact-form"); f.classList.remove("is-sent"); $("#form-sent").hidden = true; f.querySelector("input[name=name]").focus(); });

window.blackwing = { burst, pose, render }; // handy for tinkering in the console
})();
