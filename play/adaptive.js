/* Adaptive resolution for the Unity WebGL builds.
   Unity renders the canvas at CSS size x devicePixelRatio. On a phone (DPR 3) or a 4K screen that is 4-9x the pixels
   of a normal monitor, which is what made the builds lag. This picks a sensible starting density, then watches the
   real frame rate and lowers or raises the render resolution live (Unity reads Module.devicePixelRatio every frame).
     devicePixelRatio: UnityAdaptive.start(),     <- in the createUnityInstance config
     .then(function (u) { UnityAdaptive.watch(u); })                                                              */
(function () {
  var touch = matchMedia("(pointer: coarse)").matches, dpr = window.devicePixelRatio || 1;
  var MAX = Math.min(dpr, touch ? 1.5 : 2), MIN = 0.5, BUDGET = touch ? 1.6e6 : 2.6e6;   // max rendered pixels to start from
  var d;
  function fit(v) { var px = innerWidth * innerHeight; return Math.max(MIN, Math.min(MAX, v, Math.sqrt(BUDGET / px))); }
  function start() { d = fit(touch ? 1 : 1.25); return d; }
  function watch(u) {
    if (!u || !u.Module) return;
    var frames = 0, t0 = performance.now(), good = 0, warm = t0 + 5000;
    function set(v) { d = Math.round(fit(v) * 100) / 100; u.Module.devicePixelRatio = d; }
    set(d || start());
    addEventListener("resize", function () { set(d); });
    (function tick(now) {
      requestAnimationFrame(tick); frames++;
      if (document.hidden) { frames = 0; t0 = now; return; }
      if (now - t0 < 2000) return;
      var fps = frames * 1000 / (now - t0); frames = 0; t0 = now;
      if (now < warm) return;                                   // ignore the first seconds (shader warm-up, loading)
      if (fps < 40 && d > MIN) { set(d * 0.82); good = 0; }     // struggling: drop resolution
      else if (fps > 56 && d < MAX && ++good >= 3) { set(d * 1.1); good = 0; }   // smooth for 6 s: try a little sharper
    })(performance.now());
  }
  window.UnityAdaptive = { start: start, watch: watch };
})();
