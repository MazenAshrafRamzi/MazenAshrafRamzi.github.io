const PROJECTS = [
  {
    id: "museum", wide: true, tint: "#d9a533", cats: ["play", "interactive", "xr"],
    kicker: "Interactive museum · 2026", title: "Voices of Stone",
    blurb: "An interactive museum of Ancient Egypt. Three statues tell their own stories in English or Egyptian Arabic, while the camera cuts to each detail they describe.",
    tools: ["Unity 6 URP", "WebGL", "Android", "Blender", "Photogrammetry", "Neural TTS"],
    img: "media/museum.jpg", play: "play/museum/", size: "≈ 72 MB",
    points: [
      "Ra-Horakhty, Bastet and Anubis narrate their lore in the first person. Each has 6 story lines and 3 spoken Q&A answers, and the camera cuts to the part being described.",
      "Cleaned up a client photogrammetry scan from 2.9M to 459k triangles while keeping its UDIM textures intact, and derived normal and metal maps for the gilding.",
      "A fully mirrored Arabic (RTL) mode with Amiri type and Egyptian neural voices. Switching language mid-story restarts the line in the new language.",
      "Tappable hotspots, fact cards, a timeline of Egyptian periods, and three lighting moods: Gallery, a moving Sun of Ra, and flickering Torchlight.",
      "Original procedural ambient music on a Hijaz scale, plus gallery reverb on every voice line. Ships for Windows, Android and WebGL."
    ]
  },
  {
    id: "burger", wide: true, tint: "#ff3b30", cats: ["play", "interactive"],
    kicker: "Interactive brand demo · 2026", title: "Ziggy Burger Lab",
    blurb: "Build your burger on a red ordering tablet, watch it stack in 3D, explode it into layers and send it to the kitchen. Made for the Bad Ziggy brand.",
    tools: ["Unity 6.4 URP", "WebGL", "Procedural meshes", "Input System", "TextMeshPro"],
    img: "media/burger-lab.jpg", play: "play/burger-lab/", size: "≈ 20 MB",
    points: [
      "A tablet-style ordering UI flows into a 3D build view: pick a base, stack toppings, inspect, explode and order.",
      "Every food item is a procedural mesh with URP Lit materials per colour region. No custom shaders, so it stays SRP-Batcher friendly and WebGL-safe.",
      "Zero third-party packages: an in-house camera rig, tween and spring systems replace Cinemachine and DOTween.",
      "Sound effects are synthesized by an editor script and baked to WAV, and 2D icons come from a C# SDF rasterizer, so the whole build is reproducible from code.",
      "The full scene is rebuilt from a single editor menu command, with no missing references."
    ]
  },
  {
    id: "menu", wide: true, tint: "#22d3ee", cats: ["play", "interactive"],
    kicker: "Interactive 3D menu · 2026", title: "Tajriba's Menu (built on Menu Lab)",
    blurb: "Browse a restaurant menu with live 3D dishes: customise a plate, spin or explode it, and send the order. It runs on Menu Lab, my white-label menu engine, which re-skins for a new client from two JSON files.",
    tools: ["Unity 6 URP", "WebGL", "JSON presets", "Arabic / RTL", "uGUI"],
    img: "media/menu-tajriba.jpg", play: "play/tajriba/", size: "≈ 30 MB",
    gallery: ["media/menu-tajriba.jpg", "media/menu-night.jpg", "media/menu-day.jpg"],
    points: [
      "Browse categories, customise a dish (sizes, options, extras) and watch it spin, explode or reset in 3D. Then add to cart, check out and print a receipt.",
      "Client branding is data: preset.json sets colours, fonts, name and price display, and menu.json sets categories and items. Both load from StreamingAssets.",
      "Day and night themes (desert sun, moonlit dunes) and a neon variant for a second client, all from one codebase.",
      "English and Arabic UI with Arabic prices and receipts."
    ]
  },
  {
    id: "ali", tint: "#f2b632", cats: ["interactive", "film"],
    kicker: "Interactive pitch · 2026", title: "Perfect Human: cartoon Muhammad Ali",
    blurb: "A hands-on character creator. Drag, swipe and punch a mascot into shape until it turns into a cartoon Muhammad Ali you can spin, pose and inspect.",
    tools: ["Unity 6 URP", "Toon shading", "Procedural audio", "Input System", "Android"],
    img: "media/perfect-human.jpg", video: "media/perfect-human.mp4", portrait: true,
    points: [
      "Four interactive steps: a height slider, dragging a brain card into the head, a face wheel and a punch pad. Each step plays its voice-over line and a gag.",
      "ALI MODE: orbit, zoom and pan; jump to face, gloves, shorts or boots; switch expressions; play guard, jab, dodge, victory and walk.",
      "A Watch Demo mode plays the 46-second piece on its own. The whole hands-on run is verified with simulated input.",
      "All audio is synthesized in code, with a NaN-safe soft-clip master and clean fades. I tracked down and fixed a NaN bug that was causing thumps at every camera cut."
    ]
  },
  {
    id: "lime", tint: "#b6f23a", cats: ["film"],
    kicker: "Motion graphics · 2026", title: "Limescents: Do You Smell That?",
    blurb: "A 58-second launch film for a creative agency. \"Do you… smell like…\" opens on a fresh-cut lime that becomes LIMESCENTS, then tours the services before signing off on the logo.",
    tools: ["Code-rendered animation", "JavaScript", "ffmpeg", "Sound design"],
    img: "media/limescents.jpg", video: "media/limescents.mp4", portrait: true,
    points: [
      "Vertical 1080×1920 at 30 fps, built for social feeds.",
      "A scent-first hook (\"Do you… smell like…\") cuts from a lime slice to the LIMESCENTS wordmark, then walks through each service: social media, animation and editing, websites, apps and branding, before closing on \"Smart Advertising: That Lingers\".",
      "I wrote a treatment comparing three structures and chose this one, benchmarked against keynote-style product reveals.",
      "Rendered entirely from code (a timeline engine plus an audio mix script), so every edit is reproducible."
    ]
  },
  {
    id: "vr", tint: "#7c9cff", cats: ["xr"],
    kicker: "VR · OpenXR", title: "VR Time Travel Museum",
    blurb: "A collaborative VR museum of Roman history with photogrammetry statues and an AI-driven guide NPC.",
    tools: ["Unity", "OpenXR", "Photogrammetry", "Meshy", "Mixamo", "ElevenLabs"],
    img: "media/vr-rome.jpg", video: "media/vr-rome.mp4",
    link: "https://github.com/MazenAshrafRamzi",
    points: [
      "Interactive environments, spatial audio and narrative-driven exploration.",
      "Roman statues reconstructed through photogrammetry as the centrepiece exhibits.",
      "An AI-driven NPC built with Meshy 3D generation, Mixamo animation and ElevenLabs voice lines."
    ]
  },
  {
    id: "auto", tint: "#3ddc84", cats: ["xr"],
    kicker: "Training simulation · 7P", title: "Automotive Testing Simulator",
    blurb: "A 3D diagnostic trainer with a working multimeter and a 30-point automotive tester that reacts to real component values.",
    tools: ["Unity", "C#", "Blender", "Tripo3D", "RealityScan"],
    points: [
      "Resistors, capacitors, fuses and MOSFETs, each with its own values and orientations, that feed correct readings to the instruments.",
      "Mode-aware multimeter that checks probe orientation and forms the core assessment of Level 1.",
      "Tutorial level, authentication, and progress-gated level select."
    ]
  },
  {
    id: "research", tint: "#c084fc", cats: ["xr"],
    kicker: "Research · PAAMS 2025", title: "Drawings to XR-ready 3D",
    blurb: "My bachelor project turns orthographic engineering drawings into 3D models with computer vision and automated Blender extrusion. It was published by Springer (CCIS).",
    tools: ["Python", "Computer vision", "Blender"],
    points: [
      "Edge detection and contour analysis extract features from engineering drawings.",
      "Automated Blender extrusion workflows output OBJ models ready for XR training.",
      "Peer-reviewed paper at PAAMS 2025, published in Springer CCIS."
    ]
  },
  {
    id: "ar", tint: "#38bdf8", cats: ["xr"],
    kicker: "Mobile AR", title: "AR Pirate Treasure Hunt",
    blurb: "A mobile AR game with real-world plane detection, an NPC pirate guide and touch-based puzzles.",
    tools: ["Unity", "AR Foundation", "Mixamo", "ElevenLabs"],
    img: "media/ar-pirate.jpg", video: "media/ar-pirate.mp4", portrait: true,
    link: "https://github.com/MazenAshrafRamzi",
    points: [
      "Plane detection with AR particle trails that guide the player.",
      "NPC interaction, touch puzzles and an animated victory sequence."
    ]
  }
];

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const G = window.gsap, F = window.Flip, ST = window.ScrollTrigger;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
const motion = G && !reduce;
if (!G) document.documentElement.classList.add("no-gsap");
if (G) G.registerPlugin(...[ST, F].filter(Boolean));

