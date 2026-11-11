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
    blurb: "A 35-second launch film for a creative agency. A single lime-green dot opens every window, becomes LIME and signs the logo.",
    tools: ["Code-rendered animation", "JavaScript", "ffmpeg", "Sound design"],
    img: "media/limescents.jpg", video: "media/limescents.mp4", portrait: true,
    points: [
      "1080×1920 at 24 fps, cut to a 96 bpm track. Every transition lands on the beat.",
      "One protagonist: the brand's lime dot behaves like a cursor. It opens the first window, bursts into LIME, then opens each service window before everything folds back into the logo.",
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
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function mediaHTML(p) {
  if (p.poster === "museum") return `<div class="poster-museum"><div class="glyphs">𓂀 𓋹 𓆣</div><div class="wing"></div><b>VOICES OF STONE</b><small>RA · BASTET · ANUBIS</small></div>`;
  if (!p.img) return `<div class="poster-museum" style="background:linear-gradient(135deg, ${p.tint}33, #0b0b0d 70%)"><b style="font-family:var(--display);letter-spacing:-.02em;font-weight:800">${esc(p.title)}</b><small>${esc(p.kicker)}</small></div>`;
  const base = p.portrait ? `<img class="blur" src="${p.img}" alt=""><img class="fg" src="${p.img}" alt="${esc(p.title)}" loading="lazy">` : `<img src="${p.img}" alt="${esc(p.title)}" loading="lazy">`;
  const prev = p.video ? `<video class="preview" muted loop playsinline preload="none" data-src="${p.video}"></video>` : "";
  return base + prev;
}

function cardHTML(p) {
  const badge = p.play ? `<span class="badge live">▶ Playable</span>` : p.video ? `<span class="badge">▶ Video</span>` : "";
  const acts = [];
  if (p.play) acts.push(`<button class="btn primary" data-play="${p.id}">Play in browser</button>`);
  if (p.video) acts.push(`<button class="btn primary" data-watch="${p.id}">Watch</button>`);
  acts.push(`<button class="btn" data-details="${p.id}">Details</button>`);
  if (p.link) acts.push(`<a class="btn" href="${p.link}" target="_blank" rel="noopener">GitHub ↗</a>`);
  return `<article class="card reveal${p.wide ? " wide" : ""}" data-id="${p.id}" data-cats="${p.cats.join(" ")}" style="--tint:${p.tint}">
    <div class="media${p.portrait ? " portrait" : ""}" data-open="${p.id}">${badge}${mediaHTML(p)}</div>
    <div class="body"><span class="kicker">${esc(p.kicker)}</span><h3>${esc(p.title)}</h3><p>${esc(p.blurb)}</p>
    <div class="tools">${p.tools.map(t => `<span>${esc(t)}</span>`).join("")}</div>
    <div class="actions">${acts.join("")}</div></div></article>`;
}

$("#grid").innerHTML = PROJECTS.map(cardHTML).join("");
const byId = id => PROJECTS.find(p => p.id === id);

// filters
document.querySelectorAll(".chip").forEach(ch => ch.addEventListener("click", () => {
  document.querySelectorAll(".chip").forEach(c => c.classList.toggle("on", c === ch));
  const f = ch.dataset.f;
  document.querySelectorAll(".card").forEach(c => c.classList.toggle("hide", f !== "all" && !c.dataset.cats.split(" ").includes(f)));
}));

// hover video previews (desktop only)
if (matchMedia("(hover: hover)").matches) {
  document.querySelectorAll(".card").forEach(card => {
    const v = card.querySelector("video.preview");
    if (!v) return;
    card.addEventListener("mouseenter", () => { if (!v.src) v.src = v.dataset.src; v.currentTime = 0; v.play().then(() => card.classList.add("playing")).catch(() => {}); });
    card.addEventListener("mouseleave", () => { v.pause(); card.classList.remove("playing"); });
  });
}

// modal
const modal = $("#modal"), mBody = $("#modal-body"), mTitle = $("#modal-title");
function openModal(title, html) {
  mTitle.textContent = title; mBody.innerHTML = html; modal.hidden = false;
  document.body.style.overflow = "hidden";
  $("#modal-fs").hidden = !mBody.querySelector("iframe");
}
function closeModal() { modal.hidden = true; mBody.innerHTML = ""; document.body.style.overflow = ""; }
$("#modal-close").onclick = closeModal;
addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
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

// reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".reveal").forEach(el => io.observe(el));

// contact form → Neon via the Render API (falls back to email)
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
  try {
    const r = await fetch(API + "/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(j.error || "Request failed");
    st.textContent = "Thanks! Your message is in. I'll get back to you soon."; f.reset();
  } catch (err) {
    st.innerHTML = `Couldn't send (${esc(err.message)}). Please email <a href="mailto:mazenashraframzy@gmail.com">mazenashraframzy@gmail.com</a>.`;
  } finally { clearTimeout(slow); btn.disabled = false; }
});

// background: drifting dot field with mouse parallax
(() => {
  const c = $("#bg"), x = c.getContext("2d");
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let w, h, pts, mx = 0, my = 0;
  const size = () => { w = c.width = innerWidth * devicePixelRatio; h = c.height = innerHeight * devicePixelRatio;
    pts = Array.from({ length: Math.min(110, Math.floor(innerWidth / 12)) }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random() * .8 + .2, v: Math.random() * .25 + .05 })); };
  size(); addEventListener("resize", size);
  addEventListener("pointermove", e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; });
  (function tick() {
    x.clearRect(0, 0, w, h);
    for (const p of pts) {
      p.y -= p.v * p.z * devicePixelRatio; if (p.y < 0) { p.y = h; p.x = Math.random() * w; }
      const px = p.x + mx * 40 * p.z * devicePixelRatio, py = p.y + my * 40 * p.z * devicePixelRatio;
      x.fillStyle = p.z > .8 ? "rgba(255,90,31,.9)" : `rgba(243,240,234,${p.z * .5})`;
      x.beginPath(); x.arc(px, py, p.z * 1.6 * devicePixelRatio, 0, 7); x.fill();
    }
    requestAnimationFrame(tick);
  })();
})();
