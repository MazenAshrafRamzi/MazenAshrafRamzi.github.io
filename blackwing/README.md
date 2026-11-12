# Blackwing: raven-theme preview

Live preview: https://mazenashraframzi.github.io/blackwing/ (the main site at `/` is untouched).

It is fully separate: its own `index.html`, `blackwing.css` and `blackwing.js`. It shares the site's media, WebGL builds (`play/`), `config.js` (contact API) and project data. A `<base href="../">` tag in `index.html` points every relative link at the site root, so nothing is duplicated.

## Promote it to the main site
1. Copy `blackwing/index.html` over the root `index.html`, and change `<base href="../">` to `<base href="./">` (or delete the tag).
2. In that file, the paths `blackwing/blackwing.css`, `blackwing/blackwing.js` and `blackwing/projects.js` still work as they are. Links like `blackwing/#thought` can become `#thought`.
3. Keep `blackwing/` (or move its three files to the root and update the three paths).
4. Project data: `blackwing/projects.js` is a copy of `PROJECTS` from the root `main.js`. Once Blackwing is the main site, `projects.js` becomes the single source.

To undo, restore the old root `index.html` from git.

## What moves
- The eye-opening intro (once per browser session; any key or click skips it).
- The raven: about 80 feathers built in code. A single pose `{ fold, flap }` drives the unfurl and the idle flap. Its eyes and head follow the pointer, and it blinks.
- Huginn and Muninn circle the hero. A third raven glides down the Memory flight path as you scroll.
- The galaxy sky (nebula, stars, shooting stars) and drifting feathers that react to scroll speed share one 30 fps loop. It pauses while a demo or video is open.
- Card tilt with a feather-sheen spotlight, filter transitions, and a reveal for every section.
- "Send a raven": on a successful send, a raven carries the message off-screen.
- With `prefers-reduced-motion`, there is no intro and the raven holds still. If GSAP fails to load, all content still shows.