/* ---------- cards ---------- */
function mediaHTML(p) {
  // text-only projects: pre-rendered aurora-curtain art (media/poster-<id>.jpg) under live text; painting the
  // gradient art live cost ~45 ms the first time a poster card came into view
  if (!p.img) return `<div class="poster" style="background-image:url(media/poster-${p.id}.jpg)"><b>${esc(p.title)}</b><small>${esc(p.kicker)}</small></div>`;
  // portrait backdrop: a tiny pre-blurred copy (media/<name>-blur.jpg), not a live CSS blur that re-renders while cards animate
  const base = p.portrait ? `<img class="blur" src="${p.img.replace(/\.jpg$/, "-blur.jpg")}" alt="" decoding="async"><img class="fg" src="${p.img}" alt="${esc(p.title)}" loading="lazy">` : `<img src="${p.img}" srcset="${p.img.replace(/\.jpg$/, "-640.jpg")} 640w, ${p.img} 1280w" sizes="(max-width: 680px) calc(100vw - 32px), (max-width: 1000px) 50vw, 620px" alt="${esc(p.title)}" loading="lazy" decoding="async">`;
  const prev = p.video ? `<video class="preview" muted loop playsinline preload="none" data-src="${p.video}"></video>` : "";
  return base + prev;
}

function cardHTML(p) {
  const badge = p.play ? `<span class="badge live">Playable</span>` : p.video ? `<span class="badge">▶ Video</span>` : "";
  const acts = [];
  if (p.play) acts.push(`<button class="btn primary" data-play="${p.id}">Play in browser</button>`);
  if (p.video) acts.push(`<button class="btn primary" data-watch="${p.id}">Watch</button>`);
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
// Decode every card image once the Work section is near, so switching tabs never waits on a lazy image
// being fetched and decoded mid-animation.
if ("IntersectionObserver" in window) {
  const pre = new IntersectionObserver(es => {
    if (!es.some(e => e.isIntersecting)) return;
    pre.disconnect();
    $$("#grid img").forEach(img => { img.loading = "eager"; img.decode?.().catch(() => {}); });
  }, { rootMargin: "100% 0px" });
  pre.observe($("#grid"));
}
const cards = $$(".card");


/* ---------- filters: springy pill + Flip re-layout ---------- */
const chips = $$(".chip"), ind = $(".chip-ind");
const moveInd = (ch, d = 1) => G && G.to(ind, { x: ch.offsetLeft, y: ch.offsetTop, width: ch.offsetWidth, height: ch.offsetHeight,
  duration: reduce ? 0 : d, ease: "elastic.out(1, .6)", overwrite: true });
moveInd($(".chip.on"), 0);
if (document.fonts) document.fonts.ready.then(() => moveInd($(".chip.on"), 0));
addEventListener("resize", () => moveInd($(".chip.on"), 0));

chips.forEach(ch => ch.addEventListener("click", () => {
  if (ch.classList.contains("on")) return;
  chips.forEach(c => { c.classList.toggle("on", c === ch); c.setAttribute("aria-pressed", c === ch); });
  moveInd(ch);
  const bar = ch.parentElement; // keep the chosen chip in view when the strip scrolls sideways
  if (bar.scrollWidth > bar.clientWidth) bar.scrollTo({ left: ch.offsetLeft - (bar.clientWidth - ch.offsetWidth) / 2, behavior: reduce ? "auto" : "smooth" });
  const f = ch.dataset.f;
  const apply = () => { cards.forEach(c => c.classList.toggle("hide", f !== "all" && !c.dataset.cats.split(" ").includes(f))); };
  if (!motion || !F) return apply();
  // settle any scroll-reveal still running so Flip measures (and restores) clean states
  G.killTweensOf(cards, "opacity,y,scale");
  // cards are now shown for good: stop their scroll-reveal, or it could fire mid-switch and fight Flip for `y`
  if (window.__revealIO) cards.forEach(c => __revealIO.unobserve(c));
  G.set(cards, { opacity: 1, y: 0, scale: 1 });
  const state = F.getState(cards);
  apply();
  const shown = cards.filter(c => !c.classList.contains("hide"));
  // Nothing goes absolute, so the grid keeps a real height and the page below never collapses. Leaving cards drop out
  // at once (fading 7 large cards forces 7 new layers to be painted in a single frame); the cards that stay spring to
  // their new places and new ones pop in. scale:true animates with transforms, so no layout runs per frame.
  F.from(state, {
    targets: shown, duration: .75, ease: "back.out(1.5)", scale: true, stagger: .02,
    onEnter: els => G.fromTo(els, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .7, ease: "back.out(1.7)", overwrite: true }),
    onComplete: () => ST && ST.refresh()
  });
}));

