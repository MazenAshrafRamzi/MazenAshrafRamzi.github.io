# Blackwing: raven-theme preview

Live preview: https://mazenashraframzi.github.io/blackwing/ (the main site at `/` is untouched).

It is fully separate: its own `index.html`, `blackwing.css`, `blackwing.js`, `raven3d.js` and `raven.glb`. It shares the site's media, WebGL builds (`play/`), `config.js` (contact API) and project data (`projects.js` is a copy of `PROJECTS` from the root `main.js`). A `<base href="../">` tag points every relative link at the site root.

## Promote it to the main site
1. Copy `blackwing/index.html` over the root `index.html`, and change `<base href="../">` to `<base href="./">`.
2. The `blackwing/…` asset paths keep working as they are. Links like `blackwing/#thought` can become `#thought`.
3. `blackwing/projects.js` then becomes the single source of project data.

To undo, restore the old root `index.html` from git.

## The journey: one day in Odin's hall
1. **Dawn at Hliðskjálf:** the All-Father's eye opens (once per visit; any key or click skips it). Huginn and Muninn sit on their perches. They are real 3D: a CC0 museum scan of a common raven ("Common raven", Virtual Museums of Małopolska, Sketchfab), rigged in Blender (Root > Body > Neck > Head, Tail; the branch is a separate Perch mesh). Their heads snap between gazes like real birds and follow you, and they blink, breathe and ruffle. As you scroll away, they take off.
2. **Yggdrasil:** the world-tree on the left is the navigation. Each world has its rune (ᚱ ᛗ ᛚ ᚲ ᚨ), and gold sap rises as you go down.
3. **Midgard, the deeds:** projects as runestones, each with its title in Elder Futhark. Headings arrive in runes and resolve into English.
4. **Mímir's Well, memory:** Odin's sacrificed eye watches from the water. Touch it and it ripples. Muninn glides down the timeline.
5. **Nidavellir, the forge:** skills heat up as embers rise.
6. **Dusk:** a shadowed Odin with one burning eye. The ravens fly back and land on his shoulders (the same 3D model, perch hidden) and whisper toward his ears, beside the "Send a raven" form. While you type, his eye flares.

## Performance
- One WebGL context serves both raven scenes. The canvas moves between the hero and Odin, renders only while on screen, is capped at 30 fps and pauses while a demo or video is open.
- The model is 28.5k triangles, Draco-compressed, with 1K and 512 textures (1.5 MB). The source files are `D:\Crow\blackwing_raven_split.blend`.
- The sky is painted once into an image and only moved with a GPU transform. One feather canvas runs at pixel ratio 1 and 30 fps. The well canvas draws only while visible. The embers are CSS, paused off screen.
- There is no backdrop-filter, no animated CSS filters and no full-screen canvas redrawing the sky. The 3D module loads async, so it never blocks the page.
- With `prefers-reduced-motion`, there is no intro, the ravens hold still and are already perched on Odin. If GSAP or WebGL fail to load, all content still shows.

## v4: 3D Odin and a 3D Mímir's Well
- **Odin** is "ODIN Alföðr" by Tom Holbein / VDCnordic (CC BY 4.0). I used it instead of the "Odin Plaque" model, which is paid ($50) and can't be downloaded. In Blender, the 1.4M-triangle original was decimated to 110k (`odin.glb`, 1.5 MB, 1K textures) with smooth normals rebuilt, and its sculpted ravens were cut away. The real 3D ravens land there instead, on perch points found by dropping a ray onto his shoulders. He's lit as a shadow: cold violet and teal rim lights, his painted gold glow map turned down to 1.5%, and one burning eye (a glow plus a short-range light that warms the hood around it). His eye flares while you type in the form.
- **Mímir's Well** is a 3D scene. "Realistic Human Eye" by Alexander Antipov (CC BY 4.0) lies at the bottom with a gold-lit iris and follows your cursor. It's rendered to a texture and seen through a water shader with live ripples: refraction, Fresnel, moonlit highlights and dark edges. A ring of instanced stones (one draw call) lit from below by the eye's glow surrounds it. Touch the water to make it ripple. The old 2D well remains only as the no-WebGL fallback.
- All three scenes share one WebGL context. Each model loads only when you get within about 1,200 px of its scene.
- Credits for both CC BY models are in the footer, as the licence requires. Source files are in `D:\Crow\` (`odin_web.blend`, `eye_src.glb`).
