/* BLACKWING: the portfolio told as one day in Odin's hall.
   Dawn: the All-Father's eye opens and Huginn and Muninn (real 3D ravens, raven3d.js) leave Hliðskjálf as you scroll.
   Midgard: the deeds, carved as runestones. Mímir's Well: Odin's sacrificed eye watching from the water.
   Nidavellir: the forge. Dusk: the ravens fly home and land on Odin's shoulders.
   Performance: the sky is painted once and only moved; the one small particle canvas, the well and the 3D ravens
   draw only while they are on screen, at most 30 times a second. */
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
const rnd = (a, b) => a + Math.random() * (b - a), clamp01 = t => Math.max(0, Math.min(1, t));
const onView = (target, cb, opts = {}) => { const io = new IntersectionObserver(es => es.forEach(e => cb(e.isIntersecting, e)), opts); io.observe(target); return io; };
let paused = false;
window.blackwing = { isPaused: () => paused };
const three = () => window.blackwing3d || {};

/* ---------- Elder Futhark ---------- */
const RUNE = { a: "ᚨ", b: "ᛒ", c: "ᚲ", d: "ᛞ", e: "ᛖ", f: "ᚠ", g: "ᚷ", h: "ᚺ", i: "ᛁ", j: "ᛃ", k: "ᚲ", l: "ᛚ", m: "ᛗ", n: "ᚾ", o: "ᛟ", p: "ᛈ", q: "ᚲ", r: "ᚱ", s: "ᛊ",
  t: "ᛏ", u: "ᚢ", v: "ᚹ", w: "ᚹ", x: "ᛉ", y: "ᛃ", z: "ᛉ", "í": "ᛁ", "á": "ᚨ", "ð": "ᚦ", "ö": "ᛟ", "é": "ᛖ", "þ": "ᚦ" };
const RUNES = Object.values(RUNE);
const toRunes = s => s.toLowerCase().replace(/th/g, "ᚦ").replace(/ng/g, "ᛜ").replace(/./g, c => RUNE[c] || (c === " " ? " ᛫ " : /[a-z]/.test(c) ? c : ""));

// Text arrives carved in runes and resolves, letter by letter, into English.
function runify(node) {
  const text = node.textContent; node.dataset.text = text; node.setAttribute("aria-label", text);
  node.innerHTML = [...text].map(c => { const r = RUNE[c.toLowerCase()]; return r ? `<span class="rn" aria-hidden="true">${r}</span>` : `<span aria-hidden="true">${c}</span>`; }).join("");
}
function decode(node, dur = 900) {
  const text = node.dataset.text; if (!text) return;
  const spans = [...node.children], n = spans.length, t0 = performance.now();
  const id = setInterval(() => {
    const t = performance.now() - t0; let left = 0;
    spans.forEach((s, i) => {
      if (!s.classList.contains("rn")) return;
      if (t > (i / n) * dur * .75 + 120) { s.textContent = text[i]; s.classList.remove("rn"); }
      else { left++; if (Math.random() < .35) s.textContent = RUNES[(Math.random() * RUNES.length) | 0]; }
    });
    if (!left) { clearInterval(id); node.textContent = text; node.removeAttribute("aria-label"); }
  }, 45);
}
const runeEls = reduce ? [] : $$("[data-runes]");
runeEls.forEach(runify);

/* =====================================================================================
   1. FLYING RAVENS: a 12-frame flight cycle rendered in Blender from the "Crow Fly" model (one 40 KB sprite sheet)
   ===================================================================================== */
const SPAN = 75;   // wingspan, in px, of the bird inside one 120 px sprite cell
function makeFlyer(fixed = true, cls = "") {
  const d = document.createElement("i"); d.className = "sprite" + (fixed ? " flyer" : "") + (cls ? " " + cls : ""); d.setAttribute("aria-hidden", "true");
  d.style.animationDelay = -rnd(0, .45).toFixed(2) + "s"; if (fixed) document.body.appendChild(d); return d;
}
const killFlyer = f => { if (G) G.killTweensOf(f); f.remove(); };

/* =====================================================================================
   2. SKY: nebula, milky band and stars are painted ONCE into an image; scrolling only moves it.
   ===================================================================================== */