/* ---------- hover video previews ---------- */
if (matchMedia("(hover: hover)").matches) cards.forEach(card => {
  const v = card.querySelector("video.preview");
  if (!v) return;
  let over = false;
  card.addEventListener("mouseenter", () => {
    over = true; if (!v.src) v.src = v.dataset.src; v.currentTime = 0;
    v.play().then(() => { if (over) card.classList.add("playing"); else v.pause(); }).catch(() => {});
  });
  card.addEventListener("mouseleave", () => { over = false; v.pause(); card.classList.remove("playing"); });
});

/* ---------- pointer: spotlight, tilt, magnetic buttons, cursor glow ---------- */
if (fine) {
  cards.forEach(card => card.addEventListener("pointermove", e => {
    const r = card.getBoundingClientRect(), px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
    card.style.setProperty("--mx", px * 100 + "%"); card.style.setProperty("--my", py * 100 + "%");
    if (motion) G.to(card, { rotationX: (.5 - py) * 5, rotationY: (px - .5) * 7, duration: .5, ease: "power3.out", overwrite: "auto" });
  }));
  if (motion) {
    cards.forEach(card => card.addEventListener("pointerleave", () =>
      G.to(card, { rotationX: 0, rotationY: 0, duration: 1.4, ease: "elastic.out(1, .3)", overwrite: "auto" })));
    $$(".btn, .nav .pill").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        G.to(el, { x: (e.clientX - r.left - r.width / 2) * .28, y: (e.clientY - r.top - r.height / 2) * .4, duration: .4, ease: "power3.out", overwrite: "auto" });
      });
      el.addEventListener("pointerleave", () => G.to(el, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1.1, .3)", overwrite: "auto" }));
    });
    const gx = G.quickTo(".glow", "x", { duration: 1, ease: "power3" }), gy = G.quickTo(".glow", "y", { duration: 1, ease: "power3" });
    addEventListener("pointermove", e => { gx(e.clientX); gy(e.clientY); });
  }
}

