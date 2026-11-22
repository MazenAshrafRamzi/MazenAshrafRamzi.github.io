/* THE LURE: the calm Aurora portfolio admits it is the boring one.
   Once the bait has settled (15 s on the page and 4 s reading Selected work, or 30 s idle), or at once on any section
   link, the page glitches and a window rises.
   Two gold raven eyes watch you through a slit in it: they follow your cursor or finger, blink, dart about when you
   stop, stare at "Yes" with wide pupils when you go near it, and narrow when you leave the window.
   "Yes" opens the dark, sends a raven across and takes you to the real portfolio (Blackwing).
   There is no way to stay: "Stay blind" flees from the cursor, a tap or the keyboard, and taunts you. It shows on every
   visit. Aurora is only ever the bait: there is no way to stay on it and browse it, not even by coming back.
   Self-contained: styles are injected here. */
(() => {
  // CV project links: ?work=<project id> always shows the popup (quickly, naming the project) and leads straight to it.
  const wid = new URLSearchParams(location.search).get("work");
  const WORK = wid && typeof PROJECTS !== "undefined" ? PROJECTS.find(p => p.id === wid) : null;
  // where "Yes" leads: the linked project, else the top of Blackwing (Odin first, whichever section they tried)
  const SECTION_TO = { top: 1, work: 1, experience: 1, skills: 1, contact: 1 };
  const DEST = WORK ? "blackwing/?work=" + encodeURIComponent(WORK.id) : "blackwing/";
  // back from Blackwing via the browser's back/forward cache: start over, so the bait works again
  addEventListener("pageshow", e => { if (e.persisted) location.reload(); });
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const t0 = performance.now();
  let shown = false;

  const css = `
  .lure-veil { position: fixed; inset: 0; z-index: 90; display: grid; place-items: end center; padding: 16px 16px max(16px, 6vh);
    background: radial-gradient(120% 90% at 50% 100%, rgba(3,5,10,.55), rgba(3,5,10,.82)); opacity: 0; transition: opacity .45s; }
  .lure-veil.on { opacity: 1; }
  .lure { position: relative; width: min(440px, 100%); border-radius: 22px; padding: 22px 22px 20px; color: #e7f2ec; font: 15px/1.55 Geist, Arial, sans-serif;
    background: linear-gradient(180deg, rgba(20,30,46,.86), rgba(10,16,27,.92)); border: 1px solid rgba(190,235,220,.18);
    box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 1px rgba(165,148,255,.08) inset; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
    transform: translateY(40px) scale(.96); opacity: 0; transition: transform .7s cubic-bezier(.16,1,.3,1), opacity .4s; }
  .lure-veil.on .lure { transform: none; opacity: 1; }
  .lure-kick { font: 500 11px "Geist Mono", ui-monospace, monospace; letter-spacing: .14em; text-transform: uppercase; color: #8e9ea6; display: flex; align-items: center; gap: 8px; }
  .lure-kick i { width: 7px; height: 7px; border-radius: 50%; background: #ff6b3d; box-shadow: 0 0 10px #ff6b3d; animation: lureRec 1.2s steps(2) infinite; }
  @keyframes lureRec { 50% { opacity: .25; } }
  .lure-slit { position: relative; height: 92px; margin: 14px 0 16px; border-radius: 14px; overflow: hidden;
    background: radial-gradient(60% 120% at 50% 50%, #120d07 0%, #050508 70%); border: 1px solid rgba(201,164,92,.22); box-shadow: inset 0 0 30px #000; }
  .lure-slit::after { content: ""; position: absolute; inset: 0; background: repeating-linear-gradient(0deg, rgba(255,255,255,.025) 0 1px, transparent 1px 3px); pointer-events: none; }
  .lure-eyes { position: absolute; inset: 0; display: flex; justify-content: center; align-items: center; gap: 34px; }
  .lure-eye { width: 96px; height: 52px; overflow: visible; filter: drop-shadow(0 0 10px rgba(227,168,60,.35)); }
  .lure h3 { margin: 0 0 6px; font: 400 clamp(26px, 6vw, 34px)/1.1 "Instrument Serif", "Times New Roman", "Noto Sans Runic", "Segoe UI Historic", serif; min-height: 2.2em; }
  .lure h3 .caret { display: inline-block; width: .5ch; border-bottom: 2px solid #ff6b3d; animation: lureRec 1s steps(2) infinite; }
  .lure p { margin: 0 0 18px; color: #a9b7bd; min-height: 3.1em; }
  .lure-acts { display: flex; align-items: center; height: 54px; position: relative; flex-wrap: nowrap; }   /* fixed height: nothing reflows when "Stay blind" runs */
  .lure-yes { all: unset; cursor: pointer; padding: 12px 20px; border-radius: 999px; font: 600 14px Geist, Arial, sans-serif; color: #120b02;
    background: linear-gradient(180deg, #f2cf86, #c9a45c); box-shadow: 0 0 0 0 rgba(242,207,134,.5); animation: lurePulse 2.2s infinite; }
  .lure-yes:hover, .lure-yes:focus-visible { filter: brightness(1.08); outline: 2px solid #f2cf86; outline-offset: 3px; }
  @keyframes lurePulse { 70% { box-shadow: 0 0 0 14px rgba(242,207,134,0); } 100% { box-shadow: 0 0 0 0 rgba(242,207,134,0); } }
  .lure-no { all: unset; position: absolute; top: 50%; right: 0; max-width: 46%; cursor: pointer; text-align: center; line-height: 1.3; font: 500 12px/1.3 "Geist Mono", ui-monospace, monospace; color: #6f7f87; padding: 6px 4px;
    transform: translateY(-50%); transition: left .38s cubic-bezier(.3,1.5,.5,1), transform .38s cubic-bezier(.3,1.5,.5,1), color .2s; }
  .lure-no:hover, .lure-no:focus-visible { color: #b9c6cc; }
  .lure-glitch { animation: lureGlitch .42s steps(2) 1; }
  @keyframes lureGlitch { 0% { filter: none; transform: none; } 20% { filter: hue-rotate(70deg) saturate(1.6); transform: translateX(-6px) skewX(4deg); }
    40% { filter: invert(.15) hue-rotate(-50deg); transform: translateX(5px); } 60% { filter: contrast(1.6) brightness(.7); transform: translateY(2px) skewX(-3deg); }
    80% { filter: hue-rotate(160deg); transform: translateX(-2px); } 100% { filter: none; transform: none; } }
  .lure-dark { position: fixed; inset: 0; z-index: 95; pointer-events: none; background: #000; clip-path: circle(0 at var(--x,50%) var(--y,50%)); transition: clip-path 1.05s cubic-bezier(.7,0,.3,1); }
  .lure-dark.on { clip-path: circle(150% at var(--x,50%) var(--y,50%)); }
  .lure-flyer { position: fixed; z-index: 96; left: 0; top: 0; width: 220px; height: 220px; pointer-events: none;
    background: url(blackwing/crow-fly.webp) 0 0 / 1200% 100% no-repeat; animation: lureFlap .44s steps(12, jump-none) infinite; }
  @keyframes lureFlap { to { background-position: 100% 0; } }
  .lure-gold { position: fixed; z-index: 97; left: 50%; top: 50%; width: 10px; height: 10px; margin: -5px; border-radius: 50%; pointer-events: none; opacity: 0;
    background: #fff4cf; box-shadow: 0 0 20px 6px #ffcf73, 0 0 80px 30px #e3a83c88; transition: opacity .4s, transform 1.1s cubic-bezier(.2,.9,.25,1); }
  @media (max-width: 480px) { .lure-eyes { gap: 22px; } .lure-eye { width: 80px; height: 44px; } }
  `;

  // one eye: almond lid (clip), gold iris with fibres, pupil, glint. Returns handles to move the iris and blink.
  const SVGNS = "http://www.w3.org/2000/svg";
  function eye(id) {
    const fib = Array.from({ length: 28 }, (_, i) => { const a = i / 28 * Math.PI * 2; return `M${(Math.cos(a) * 6).toFixed(1)},${(Math.sin(a) * 6).toFixed(1)}L${(Math.cos(a) * 15).toFixed(1)},${(Math.sin(a) * 15).toFixed(1)}`; }).join("");
    const box = document.createElement("div"); box.innerHTML = `
      <svg class="lure-eye" viewBox="-48 -26 96 52" aria-hidden="true">
        <defs>
          <clipPath id="lid${id}"><path class="lid" d="M-44,0 C-28,-24 28,-24 44,0 C28,24 -28,24 -44,0Z"/></clipPath>
          <radialGradient id="ir${id}"><stop offset="0" stop-color="#fff2c4"/><stop offset=".35" stop-color="#f2c45c"/><stop offset=".75" stop-color="#b9731d"/><stop offset="1" stop-color="#3a1f07"/></radialGradient>
        </defs>
        <g clip-path="url(#lid${id})">
          <rect x="-48" y="-26" width="96" height="52" fill="#0d0a08"/>
          <g class="iris"><circle r="17" fill="url(#ir${id})"/><path d="${fib}" stroke="#5a3208" stroke-opacity=".45" stroke-width=".8"/>
            <circle class="pupil" r="6.5" fill="#050302"/><circle cx="-5" cy="-6" r="2.4" fill="#fff" fill-opacity=".85"/></g>
          <path d="M-44,0 C-28,-24 28,-24 44,0" fill="none" stroke="#000" stroke-opacity=".6" stroke-width="7"/>
        </g>
        <path class="rim" d="M-44,0 C-28,-24 28,-24 44,0 C28,24 -28,24 -44,0Z" fill="none" stroke="#c9a45c" stroke-opacity=".55" stroke-width="1.2"/>
      </svg>`;
    const svg = box.firstElementChild;
    return { svg, iris: svg.querySelector(".iris"), pupil: svg.querySelector(".pupil"), lid: svg.querySelector(".lid") };
  }

  function show(sec) {
    if (shown) return; shown = true;
    if (document.querySelector(".modal:not([hidden])")) { shown = false; setTimeout(() => show(sec), 4000); return; }   // not while a build is open
    const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    // the runes need a font that has them (not every phone does): a tiny subset of Noto Sans Runic, just these 24 letters
    const fl = document.createElement("link"); fl.rel = "stylesheet"; fl.href = "https://fonts.googleapis.com/css2?family=Noto+Sans+Runic&display=swap&text=" + encodeURIComponent("ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ"); document.head.appendChild(fl);
    const secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
    const veil = document.createElement("div"); veil.className = "lure-veil";
    veil.innerHTML = `
      <div class="lure" role="dialog" aria-modal="true" aria-labelledby="lure-t" aria-describedby="lure-d">
        <div class="lure-kick"><i></i>${WORK ? "Huginn returns with a deed" : "Mímir’s well stirs · watched for " + secs + " s"}</div>
        <div class="lure-slit"><div class="lure-eyes"></div></div>
        <h3 id="lure-t"><span class="txt"></span><span class="caret"></span></h3>
        <p id="lure-d"></p>
        <div class="lure-acts"><button class="lure-yes" type="button">Drink from the well</button><button class="lure-no" type="button" aria-label="Stay blind (it will not let you)">Stay blind</button></div>
      </div>`;
    const eyes = [eye("A"), eye("B")]; const row = veil.querySelector(".lure-eyes"); eyes.forEach(e => row.appendChild(e.svg));
    document.body.classList.add("lure-glitch"); setTimeout(() => document.body.classList.remove("lure-glitch"), 450);
    document.body.appendChild(veil); document.documentElement.style.overflow = "hidden"; document.body.style.overflow = "hidden";   // the bait page behind can no longer be scrolled
    requestAnimationFrame(() => requestAnimationFrame(() => veil.classList.add("on")));
    const yes = veil.querySelector(".lure-yes"), no = veil.querySelector(".lure-no"), win = veil.querySelector(".lure");

    // typed lines
    const name = WORK ? WORK.title.split(/[:(]/)[0].trim() : "";
    const L1 = WORK ? "Would you trade an eye to see " + name + "?" : "Would you trade an eye for the truth?";
    const L2 = WORK ? "Huginn found it beyond the surface, in the portfolio mortals are not shown. Odin gave an eye to Mímir’s well for wisdom. You need only say yes."
      : "This is only the surface, the tidy portfolio mortals are shown. Odin hung nine nights on Yggdrasil to win the runes and gave an eye to Mímir’s well for wisdom. You need only say yes.";
    const FUTH = "ᚠᚢᚦᚨᚱᚲᚷᚹᚺᚾᛁᛃᛇᛈᛉᛊᛏᛒᛖᛗᛚᛜᛞᛟ", rune = c => c === " " ? " " : FUTH[(c.charCodeAt(0) * 7) % FUTH.length];
    const txt = veil.querySelector(".txt"), sub = veil.querySelector("#lure-d");
    if (reduce) { txt.textContent = L1; sub.textContent = L2; }
    else { let i = 0; txt.textContent = [...L1].map(rune).join("");   // the question arrives in runes, then is read letter by letter
      const type = () => { i++; txt.textContent = L1.slice(0, i) + [...L1.slice(i)].map(rune).join(""); if (i < L1.length) setTimeout(type, 38 + Math.random() * 46); else setTimeout(() => typeSub(0), 250); };
      const typeSub = j => { sub.textContent = L2.slice(0, j); if (j < L2.length) setTimeout(() => typeSub(j + 2), 16); }; setTimeout(type, 500); }
    setTimeout(() => yes.focus({ preventScroll: true }), 700);

    // the eyes: follow pointer/finger, lock on Yes, wander when idle, blink, narrow when you leave
    let px = innerWidth / 2, py = innerHeight * .2, lastMove = performance.now(), inside = true, nearYes = 0, raf = 0, nextBlink = performance.now() + 1500, blinkT = -1, wander = null, nextWander = 0;
    const look = [{ x: 0, y: 0, d: 1 }, { x: 0, y: 0, d: 1 }];
    const onMove = (x, y) => { px = x; py = y; lastMove = performance.now(); inside = true; wander = null; };
    const pm = e => onMove(e.clientX, e.clientY), tm = e => { const t = e.touches[0]; if (t) onMove(t.clientX, t.clientY); };
    addEventListener("pointermove", pm, { passive: true }); addEventListener("pointerdown", pm, { passive: true });
    addEventListener("touchstart", tm, { passive: true }); addEventListener("touchmove", tm, { passive: true });
    const leave = e => { if (!e.relatedTarget) inside = false; }; document.addEventListener("mouseout", leave);
    function frame(now) {
      raf = requestAnimationFrame(frame);
      const yr = yes.getBoundingClientRect(), yx = yr.left + yr.width / 2, yy = yr.top + yr.height / 2;
      const dYes = Math.hypot(px - yx, py - yy); nearYes += ((dYes < 140 && inside ? 1 : 0) - nearYes) * .12;
      let tx = px, ty = py;
      if (now - lastMove > 2600) { if (!wander || now > nextWander) { wander = [Math.random() * innerWidth, Math.random() * innerHeight]; nextWander = now + 700 + Math.random() * 1600; } [tx, ty] = wander; }
      if (nearYes > .5) { tx = yx; ty = yy; }
      eyes.forEach((e, i) => {
        const r = e.svg.getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = tx - cx, dy = ty - cy, a = Math.atan2(dy, dx), k = Math.min(1, Math.hypot(dx, dy) / 220);
        const L = look[i], gx = Math.cos(a) * 20 * k, gy = Math.sin(a) * 7 * k;
        L.x += (gx - L.x) * .22; L.y += (gy - L.y) * .22;
        const dil = 1 + nearYes * (i === 1 ? .8 : .3) - (inside ? 0 : .35); L.d += (dil - L.d) * .15;
        e.iris.setAttribute("transform", `translate(${L.x.toFixed(2)},${L.y.toFixed(2)})`); e.pupil.setAttribute("r", (6.5 * L.d).toFixed(2));
      });
      // blink (both together, sometimes a double blink); squint while you are away
      if (now > nextBlink && blinkT < 0) { blinkT = now; nextBlink = now + 2200 + Math.random() * 3800 + (Math.random() < .25 ? -1900 : 0); }
      let open = inside ? 1 : .45;
      if (blinkT >= 0) { const p = (now - blinkT) / 170; if (p >= 1) blinkT = -1; else open *= Math.abs(Math.cos(p * Math.PI)); }
      // near "Drink from the well" one eye closes, Odin’s bargain, and the other burns brighter
      eyes.forEach((e, i) => { const o = i === 0 ? open * (1 - nearYes * .97) : open; e.lid.setAttribute("transform", `scale(1,${Math.max(.03, o).toFixed(3)})`);
        if (i === 1) e.svg.style.filter = `drop-shadow(0 0 ${(10 + nearYes * 16).toFixed(1)}px rgba(255,190,80,${(.35 + nearYes * .45).toFixed(2)}))`; });
    }
    raf = requestAnimationFrame(frame);
    const cleanup = () => { cancelAnimationFrame(raf); removeEventListener("pointermove", pm); removeEventListener("pointerdown", pm);
      removeEventListener("touchstart", tm); removeEventListener("touchmove", tm); document.removeEventListener("mouseout", leave); removeEventListener("keydown", key); removeEventListener("pointermove", near); };

    // "Stay blind" can never be pressed: it flees from the cursor, from a tap and from keyboard focus, and taunts you.
    const taunts = ["The ravens disagree.", "Huginn saw that.", "There is no going back.", "Muninn remembers you tried.", "Even Loki would say yes.", "The well is patient.", "Odin gave an eye. You won’t even give a click?"];
    let flees = 0, lastFlee = 0;
    // it only ever moves inside its own lane, right of the Yes button: absolutely positioned, so its new text never reflows the window
    const acts = veil.querySelector(".lure-acts");
    const flee = () => { const now = performance.now(); if (now - lastFlee < 180) return; lastFlee = now;
      no.textContent = taunts[flees++ % taunts.length];
      const lane0 = yes.offsetLeft + yes.offsetWidth + 12, w = no.offsetWidth, lane1 = Math.max(lane0, acts.clientWidth - w);
      const cur = no.offsetLeft, far = (cur - lane0) > (lane1 - cur) ? lane0 : lane1;   // jump towards the far end of the lane
      const x = far + (Math.random() - .5) * Math.min(40, (lane1 - lane0) * .3);
      no.style.right = "auto"; no.style.left = Math.max(lane0, Math.min(lane1, x)).toFixed(0) + "px";
      no.style.transform = `translateY(calc(-50% + ${(Math.random() * 12 - 6).toFixed(0)}px)) rotate(${(Math.random() * 14 - 7).toFixed(1)}deg)`; };
    no.addEventListener("pointerenter", flee); no.addEventListener("pointerdown", e => { e.preventDefault(); flee(); });
    no.addEventListener("click", e => { e.preventDefault(); flee(); }); no.addEventListener("focus", () => { flee(); yes.focus({ preventScroll: true }); });
    const near = e => { const r = no.getBoundingClientRect(); if (Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2)) < Math.max(70, r.width * .6)) flee(); };
    addEventListener("pointermove", near, { passive: true });
    const key = e => { if (e.key === "Escape") { e.preventDefault(); flee(); }
      if (e.key === "Tab") { e.preventDefault(); yes.focus({ preventScroll: true }); } };   // focus stays in the window: nothing behind it is reachable
    addEventListener("keydown", key);

    // "Yes": darkness opens from the eyes, a raven crosses, then the real portfolio
    yes.addEventListener("click", () => {
      cleanup();
      const r = veil.querySelector(".lure-slit").getBoundingClientRect(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      if (reduce) { location.href = DEST; return; }
      eyes.forEach(e => { e.iris.setAttribute("transform", "translate(0,0)"); e.pupil.setAttribute("r", "3"); e.lid.setAttribute("transform", "scale(1,1)"); });
      const dark = document.createElement("div"); dark.className = "lure-dark"; dark.style.setProperty("--x", cx + "px"); dark.style.setProperty("--y", cy + "px");
      document.body.appendChild(dark); requestAnimationFrame(() => requestAnimationFrame(() => dark.classList.add("on")));
      veil.style.transition = "opacity .9s .25s"; veil.style.opacity = "0";
      const gold = document.createElement("i"); gold.className = "lure-gold"; document.body.appendChild(gold);
      gold.style.left = cx + "px"; gold.style.top = cy + "px";
      setTimeout(() => { gold.style.opacity = "1"; gold.style.transform = "scale(2.4)"; }, 650);
      setTimeout(() => {   // the raven crosses the dark, through the eye
        const f = document.createElement("i"); f.className = "lure-flyer"; document.body.appendChild(f);
        const s = Math.min(1.4, innerWidth / 700), y0 = cy - 160;
        f.animate([{ transform: `translate(-260px, ${y0 + 120}px) scale(${s * .6})` }, { transform: `translate(${cx - 110}px, ${cy - 110}px) scale(${s})`, offset: .55 },
          { transform: `translate(${innerWidth + 60}px, ${y0 - 120}px) scale(${s * .7})` }], { duration: 1100, easing: "cubic-bezier(.4,0,.6,1)", fill: "forwards" });
      }, 700);
      setTimeout(() => { location.href = DEST; }, 1750);
    });
  }

  // Triggers. A CV project link: right away. A section link (click, or opened in a new tab with its #hash): at once.
  // Otherwise the bait settles first: the popup waits until the visitor has been on the page 15 s AND has been looking
  // at the first project card for 4 s (they believe it is a normal portfolio and have started reading the work), or
  // 30 s if they never scroll. Only time with the tab visible counts.
  if (WORK) { setTimeout(show, 1500); return; }
  const hashSec = location.hash.slice(1);
  if (hashSec in SECTION_TO) { setTimeout(() => show(hashSec), 700); return; }
  document.addEventListener("click", ev => {
    const a = ev.target.closest('a[href^="#"]');
    if (!a || ev.button !== 0 || ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.altKey) return;   // modified clicks open a new tab, handled above
    ev.preventDefault(); ev.stopImmediatePropagation(); show(a.getAttribute("href").slice(1) || "top");
  }, true);
  const SETTLE = 15000, DWELL = 4000, IDLE = 30000, STEP = 250;
  let onPage = 0, onWork = 0, seenWork = false;
  // the section, not a card: main.js re-renders the cards (a watched card would be replaced and never fire)
  const work = document.getElementById("work");
  if (work && "IntersectionObserver" in window)
    // Selected work has risen into the upper 60% of the screen (any section or screen height)
    new IntersectionObserver(es => { if (es[0].isIntersecting) seenWork = true; }, { rootMargin: "0px 0px -40% 0px" }).observe(work);
  const tick = setInterval(() => {
    if (shown) return clearInterval(tick);
    if (document.hidden) return;
    onPage += STEP; if (seenWork) onWork += STEP;   // once they reach the work, the dwell keeps counting as they read on
    if (onPage >= IDLE || (onPage >= SETTLE && onWork >= DWELL)) { clearInterval(tick); show("work"); }
  }, STEP);
})();