const sky = $("#sky");
let skyW = 0;
function paintSky() {
  const W = innerWidth, H = Math.round(innerHeight * 1.6);
  if (Math.abs(W - skyW) < 160 && skyW) return; skyW = W;
  const c = document.createElement("canvas"); c.width = W; c.height = H; const n = c.getContext("2d");
  n.fillStyle = "#050507"; n.fillRect(0, 0, W, H);
  const blob = (x, y, r, col) => { const g = n.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, "rgba(5,5,7,0)"); n.fillStyle = g; n.fillRect(0, 0, W, H); };
  blob(W * .74, H * .12, W * .5, "rgba(92,63,143,.40)"); blob(W * .58, H * .2, W * .25, "rgba(150,110,200,.14)");
  blob(W * .12, H * .42, W * .45, "rgba(31,90,98,.22)"); blob(W * .45, H * .72, W * .55, "rgba(36,48,107,.26)"); blob(W * .9, H * .9, W * .35, "rgba(92,63,143,.18)");
  for (let i = 0; i < 1400; i++) { const t = Math.random(), off = (Math.random() + Math.random() - 1) * H * .09;
    n.fillStyle = `rgba(215,215,255,${rnd(.04, .2).toFixed(2)})`; n.fillRect(t * W, H * .05 + t * H * .55 + off, rnd(.5, 1.4), rnd(.5, 1.4)); }
  for (let i = 0; i < Math.min(700, W * H / 2200); i++) { const r = Math.random() ** 3 * 1.5 + .3;
    n.fillStyle = Math.random() < .05 ? `rgba(240,213,149,${rnd(.4, .9)})` : `rgba(226,230,255,${rnd(.2, .85)})`; n.beginPath(); n.arc(Math.random() * W, Math.random() * H, r, 0, 6.283); n.fill(); }
  c.toBlob(b => { if (!b) return; const u = URL.createObjectURL(b), old = sky.dataset.url; sky.style.backgroundImage = `url(${u})`; sky.dataset.url = u; if (old) setTimeout(() => URL.revokeObjectURL(old), 1000); }, "image/jpeg", .9);
}
paintSky();
if (!reduce) {
  for (let i = 0; i < (small ? 14 : 30); i++) { const s = document.createElement("i"); s.className = "tw" + (Math.random() < .12 ? " g" : "");
    s.style.cssText = `left:${rnd(0, 100)}%;top:${rnd(0, 60)}%;animation-delay:${-rnd(0, 4)}s;animation-duration:${rnd(2.5, 5)}s`; sky.appendChild(s); }
  if (G) { const shoot = document.createElement("i"); shoot.className = "shoot"; sky.appendChild(shoot);
    const fire = () => { if (!document.hidden && !paused) G.fromTo(shoot, { x: rnd(innerWidth * .4, innerWidth), y: rnd(20, innerHeight * .35), rotation: 155, opacity: 0, scaleX: .3 },
      { keyframes: [{ opacity: .9, scaleX: 1, duration: .25 }, { x: "-=420", y: "+=190", opacity: 0, duration: .75, ease: "power1.in" }] });
      G.delayedCall(rnd(7, 15), fire); };
    G.delayedCall(4, fire); }
}
let skyY = -1;
const moveSky = () => { const y = Math.round(-scrollY * .05); if (y !== skyY) { skyY = y; sky.style.transform = `translate3d(0,${Math.max(y, -innerHeight * .55)}px,0)`; } };
addEventListener("scroll", () => requestAnimationFrame(moveSky), { passive: true }); moveSky();
let rz; addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(() => { paintSky(); sizeFeathers(); }, 200); });

/* =====================================================================================
   3. FEATHERS: a few drifting down, plus bursts. One canvas at device-pixel ratio 1, 30 fps, paused when hidden.
   ===================================================================================== */
const fc = $("#feathers"), fx = fc.getContext("2d");
let W = 0, H = 0;
function sizeFeathers() { W = fc.width = innerWidth; H = fc.height = innerHeight; }
sizeFeathers();
const featherD = (L, w) => `M0 0C${w} ${-L * .2} ${w * .78} ${-L * .7} 0 ${-L}C${-w * .55} ${-L * .8} ${-w * .92} ${-L * .24} 0 0Z`;
const quill = new Path2D(featherD(1, .17));
const flock = [];
const addDrifter = y => flock.push({ x: rnd(0, W), y, z: rnd(.35, 1), rot: rnd(0, 6.3), vr: rnd(-.6, .6), sway: rnd(0, 6.3), sp: rnd(.4, 1), sheen: Math.random() < .5 ? "130,145,230" : "90,170,165" });
function burst(x, y, n = 10, power = 1) {
  if (reduce) return;
  for (let i = 0; i < n; i++) { const a = rnd(0, Math.PI * 2), v = rnd(1.5, 5) * power;
    flock.push({ x, y, z: rnd(.5, 1.1), rot: rnd(0, 6.3), vr: rnd(-3, 3), sway: rnd(0, 6.3), sp: rnd(.4, 1), vx: Math.cos(a) * v, vy: Math.sin(a) * v - 2, life: rnd(2, 3.4), age: 0, sheen: Math.random() < .5 ? "130,145,230" : "201,164,92" }); }
}
let scrollV = 0, lastY = scrollY;
addEventListener("scroll", () => { scrollV += scrollY - lastY; lastY = scrollY; }, { passive: true });
for (let i = 0; i < (small ? 5 : 10); i++) addDrifter(rnd(0, H));
let last = 0;
function loop(now) {
  requestAnimationFrame(loop);
  if (paused || document.hidden || now - last < 33) return;
  const dt = Math.min(.1, (now - (last || now)) / 1000); last = now;
  fx.clearRect(0, 0, W, H);
  const wind = Math.max(-40, Math.min(40, scrollV)) * .06; scrollV *= .85;
  for (let i = flock.length - 1; i >= 0; i--) {
    const f = flock[i];
    if (f.vx !== undefined) { f.age += dt; f.vx *= .97; f.vy = f.vy * .97 + .06; f.x += f.vx; f.y += f.vy; if (f.age > f.life) { flock.splice(i, 1); continue; } }
    else { f.sway += dt * f.sp; f.y += (.35 + f.z * .55) * f.sp - wind * f.z; f.x += Math.sin(f.sway) * .6 * f.z; if (f.y > H + 40) { f.y = -40; f.x = rnd(0, W); } if (f.y < -60) f.y = H + 30; }
    f.rot += f.vr * dt * .6 + Math.sin(f.sway) * .004;
    const L = 22 + f.z * 24;
    fx.setTransform(Math.cos(f.rot) * L, Math.sin(f.rot) * L, -Math.sin(f.rot) * L, Math.cos(f.rot) * L, f.x, f.y);
    fx.globalAlpha = f.vx !== undefined ? clamp01(1 - f.age / f.life) : .3 + f.z * .4;
    fx.fillStyle = "#0b0a12"; fx.fill(quill); fx.lineWidth = 1.1 / L; fx.strokeStyle = `rgba(${f.sheen},.75)`; fx.stroke(quill);
  }
  fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalAlpha = 1;
}
if (!reduce) requestAnimationFrame(loop);