/* ---------- modal ---------- */
const modal = $("#modal"), mBody = $("#modal-body"), mTitle = $("#modal-title");
let returnFocus = null;
function openModal(title, html) {
  if (motion) G.killTweensOf(modal); // a close still fading out must not hide the new content
  const wasOpen = !modal.hidden;
  if (!wasOpen) returnFocus = document.activeElement;
  mTitle.textContent = title; mBody.innerHTML = html; modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("#modal-fs").hidden = !mBody.querySelector("iframe");
  $("#modal-close").focus({ preventScroll: true });
  window.aurora && aurora.pause(true); // free the GPU for the WebGL demo / video
  if (motion) {
    G.fromTo(modal, { opacity: wasOpen ? 1 : 0 }, { opacity: 1, duration: .3, ease: "power2.out" });
    G.fromTo(mBody.firstElementChild, { y: 60, scale: .94, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 1.1, ease: "elastic.out(1, .8)", clearProps: "transform" });
  }
}
function closeModal() {
  if (modal.hidden) return;
  const done = () => {
    modal.hidden = true; mBody.innerHTML = ""; document.body.style.overflow = "";
    window.aurora && aurora.pause(false);
    if (returnFocus && document.contains(returnFocus)) returnFocus.focus({ preventScroll: true });
    returnFocus = null;
  };
  motion ? G.to(modal, { opacity: 0, duration: .22, ease: "power2.in", onComplete: done, overwrite: true }) : done();
}
$("#modal-close").onclick = closeModal;
addEventListener("keydown", e => {
  if (modal.hidden) {
    // card artwork acts as a button for keyboard users
    if ((e.key === "Enter" || e.key === " ") && e.target.matches?.(".media[data-open]")) { e.preventDefault(); e.target.click(); }
    return;
  }
  if (e.key === "Escape") return closeModal();
  if (e.key === "Tab") { // keep focus inside the dialog
    const f = $$('button:not([hidden]), a[href], iframe, video, [tabindex="0"]', modal);
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});
$("#modal-fs").onclick = () => { const f = mBody.querySelector("iframe"); if (f && f.requestFullscreen) f.requestFullscreen(); };

function play(p) {
  openModal(`${p.title} · live WebGL · ${p.size}`, `<iframe src="${p.play}" allow="fullscreen; autoplay" allowfullscreen title="${esc(p.title)}"></iframe>`);
}
function watch(p) {
  openModal(p.title, `<video src="${p.video}" poster="${p.img}" controls autoplay playsinline></video>`);
}
function details(p) {
  const gal = p.gallery ? `<div class="gallery">${p.gallery.map(g => `<img src="${g}" alt="${esc(p.title)} screenshot" loading="lazy">`).join("")}</div>` : "";
  const acts = [p.play && `<button class="btn primary" data-play="${p.id}">Play in browser</button>`, p.video && `<button class="btn primary" data-watch="${p.id}">Watch</button>`].filter(Boolean).join(" ");
  openModal(p.kicker, `<div class="details" style="--tint:${p.tint}"><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3>
    <p class="muted">${esc(p.blurb)}</p>${gal}<ul>${p.points.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
    <div class="tools">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    ${p.play ? `<p class="note">Runs live in your browser (${p.size} download). Best on a desktop with Chrome, Edge or Firefox.</p>` : ""}
    <div class="actions">${acts}</div></div>`);
}

// in-page anchors: smooth scroll in JS (CSS smooth scrolling fights ScrollTrigger's refresh)
document.addEventListener("click", e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey) return;
  const id = a.getAttribute("href"), el = id === "#top" ? document.body : document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  scrollTo({ top: id === "#top" ? 0 : el.getBoundingClientRect().top + scrollY, behavior: reduce ? "auto" : "smooth" });
  history.replaceState(null, "", id === "#top" ? location.pathname : id);
});

document.addEventListener("click", e => {
  const t = e.target.closest("[data-play],[data-watch],[data-details],[data-open]");
  if (!t) return;
  const p = byId(t.dataset.play || t.dataset.watch || t.dataset.details || t.dataset.open);
  if (!p) return;
  if (t.dataset.play) return play(p);
  if (t.dataset.watch) return watch(p);
  if (t.dataset.details) return details(p);
  p.play ? play(p) : p.video ? watch(p) : details(p);
});

/* ---------- motion: intro, scroll reveals, nav ---------- */
// wrap each word in a mask so it can rise into view
function split(el) {
  [...el.childNodes].forEach(n => {
    if (n.nodeType !== 3) return split(n);
    const frag = document.createDocumentFragment();
    n.textContent.split(/(\s+)/).forEach(part => {
      if (!part) return;
      if (/^\s+$/.test(part)) return frag.append(" ");
      const w = document.createElement("span"), i = document.createElement("span");
      w.className = "w"; i.textContent = part; w.append(i); frag.append(w);
    });
    n.replaceWith(frag);
  });
}

if (motion) {
  $$("[data-split]").forEach(split);
  window.__intro = G.timeline({ defaults: { ease: "elastic.out(1, .75)", duration: 1.6 } })
    .from(".nav", { yPercent: -180, duration: 1.3 })
    .from(".hero-meta > *", { y: 14, opacity: 0, stagger: .08, duration: .8, ease: "power3.out" }, "<.1")
    .from(".hero-title .w > span", { yPercent: 120, rotate: 7, transformOrigin: "0% 100%", stagger: .07 }, "<.05")
    .from(".hero-foot > *, .facts li", { y: 34, opacity: 0, stagger: .07, duration: 1.2, ease: "back.out(1.6)" }, "<.55");

  // Scroll reveals. IntersectionObserver (not a once-ScrollTrigger) so nothing can be skipped: after a deep link or
  // a jump, content you scroll back to still springs in when it actually enters the viewport.
  const reveal = $$(".sec-head, .card, .timeline li, .skills > div, .contact > *").filter(el => el.getBoundingClientRect().top > innerHeight * .9);
  if (reveal.length && "IntersectionObserver" in window) {
    G.set(reveal, { y: 56, opacity: 0 });
    const io = new IntersectionObserver(entries => {
      const els = entries.filter(e => e.isIntersecting).map(e => e.target);
      if (!els.length) return;
      els.forEach(el => io.unobserve(el));
      G.to(els, { y: 0, opacity: 1, stagger: .08, duration: 1.3, ease: "elastic.out(1, .8)", overwrite: "auto" });
    }, { rootMargin: "0px 0px -8% 0px" });
    reveal.forEach(el => io.observe(el));
    window.__revealIO = io;
  }

  if (ST) {
    // web fonts change line wraps, so re-measure trigger positions once they are in
    if (document.fonts) document.fonts.ready.then(() => ST.refresh());
    G.to(".hero-title", { yPercent: -16, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
    G.fromTo(".tl-line", { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: ".tl", start: "top 75%", end: "bottom 65%", scrub: .6 } });

    // hide the nav while scrolling down, spring it back on scroll up
    let navHidden = false;
    ST.create({ start: 0, end: "max", onUpdate: s => {
      const hide = s.direction === 1 && s.scroll() > 400;
      if (hide === navHidden) return;
      navHidden = hide;
      G.to(".nav", hide ? { yPercent: -180, duration: .45, ease: "power3.in", overwrite: "auto" } : { yPercent: 0, duration: 1.1, ease: "elastic.out(1, .7)", overwrite: "auto" });
    } });
  }
}
document.documentElement.classList.remove("preload"); // intro states are set: safe to show the hero

/* ---------- ambient motion, kept off the per-frame path ---------- */
// Film grain jumps 6x a second from a timer (a CSS steps() animation still costs a style update on every display frame).
if (!reduce) {
  const grain = $(".grain"), spots = [[-3, 2], [2, -4], [-1, 3], [4, 1], [0, 0]];
  let i = 0;
  setInterval(() => {
    if (document.hidden || document.documentElement.classList.contains("lite")) return;
    const [x, y] = spots[i++ % spots.length];
    grain.style.transform = `translate(${x}%, ${y}%)`;
  }, 167);
}
// The availability ping pauses whenever the hero is off screen.
if ("IntersectionObserver" in window)
  new IntersectionObserver(([e]) => document.documentElement.classList.toggle("hero-off", !e.isIntersecting)).observe($(".hero"));

/* ---------- contact form → serverless API (falls back to email) ---------- */
const API = (window.PORTFOLIO_API || "").replace(/\/$/, "");
if (API) fetch(API + "/api/health").catch(() => {}); // wake the free instance early
$("#contact-form").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.target, st = $("#form-status"), btn = f.querySelector("button");
  const data = Object.fromEntries(new FormData(f));
  if (!API) {
    location.href = `mailto:mazenashraframzy@gmail.com?subject=${encodeURIComponent("Portfolio: " + data.name)}&body=${encodeURIComponent(data.message + "\n\n" + data.email)}`;
    return;
  }
  btn.disabled = true; st.textContent = "Sending…";
  const slow = setTimeout(() => st.textContent = "Still sending. The server is waking up, which can take up to a minute…", 4000);
  const ctl = new AbortController(), cap = setTimeout(() => ctl.abort(), 60000);
  try {
    const r = await fetch(API + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data), signal: ctl.signal });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || `server error ${r.status}`);
    st.textContent = "Thanks! Your message is in. I'll get back to you soon."; f.reset();
    if (motion) G.fromTo(st, { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: .9, ease: "elastic.out(1, .6)" });
  } catch (err) {
    const why = err.name === "AbortError" ? "the server took too long" : err.name === "TypeError" ? "network error" : err.message;
    st.innerHTML = `Couldn't send (${esc(why)}). Please email <a href="mailto:mazenashraframzy@gmail.com">mazenashraframzy@gmail.com</a>.`;
  } finally { clearTimeout(slow); clearTimeout(cap); btn.disabled = false; }
});