/* =====================================================================================
   4. DAWN: the eye opens, the name is read from the runes, and the ravens are lit
   ===================================================================================== */
let seen = false; try { seen = sessionStorage.getItem("bw-intro") === "1"; sessionStorage.setItem("bw-intro", "1"); } catch {}
const html = document.documentElement;
function heroIn() {
  html.classList.remove("intro-on");
  window.__bwHero = true; dispatchEvent(new Event("bw:hero"));
  const title = $(".title .word");
  if (!motion) { decode(title, 600); return; }
  G.timeline({ onComplete: startIdle })
    .fromTo(".birds", { y: 46 }, { y: 0, duration: 2.6, ease: "power3.out" }, 0)
    .fromTo(".runes", { opacity: 0, scale: .85, rotation: -20 }, { opacity: .55, scale: 1, rotation: 0, duration: 2.4, ease: "power3.out" }, 0)
    .fromTo(title, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", onStart: () => decode(title, 1500) }, .3)
    .fromTo([".eyebrow", ".tagline", ".cta", ".omens"], { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .9, stagger: .1, ease: "power3.out" }, 1);
}
function startIdle() {
  G.to(".runes", { rotation: 360, duration: 160, ease: "none", repeat: -1 });
  if (ST) {
    G.to(".runes", { yPercent: -12, scale: .88, opacity: .12, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: .6 } });
    // Huginn and Muninn take off as you leave the high seat, and are back when you return.
    let gone = false;
    ST.create({ trigger: ".hero", start: "top top", end: "bottom top", onUpdate(s) {
      if (!gone && s.progress > .26 && three().ok) { gone = true; takeoff(); }
      else if (gone && s.progress < .05) { gone = false; G.to(".birds", { opacity: 1, duration: .8 }); three().setHeroAway?.(false); }
    } });
  }
  G.delayedCall(4, sendFlyer);
}
function takeoff() {
  const heads = three().heroHeads?.() || [], s = $(".birds").clientHeight * .42 / SPAN;
  G.to(".birds", { opacity: 0, duration: .35, onComplete: () => three().setHeroAway?.(true) });
  heads.forEach(([x, y], i) => {
    const f = makeFlyer(), dirn = i === 0 ? 1 : -1;   // Huginn to the right, Muninn to the left
    burst(x, y, 8, 1);
    G.timeline({ onComplete: () => killFlyer(f) })
      .set(f, { x, y, scale: s, scaleX: s * dirn, opacity: 1 })
      .to(f, { duration: 1.7, ease: "power2.in", motionPath: { path: [{ x: x + dirn * 140, y: y - 120 }, { x: dirn > 0 ? innerWidth + 200 : -200, y: -180 }], curviness: 1.2 }, scale: .3, scaleX: .3 * dirn });
  });
}
// now and then a raven crosses the dawn sky, behind the content
function sendFlyer() {
  if (!motion) return;
  if (!paused && !document.hidden && scrollY < innerHeight * .8) {
    const f = makeFlyer(true, "ambient"), dirn = Math.random() < .5 ? 1 : -1, s = rnd(.3, .62), y0 = rnd(innerHeight * .08, innerHeight * .34);
    G.fromTo(f, { x: dirn > 0 ? -120 : innerWidth + 120, y: y0, scale: s, scaleX: s * dirn, opacity: .5 + s * .5 },
      { x: dirn > 0 ? innerWidth + 120 : -120, y: y0 + rnd(-60, 30), duration: rnd(9, 13) / (s + .4), ease: "none", onComplete: () => killFlyer(f) });
  }
  G.delayedCall(rnd(7, 13), sendFlyer);
}
if (!motion || seen) { $("#intro").remove(); requestAnimationFrame(heroIn); }
else {
  const skip = () => { if (introTl.progress() < 1) introTl.progress(1); };
  const introTl = G.timeline({ onComplete: () => { $("#intro")?.remove(); removeEventListener("keydown", skip); heroIn(); } });
  introTl.set(".eye .pupil", { scale: 1.7, transformOrigin: "50% 50%" })
    .to(".lid-top", { scaleY: 0, transformOrigin: "50% 0%", duration: 1, ease: "power3.inOut" }, .25)
    .to(".lid-bot", { scaleY: 0, transformOrigin: "50% 100%", duration: 1, ease: "power3.inOut" }, .25)
    .to(".eye .pupil", { scale: 1, duration: .8, ease: "elastic.out(1, .4)" }, 1.05)
    .to(".intro-line span", { opacity: 1, duration: .5, stagger: .35 }, .6)
    .to("#intro .eye", { scale: 7, opacity: 0, duration: .9, ease: "power3.in" }, 2.3)
    .to("#intro", { opacity: 0, duration: .5 }, 2.75);
  $("#intro").addEventListener("click", skip); addEventListener("keydown", skip, { once: true });
}

/* =====================================================================================
   5. YGGDRASIL: the world-tree navigation (gold sap = how far down the worlds you are)
   ===================================================================================== */