/* ---------- background: WebGL aurora curtains ---------- */
// GPU setup (context, shader compile, first draw) waits until the hero intro has finished, so it can never stutter
// the intro; the canvas then fades in. Without WebGL the CSS gradient on <body> stays.
// Exposes window.aurora.pause(bool) for the modal.
(() => {
  const c = $("#bg");
  let gl;
  const fs = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 r; uniform float t; uniform vec2 m; uniform float dim;
float h(vec2 p){p=fract(p*vec2(.1031,.1030));p+=dot(p,p.yx+33.33);return fract((p.x+p.y)*p.x);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+7.1;a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r; float asp=r.x/r.y, x=uv.x*asp;
  vec3 col=mix(vec3(.010,.016,.034),vec3(.016,.03,.06),uv.y);
  vec3 sky=vec3(0.);
  for(int i=0;i<3;i++){
    float fi=float(i);
    float sx=x*(.9+fi*.35)+m.x*(.12+fi*.06)+t*.015*(fi+1.);
    float base=.40+fi*.14+.15*sin(sx*1.7+t*.07+fi*2.1)+.22*(fbm(vec2(sx*1.2,t*.04+fi*5.))-.5)+m.y*.04;
    float d=uv.y-base;
    float rays=fbm(vec2(sx*14.,t*.12+fi*3.)); rays=.3+1.4*rays*rays;
    float body=smoothstep(-.015,.02,d)*exp(-max(d,0.)*(2.6+fi*1.4));
    float edge=exp(-abs(d)*55.)*.5;
    vec3 c=fi<.5?vec3(.30,1.,.62):fi<1.5?vec3(.22,.82,.92):vec3(.58,.48,1.);
    sky+=c*(body*rays+edge)*(.34-fi*.07)*(.75+.25*sin(sx*3.-t*.6+fi));
  }
  sky+=vec3(1.,.42,.24)*.09*exp(-length((uv-vec2(.95,-.1))*vec2(asp*.9,2.2))*2.2);
  col+=sky*(1.-.45*dim);
  col*=1.-.45*pow(length(uv-vec2(.5,.6)),1.5);
  gl_FragColor=vec4(col,1.);
}`;
  const hero = $(".hero");
  const OPTS = { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: "low-power", preserveDrawingBuffer: false };
  const STEPS = [.5, .34, .25]; // internal resolution steps (the aurora is soft, so these stay visually close)
  let pr, uR, uT, uM, uD, ready = false, raf = 0, paused = false, soft = false, still = reduce, scale = STEPS[0];
  // The aurora drifts slowly, so it is rendered at a capped rate whatever the display refresh (144 Hz screens were
  // drawing it 144x a second): 30 fps on the hero, 20 fps once it is dimmed behind content.
  const FPS_HERO = 30, FPS_DIM = 20;
  let ema = 16, samples = 0, last = 0, lastDraw = 0, heroH = 1, mx = 0, my = 0, tx = 0, ty = 0;
  const t0 = performance.now() - 20000;

  const size = () => {
    heroH = hero.offsetHeight || innerHeight;
    const w = Math.ceil(c.clientWidth * scale), h = Math.ceil(c.clientHeight * scale);
    if (w === c.width && h === c.height) return false; // mobile URL-bar resizes: nothing to do (canvas is 100lvh)
    c.width = w; c.height = h; gl.viewport(0, 0, w, h);
    return true;
  };
  const draw = now => {
    // frame-rate independent pointer easing (same feel at 20, 30 or 60 draws a second)
    const k = 1 - Math.pow(.96, Math.min(10, (now - lastDraw) / 16.7 || 1));
    lastDraw = now;
    mx += (tx - mx) * k; my += (ty - my) * k;
    gl.uniform2f(uR, c.width, c.height); gl.uniform1f(uT, (now - t0) / 1000); gl.uniform2f(uM, mx, my);
    gl.uniform1f(uD, Math.min(1, Math.max(0, scrollY / heroH)));
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  const lite = () => document.documentElement.classList.add("lite");
  const loop = now => {
    raf = requestAnimationFrame(loop);
    const dt = now - last; last = now;
    // Adaptive quality. Gaps over 1 s mean the tab was in the background, which says nothing about speed.
    // Sustained frames slower than 25 fps: step the resolution down; still slow at the lowest step: hold a still frame.
    if (dt > 0 && dt < 1000) {
      ema += (dt - ema) * .1;
      if (++samples > 40 && ema > 40) {
        samples = 0; ema = 16;
        const i = STEPS.indexOf(scale);
        if (i < STEPS.length - 1) { scale = STEPS[i + 1]; size(); }
        else { still = true; lite(); stop(); return; }
      }
    }
    if (now - lastDraw < 1000 / (scrollY > heroH ? FPS_DIM : FPS_HERO) - 2) return; // frame cap
    draw(now);
  };
  const start = () => { if (ready && !paused && !still && !raf) { last = performance.now(); samples = 0; raf = requestAnimationFrame(loop); } };

  // Software WebGL (no GPU: VMs, remote desktop, blocklisted drivers) runs the shader on the CPU and stalls the
  // whole page. There the aurora is drawn once, small, and kept as a still image.
  const isSoftware = () => {
    const probe = document.createElement("canvas").getContext("webgl", { failIfMajorPerformanceCaveat: true });
    if (!probe) return true;
    probe.getExtension("WEBGL_lose_context")?.loseContext();
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    return !!dbg && /swiftshader|basic render|llvmpipe|softpipe|software/i.test(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
  };

  const init = () => {
    if (!gl) {
      gl = c.getContext("webgl", OPTS);
      if (!gl) { lite(); return c.remove(); } // the CSS gradient on <body> takes over
      soft = isSoftware();
      if (soft) { still = true; scale = STEPS[STEPS.length - 1]; lite(); }
    }
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}"));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(pr);
    const par = gl.getExtension("KHR_parallel_shader_compile");
    const finish = () => {
      if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return c.remove();
      gl.useProgram(pr);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      [uR, uT, uM, uD] = ["r", "t", "m", "dim"].map(u => gl.getUniformLocation(pr, u));
      ready = true; size(); draw(performance.now());
      c.classList.add("on"); // CSS fade-in
      start();
    };
    // with the extension, poll for completion instead of blocking the main thread on link
    const poll = () => par && !gl.getProgramParameter(pr, par.COMPLETION_STATUS_KHR) ? requestAnimationFrame(poll) : finish();
    poll();
  };

  addEventListener("resize", () => { if (ready && size() && (still || paused)) draw(performance.now()); });
  // reduced motion on a real GPU: redraw the still frame as the dimming changes (rAF-throttled)
  let pend = 0;
  addEventListener("scroll", () => { if (ready && reduce && !soft && !pend) pend = requestAnimationFrame(() => { pend = 0; draw(performance.now()); }); }, { passive: true });
  addEventListener("pointermove", e => { tx = e.clientX / innerWidth - .5; ty = .5 - e.clientY / innerHeight; }, { passive: true });
  c.addEventListener("webglcontextlost", e => { e.preventDefault(); stop(); ready = false; });
  c.addEventListener("webglcontextrestored", init);

  window.aurora = { pause(p) { paused = p; p ? stop() : start(); } };
  let kicked = false;
  const kick = () => { if (kicked) return; kicked = true; window.requestIdleCallback ? requestIdleCallback(init, { timeout: 500 }) : setTimeout(init, 50); };
  const afterLoad = () => document.readyState === "complete" ? kick() : addEventListener("load", kick, { once: true });
  const intro = window.__intro;
  if (intro && intro.progress() < 1) { intro.eventCallback("onComplete", afterLoad); setTimeout(afterLoad, 4000); } // + failsafe
  else afterLoad();
})();