const tree = $(".tree"), treeLinks = $$(".tree a");
if (tree) {
  const sap = () => tree.style.setProperty("--sap", clamp01(scrollY / (document.documentElement.scrollHeight - innerHeight)).toFixed(3));
  addEventListener("scroll", () => requestAnimationFrame(sap), { passive: true }); sap();
  const setWorld = w => treeLinks.forEach(a => a.classList.toggle("on", a.dataset.world === w));
  const secIO = new IntersectionObserver(es => es.forEach(e => e.isIntersecting && setWorld(e.target.dataset.worldSec)), { rootMargin: "-45% 0px -50% 0px" });
  $$("[data-world-sec]").forEach(s => secIO.observe(s)); setWorld("top");
}

/* =====================================================================================
   6. MIDGARD: the deeds as runestones
   ===================================================================================== */
function mediaHTML(p) {
  if (!p.img) return `<div class="poster" style="background-image:url(media/poster-${p.id}.jpg)"><b>${esc(p.title)}</b><small>${esc(p.kicker)}</small></div>`;
  const base = p.portrait
    ? `<img class="blur" src="${p.img.replace(/\.jpg$/, "-blur.jpg")}" alt="" decoding="async"><img class="fg" src="${p.img}" alt="${esc(p.title)}" loading="lazy" decoding="async">`
    : `<img src="${p.img}" srcset="${p.img.replace(/\.jpg$/, "-640.jpg")} 640w, ${p.img} 1280w" sizes="(max-width: 680px) 100vw, 620px" alt="${esc(p.title)}" loading="lazy" decoding="async">`;
  return base + (p.video ? `<video class="preview" muted loop playsinline preload="none" data-src="${p.video}"></video>` : "");
}
function cardHTML(p) {
  const badge = p.play ? `<span class="badge live">ᚱ Playable</span>` : p.video ? `<span class="badge">▶ Video</span>` : "";
  const acts = [];
  if (p.play) acts.push(`<button class="btn gold" data-play="${p.id}">Play in browser</button>`);
  if (p.video) acts.push(`<button class="btn gold" data-watch="${p.id}">Watch</button>`);
  acts.push(`<button class="btn" data-details="${p.id}">Details</button>`);
  if (p.link) acts.push(`<a class="btn" href="${p.link}" target="_blank" rel="noopener">GitHub ↗</a>`);
  return `<article class="card${p.wide ? " wide" : ""}" data-id="${p.id}" data-cats="${p.cats.join(" ")}" style="--tint:${p.tint}">
    <div class="media${p.portrait ? " portrait" : ""}" data-open="${p.id}" role="button" tabindex="0" aria-label="${esc((p.play ? "Play " : p.video ? "Watch " : "Details: ") + p.title)}">${badge}${mediaHTML(p)}</div>
    <div class="body"><span class="runeband" aria-hidden="true">${toRunes(p.title)}</span><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p>
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
  G.to(cards.filter(c => !c.classList.contains("hide")), { opacity: 0, y: 16, duration: .2, stagger: .015, ease: "power2.in", onComplete() {
    cards.forEach(c => c.classList.toggle("hide", !keep(c)));
    G.fromTo(cards.filter(c => !c.classList.contains("hide")), { opacity: 0, y: 34 }, { opacity: 1, y: 0, duration: .7, stagger: .05, ease: "power3.out", clearProps: "transform", onComplete: () => { filtering = false; ST && ST.refresh(); } });
    const r = ch.getBoundingClientRect(); burst(r.left + r.width / 2, r.top + r.height / 2, 5, .6);
  } });
}));
if (fine) cards.forEach(card => {
  const v = card.querySelector("video.preview"); if (!v) return;
  card.addEventListener("pointerenter", () => { if (!v.src) v.src = v.dataset.src; v.currentTime = 0; v.play().then(() => card.classList.add("playing")).catch(() => {}); });
  card.addEventListener("pointerleave", () => { v.pause(); card.classList.remove("playing"); });
});

/* ---------- modal ---------- */
const modal = $("#modal"), mBody = $("#modal-body"), mTitle = $("#modal-title");
let lastFocus = null;
function openModal(title, inner) {
  lastFocus = document.activeElement; mTitle.textContent = title; mBody.innerHTML = inner; modal.hidden = false;
  document.body.style.overflow = "hidden"; paused = true; $("#modal-fs").hidden = !mBody.querySelector("iframe");
  if (motion) G.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: .3 });
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
  openModal(p.kicker, `<div class="details" style="--tint:${p.tint}"><span class="runeband">${toRunes(p.title)}</span><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3>
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
   7. REVEALS (transform + opacity only) and rune decoding as each heading comes into view
   ===================================================================================== */
const decodeIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { decodeIO.unobserve(e.target); decode(e.target); } }), { rootMargin: "0px 0px -12% 0px" });
runeEls.filter(n => !n.closest(".hero")).forEach(n => decodeIO.observe(n));
if (motion) {
  const groups = [[".lore", { y: 30, opacity: 0 }], [".omen-card", { y: 50, opacity: 0 }], [".numeral", { x: -40, opacity: 0 }],
    [".card", { y: 60, opacity: 0 }], [".stops li", { x: 40, opacity: 0 }], [".trove", { y: 40, opacity: 0 }], [".well", { opacity: 0, scale: .96 }],
    [".odin", { opacity: 0 }], [".scroll-form", { y: 40, opacity: 0 }], [".forge-lore", { opacity: 0 }]];
  for (const [sel, from] of groups) G.set(sel, from);
  const io = new IntersectionObserver(es => {
    const batch = es.filter(e => e.isIntersecting).map(e => e.target); if (!batch.length) return;
    batch.forEach(t => io.unobserve(t));
    G.to(batch, { x: 0, y: 0, opacity: 1, scale: 1, duration: 1.1, stagger: .08, ease: "expo.out", clearProps: "transform" });
  }, { rootMargin: "0px 0px -8% 0px" });
  groups.forEach(([sel]) => $$(sel).forEach(t => io.observe(t)));
}

// nav: solid once you leave the top, hides going down, returns going up
let prevY = scrollY;
const nav = $(".nav");
addEventListener("scroll", () => { const y = scrollY; nav.classList.toggle("solid", y > 40); nav.classList.toggle("hide", y > prevY && y > innerHeight * .8 && modal.hidden); prevY = y; }, { passive: true });
// in-page links: smooth, and never a reload because of the <base> tag
document.addEventListener("click", e => {
  const a = e.target.closest("a[href*='#']"); if (!a) return;
  const url = new URL(a.href); if (url.pathname !== location.pathname) return;
  const t = url.hash.length > 1 && document.getElementById(url.hash.slice(1)); if (!t && url.hash !== "#top") return;
  e.preventDefault(); (t || document.body).scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" }); history.replaceState(null, "", url.hash);
});

/* =====================================================================================
   8. MÍMIR'S WELL: Odin's eye at the bottom of the water, drawn (not modelled): a gold iris of fibres and runes,
   bent by every ripple you make. It follows your cursor and blinks.
   ===================================================================================== */
(() => {
  const cv = $("#well"); if (!cv) return;
  const g = cv.getContext("2d"), eyeCv = document.createElement("canvas"), e = eyeCv.getContext("2d"), irisCv = document.createElement("canvas");
  let w, h, cx, cy, rx, ry, er, rim, live = false, lastT = 0, blink = 0, nextBlink = 3, look = [0, 0], lookTo = [0, 0], d = 1;
  const ripples = [];
  function buildIris() {                     // painted once: radial fibres, a collarette, a ring of runes and the dark limbal ring
    const R = 160; irisCv.width = irisCv.height = R * 2; const c = irisCv.getContext("2d");
    const gr = c.createRadialGradient(R, R, R * .18, R, R, R); gr.addColorStop(0, "#fff3c8"); gr.addColorStop(.28, "#f2c45c"); gr.addColorStop(.62, "#b9731d"); gr.addColorStop(.9, "#4f2a0b"); gr.addColorStop(1, "#140a04");
    c.fillStyle = gr; c.beginPath(); c.arc(R, R, R, 0, 6.283); c.fill();
    for (let i = 0; i < 640; i++) { const a = Math.random() * 6.283, r0 = R * (.2 + Math.random() * .12), r1 = R * (.55 + Math.random() * .42), b = (Math.random() - .5) * .3;
      c.strokeStyle = Math.random() < .55 ? `rgba(255,232,170,${(.06 + Math.random() * .2).toFixed(2)})` : `rgba(70,32,8,${(.1 + Math.random() * .25).toFixed(2)})`;
      c.lineWidth = .5 + Math.random() * 1.3; c.beginPath(); c.moveTo(R + Math.cos(a) * r0, R + Math.sin(a) * r0);
      c.quadraticCurveTo(R + Math.cos(a + b) * (r0 + r1) / 2, R + Math.sin(a + b) * (r0 + r1) / 2, R + Math.cos(a) * r1, R + Math.sin(a) * r1); c.stroke(); }
    c.strokeStyle = "rgba(255,214,140,.5)"; c.lineWidth = 2.2; c.beginPath();
    for (let i = 0; i <= 72; i++) { const a = i / 72 * 6.283, rr = R * (.4 + (i % 2 ? .045 : -.02)); i ? c.lineTo(R + Math.cos(a) * rr, R + Math.sin(a) * rr) : c.moveTo(R + Math.cos(a) * rr, R + Math.sin(a) * rr); }
    c.stroke();
    c.fillStyle = "rgba(255,238,196,.32)"; c.font = `${Math.round(R * .1)}px "Noto Sans Runic", serif`; c.textAlign = "center"; c.textBaseline = "middle";
    for (let i = 0; i < 18; i++) { const a = i / 18 * 6.283; c.save(); c.translate(R + Math.cos(a) * R * .76, R + Math.sin(a) * R * .76); c.rotate(a + Math.PI / 2); c.fillText(RUNES[i % RUNES.length], 0, 0); c.restore(); }
    c.strokeStyle = "rgba(8,4,2,.9)"; c.lineWidth = R * .09; c.beginPath(); c.arc(R, R, R * .955, 0, 6.283); c.stroke();
  }
  buildIris(); document.fonts?.ready.then(buildIris);
  function size() {
    d = Math.min(devicePixelRatio || 1, 1.5); w = cv.clientWidth; h = cv.clientHeight; if (!w || !h) return;
    cv.width = w * d; cv.height = h * d; g.setTransform(d, 0, 0, d, 0, 0);
    cx = w / 2; cy = h * .46; rx = Math.min(w * .36, 300); ry = rx * .32; er = rx * .2;
    eyeCv.width = Math.ceil(er * 4.4 * d); eyeCv.height = Math.ceil(er * 2.4 * d);
    rim = document.createElement("canvas"); rim.width = w * d; rim.height = h * d; const r = rim.getContext("2d"); r.setTransform(d, 0, 0, d, 0, 0);
    const shaft = r.createLinearGradient(0, cy - ry, 0, cy + ry * 2.6); shaft.addColorStop(0, "#0b0a12"); shaft.addColorStop(1, "#050507");
    r.fillStyle = shaft; r.beginPath(); r.ellipse(cx, cy + ry * .9, rx * 1.18, ry * 2.4, 0, 0, Math.PI); r.fill();
    for (let k = 0; k < 34; k++) {
      const a0 = k / 34 * Math.PI * 2, a1 = (k + 1) / 34 * Math.PI * 2 - .03, o = rnd(1.03, 1.06), i2 = rnd(1.2, 1.27);
      r.beginPath(); r.ellipse(cx, cy, rx * i2, ry * i2, 0, a0, a1); r.ellipse(cx, cy, rx * o, ry * o, 0, a1, a0, true); r.closePath();
      const front = Math.sin((a0 + a1) / 2) > 0, l = front ? rnd(26, 36) : rnd(16, 23);
      r.fillStyle = `rgb(${l},${l - 2},${l + 4})`; r.fill(); r.strokeStyle = front ? "#3d3846" : "#25212f"; r.lineWidth = 1; r.stroke();
    }
    for (let k = 0; k < 7; k++) { const a = rnd(0, Math.PI * 2); r.fillStyle = "rgba(201,164,92,.45)"; r.font = `${Math.round(rx * .05)}px "Noto Sans Runic", serif`;
      r.fillText(RUNES[(Math.random() * RUNES.length) | 0], cx + Math.cos(a) * rx * 1.15, cy + Math.sin(a) * ry * 1.15); }
  }
  // the eye itself, drawn flat into its own small canvas each frame (lids, iris, pupil, highlights)
  function drawEye(t, open) {
    const W = eyeCv.width / d, H = eyeCv.height / d, x0 = W / 2, y0 = H / 2;
    e.setTransform(d, 0, 0, d, 0, 0); e.clearRect(0, 0, W, H);
    const lid = er * 1.05 * open;
    e.save(); e.beginPath(); e.moveTo(x0 - er * 2.1, y0); e.bezierCurveTo(x0 - er, y0 - lid * 1.35, x0 + er, y0 - lid * 1.35, x0 + er * 2.1, y0);
    e.bezierCurveTo(x0 + er, y0 + lid * 1.25, x0 - er, y0 + lid * 1.25, x0 - er * 2.1, y0); e.closePath(); e.clip();
    const sc = e.createRadialGradient(x0, y0, er * .4, x0, y0, er * 2.2); sc.addColorStop(0, "#5a5146"); sc.addColorStop(1, "#141110");
    e.fillStyle = sc; e.fillRect(0, 0, W, H);
    const ix = x0 + look[0] * er * .7, iy = y0 + look[1] * er * .35, pulse = 1 + Math.sin(t * .9) * .06;
    e.drawImage(irisCv, ix - er, iy - er, er * 2, er * 2);
    const pr = er * .34 * pulse, pg = e.createRadialGradient(ix, iy, pr * .7, ix, iy, pr * 1.15); pg.addColorStop(0, "#030203"); pg.addColorStop(1, "rgba(3,2,3,0)");
    e.fillStyle = pg; e.beginPath(); e.arc(ix, iy, pr * 1.15, 0, 6.283); e.fill();
    e.fillStyle = "rgba(255,250,235,.85)"; e.beginPath(); e.ellipse(ix - er * .32, iy - er * .34, er * .13, er * .09, -.5, 0, 6.283); e.fill();
    e.fillStyle = "rgba(255,250,235,.35)"; e.beginPath(); e.arc(ix + er * .3, iy + er * .28, er * .05, 0, 6.283); e.fill();
    const shade = e.createLinearGradient(0, y0 - lid * 1.3, 0, y0 + lid * .2); shade.addColorStop(0, "rgba(0,0,0,.75)"); shade.addColorStop(1, "rgba(0,0,0,0)");
    e.fillStyle = shade; e.fillRect(0, 0, W, H);
    e.restore();
  }
  function draw(now) {
    if (!rim || !w) return;
    const t = now / 1000, dt = Math.min(.05, t - (lastT || t)); lastT = t;
    g.clearRect(0, 0, w, h);
    g.save(); g.beginPath(); g.ellipse(cx, cy, rx * 1.04, ry * 1.04, 0, 0, Math.PI * 2); g.clip();
    const water = g.createRadialGradient(cx, cy, 0, cx, cy, rx); water.addColorStop(0, "#15122b"); water.addColorStop(1, "#050508");
    g.fillStyle = water; g.fillRect(cx - rx * 1.1, cy - ry * 1.1, rx * 2.2, ry * 2.2);
    look[0] += (lookTo[0] - look[0]) * .1; look[1] += (lookTo[1] - look[1]) * .1;
    if (nextBlink < 100) nextBlink = t + 3;               // first frame: schedule the first blink from now
    if (t > nextBlink) { blink = 1; nextBlink = t + rnd(3.5, 8); } blink = Math.max(0, blink - dt / .3);
    const halo = g.createRadialGradient(cx, cy, 0, cx, cy, er * 3.4), glow = .3 + Math.sin(t * .9) * .06;
    halo.addColorStop(0, `rgba(232,180,80,${glow})`); halo.addColorStop(1, "rgba(232,180,80,0)"); g.fillStyle = halo; g.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    drawEye(t, 1 - Math.sin(blink * Math.PI) * .95);
    // refraction: the eye is copied in thin rows, each pushed sideways by the ripples crossing it, and squashed by the viewing angle
    const W = eyeCv.width, dw = W / d, dh = eyeCv.height / d, flat = .62, top = cy - dh * flat / 2, step = 3;
    for (let y = 0; y < dh; y += step) {
      const py = top + y * flat; let off = Math.sin(y * .09 + t * 1.6) * .8;
      for (const p of ripples) { const dist = Math.hypot(cx - p.x, (py - p.y) / .32), r = p.t * 150, k = Math.exp(-((dist - r) ** 2) / 700) * (1 - p.t / 2.4) * p.a; off += Math.sin(dist * .09 - p.t * 9) * 7 * k; }
      g.drawImage(eyeCv, 0, y * d, W, step * d, cx - dw / 2 + off, py, dw, step * flat + .6);
    }
    for (let i = ripples.length - 1; i >= 0; i--) { const p = ripples[i]; p.t += dt; if (p.t > 2.4) { ripples.splice(i, 1); continue; }
      for (const k of [0, .3]) { const r = (p.t - k) * 150; if (r <= 1) continue;
        g.strokeStyle = `rgba(190,200,255,${(.34 * (1 - p.t / 2.4) * p.a).toFixed(3)})`; g.lineWidth = 1.2; g.beginPath(); g.ellipse(p.x, p.y, r, r * .32, 0, 0, 6.283); g.stroke(); } }
    const sheen = g.createLinearGradient(cx - rx, cy - ry, cx + rx, cy + ry); sheen.addColorStop(0, "rgba(140,150,230,.12)"); sheen.addColorStop(.5, "rgba(0,0,0,0)"); sheen.addColorStop(1, "rgba(63,138,134,.08)");
    g.fillStyle = sheen; g.fillRect(cx - rx * 1.1, cy - ry * 1.1, rx * 2.2, ry * 2.2);
    g.restore();
    g.drawImage(rim, 0, 0, w, h);
  }
  let raf = 0, lastF = 0;
  const tick = now => { raf = live ? requestAnimationFrame(tick) : 0; if (paused || now - lastF < 33) return; lastF = now; draw(now); };
  const add = (x, y, a = 1) => ripples.push({ x, y, t: 0, a });
  const drip = () => { if (live && !reduce && w) { const a = rnd(0, 6.28), k = Math.sqrt(Math.random()) * .8; add(cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k, .7); } setTimeout(drip, rnd(2500, 5000)); };
  size(); addEventListener("resize", () => { size(); if (!live) draw(performance.now()); });
  onView(cv, v => { live = v; if (v && !raf && !reduce) raf = requestAnimationFrame(tick); if (reduce) draw(performance.now()); });
  let lastR = 0;
  cv.addEventListener("pointermove", ev => {
    const r = cv.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
    lookTo = [Math.max(-1, Math.min(1, (x - cx) / rx)), Math.max(-1, Math.min(1, (y - cy) / (ry * 2)))];
    if (((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 < 1 && performance.now() - lastR > 140) { lastR = performance.now(); add(x, y, .8); }
  });
  cv.addEventListener("pointerleave", () => { lookTo = [0, 0]; });
  cv.addEventListener("pointerdown", ev => { const r = cv.getBoundingClientRect(); add(ev.clientX - r.left, ev.clientY - r.top, 1.3); });
  drip();
})();

// Muninn glides down the flight path as you read the memory
(() => {
  const path = $(".path"), line = $("#flightLine"); if (!path || !line) return;
  const bird = makeFlyer(false); bird.id = "pathRaven"; path.appendChild(bird);
  const len = line.getTotalLength(), flight = $(".flight");
  let prevX = 50;
  const place = p => { const pt = line.getPointAtLength(len * p), r = flight.getBoundingClientRect();
    bird.style.transform = `translate(${pt.x / 100 * r.width}px, ${pt.y / 1000 * r.height}px) scaleX(${pt.x >= prevX ? 1 : -1})`; prevX = pt.x; };
  place(0);
  if (motion && ST) ST.create({ trigger: path, start: "top 70%", end: "bottom 60%", scrub: .8, onUpdate: s => place(s.progress) }); else place(.5);
})();

/* =====================================================================================
   9. NIDAVELLIR: embers rise from the forge (CSS, running only while the forge is on screen)
   ===================================================================================== */
(() => {
  const forge = $(".forge"); if (!forge || reduce) return;
  $$(".embers i", forge).forEach(i => i.style.cssText = `--x:${rnd(4, 96)};--d:${rnd(4.5, 9)}s;--dl:${-rnd(0, 9)}s;--dx:${rnd(-60, 60)}px`);
  onView(forge, v => forge.classList.toggle("live", v));
  // a random tool glows from the heat now and then
  const tools = $$(".trove li", forge);
  setInterval(() => { if (!forge.classList.contains("live")) return; const t = tools[(Math.random() * tools.length) | 0]; t.classList.add("hot"); setTimeout(() => t.classList.remove("hot"), 900); }, 1400);
})();

/* =====================================================================================
   10. DUSK: Odin waits with his head bowed. Huginn and Muninn fly home and land on his shoulders, he raises his head,
   and his one eye opens. The flight happens INSIDE his figure (coordinates relative to it), so it ends on his
   shoulders wherever he is on screen, however fast you scroll.
   ===================================================================================== */
(() => {
  const odin = $(".odin"); if (!odin) return;
  $("#contact-form").addEventListener("input", () => { odin.classList.remove("flare"); void odin.offsetWidth; odin.classList.add("flare"); });  // he listens while you write
  const head = $(".odin-head", odin), FR = +(head?.dataset.frames || 0);
  let sheetReady = false;
  const setFrame = k => { head.style.backgroundPosition = `0 ${(k / (FR - 1)) * 100}%`; };
  let sheet = null;
  const fetchSheet = () => { if (sheet || !head || !FR || !motion) return sheet; const img = new Image(); img.src = head.dataset.src;
    return sheet = (img.decode ? img.decode() : Promise.resolve()).then(() => { head.style.backgroundImage = `url("${img.src}")`; setFrame(0); sheetReady = true; }).catch(() => {}); };
  // the head-raise frames (150 KB) load quietly once the page has settled, so they are ready whenever you reach him
  addEventListener("load", () => (window.requestIdleCallback || setTimeout)(fetchSheet, { timeout: 2500 }));
  let done = false;
  const io = new IntersectionObserver(es => {
    if (done || !es[0].isIntersecting) return; done = true; io.disconnect();
    const perch = $$(".raven-perch", odin), eyes = $$(".glint.rv", odin), wake = () => { odin.classList.remove("bowed"); odin.classList.add("awake"); };
    if (!motion) { perch.forEach((p, i) => { p.classList.add("landed"); three().duskLand?.(i); }); eyes.forEach(e => e.classList.add("on")); return wake(); }
    fetchSheet(); const bowed = sheetReady; if (bowed) odin.classList.add("bowed");
    const raise = () => { if (!bowed) return wake(); const o = { k: 0 };
      G.to(o, { k: FR - 1, duration: 1.7, ease: "power2.inOut", onUpdate: () => setFrame(Math.round(o.k)), onComplete: () => G.delayedCall(.15, wake) }); };
    const w = odin.clientWidth, h = odin.clientHeight, s = w * .2 / SPAN;
    let home = 0;
    perch.forEach((p, i) => {
      const [fx, fy] = p.dataset.at.split(",").map(Number), tx = fx * w, ty = fy * h, face = i === 0 ? 1 : -1;
      const f = makeFlyer(false, "perch-flyer"); odin.appendChild(f);
      const sx = face > 0 ? -w * .55 : w * 1.55, sy = -h * .3;
      G.timeline({ delay: i * .8, onComplete: () => {
          const r = odin.getBoundingClientRect(); burst(r.left + tx, r.top + ty, 9, .8);
          p.classList.add("landed"); three().duskLand?.(i); setTimeout(() => eyes[i]?.classList.add("on"), 350);
          G.to(f, { opacity: 0, duration: .2, onComplete: () => killFlyer(f) });
          if (++home === perch.length) G.delayedCall(.7, raise);
        } })
        .set(f, { x: sx, y: sy, scale: s * .5, scaleX: s * .5 * face, opacity: 1 })
        .to(f, { duration: 2.3, ease: "power2.inOut", motionPath: { path: [{ x: (sx + tx) / 2, y: Math.min(sy + h * .1, ty - h * .3) }, { x: tx - face * w * .1, y: ty - h * .08 }, { x: tx, y: ty }], curviness: 1.25 }, scale: s, scaleX: s * face });
    });
  }, { threshold: .4 });
  io.observe(odin);
})();

/* =====================================================================================
   11. CURSOR + feathers on click
   ===================================================================================== */
if (fine && motion) {
  const cur = $(".cursor"), cx = G.quickTo(cur, "x", { duration: .25, ease: "power3" }), cy = G.quickTo(cur, "y", { duration: .25, ease: "power3" });
  addEventListener("pointermove", e => { cur.classList.add("on"); cx(e.clientX); cy(e.clientY); cur.classList.toggle("hot", !!e.target.closest("a, button, [data-open], .chip, input, textarea, #well")); }, { passive: true });
  document.addEventListener("pointerleave", () => cur.classList.remove("on"));
}
$(".hero").addEventListener("click", e => { if (!e.target.closest("a, button")) burst(e.clientX, e.clientY, 6, .8); });

/* =====================================================================================
   12. SEND A RAVEN: contact form → serverless API (falls back to email)
   ===================================================================================== */
const API = (window.PORTFOLIO_API || "").replace(/\/$/, "");
if (API) fetch(API + "/api/health").catch(() => {});
const courier = $("#courier");
function flyCourier([x0, y0]) {
  if (!motion || !MP) return Promise.resolve();
  burst(x0, y0, 14, 1.2);
  return new Promise(res => G.timeline({ onComplete: res })
    .set(courier, { opacity: 1, x: x0, y: y0, scale: .4 })
    .to(courier, { scale: 1.2, duration: .4, ease: "back.out(2)" })
    .to(courier, { duration: 1.5, ease: "power2.in", motionPath: { path: [{ x: x0 - 140, y: y0 - 160 }, { x: (x0 + innerWidth) / 2, y: y0 - 320 }, { x: innerWidth + 140, y: -120 }], curviness: 1.4 }, scale: .6 }, .2)
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
    const b = btn.getBoundingClientRect(); await flyCourier([b.left + b.width / 2, b.top + b.height / 2]);
    $("#sent-name").textContent = String(data.name).trim().split(/\s+/)[0]; $("#sent-email").textContent = data.email;
    st.textContent = ""; f.reset(); f.classList.add("is-sent");
    const sent = $("#form-sent"); sent.hidden = false; sent.focus({ preventScroll: true });
    if (motion) G.fromTo(sent.children, { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: .8, stagger: .08, ease: "back.out(1.6)" });
  } catch (err) {
    const why = err.name === "AbortError" ? "the server took too long" : err.name === "TypeError" ? "network error" : err.message;
    st.innerHTML = `The raven couldn't fly (${esc(why)}). Please email <a href="mailto:mazenashraframzy@gmail.com">mazenashraframzy@gmail.com</a>.`;
  } finally { clearTimeout(slow); clearTimeout(cap); btn.disabled = false; }
});
$("#send-another").addEventListener("click", () => { const f = $("#contact-form"); f.classList.remove("is-sent"); $("#form-sent").hidden = true; f.querySelector("input[name=name]").focus(); });
window.blackwing.burst = burst;
})();
