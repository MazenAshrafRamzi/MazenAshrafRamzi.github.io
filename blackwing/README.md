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

## v5: less 3D, more portfolio
Only the two hero ravens are still real-time 3D. Everything else is 2D, which is lighter and calmer, so the work stays in front.
- **Odin** is a silhouette rendered once in Blender from "ODIN Alföðr" by Tom Holbein / VDCnordic (CC BY 4.0): near-black, edged by violet and teal rim light (`odin.webp`, 93 KB). The two perched ravens are rendered from the rigged raven scan into their own transparent layers (`ravenL.webp` and `ravenR.webp`, 6 KB each), so each one appears as it lands. Only his left eye glows, and only the ravens' eyes glow. The glow points sit at the exact eye positions, projected from the 3D scene in Blender.
- **The flying ravens** (takeoff, the dawn sky, Muninn on the timeline, the landing, the courier) use a 12-frame flight cycle rendered in Blender from "Crow Fly" by LostBoyz2078 (CC BY-NC 4.0; a personal portfolio is non-commercial use). The sprite sheet is `crow-fly.webp` (40 KB), animated with CSS `steps()`.
- **Mímir's Well** is a 2D canvas again. The eye is drawn, not modelled: an almond eye with a gold iris of 640 painted fibres, a collarette and a ring of runes, a breathing pupil and highlights. It follows your cursor and blinks. The water ripples where you touch it, and each ripple bends the eye: it is copied in thin rows, each pushed sideways by the waves crossing it.
- Removed: `odin.glb` and `eye.glb` (1.7 MB). The 3D module now only draws the hero ravens.
- Source files are in `D:\Crow\` (`odin_web.blend`, `sil_*.png`, `crowf_*.png`).

## v6: a new Odin, and Mímir's Well in 3D
- **Odin** is now the full 1.4M-triangle "ODIN Alföðr" sculpt (Tom Holbein / VDCnordic, CC BY 4.0), rendered once in Blender as a figure in near-total darkness: a near-black material, thin volumetric fog, a backlight and violet/teal rim lights that pick out the hood, the braids, the fur mantle and Gungnir. The halo, the sculpted ravens and everything below the waist were cut away. The image fades to black at the edges (`odin.webp`, 21 KB). The rigged ravens are rendered into their own transparent layers in the same light (`ravenL.webp`, `ravenR.webp`). Only his left eye and the ravens' eyes glow, at positions projected from the 3D scene.
- **Mímir's Well** is real-time 3D again (`well3d.js`), but no longer a human eye: a dry-stone well of three offset courses of rough-hewn blocks, with runes carved on the inner face of the top course that kindle in turn. The roots of Yggdrasil arch over the wall and plunge into the water. Under the water lies Odin's eye as a sigil of light: a gold iris of painted fibres inside two rune rings turning against each other, framed by a vesica of light, with a dark pupil that follows your cursor and a lid of light that blinks. The water is a shader that refracts the deep through the ripples you make (move or click). Mist drifts over it and gold motes rise. Everything is built in code; it builds only near the section and renders only while visible, at most 30 fps. If WebGL fails, the 2D canvas well comes back.
- The render scripts and sources are in `D:\Crow\` (`odin2_*.png`).

## v7: Odin from Mazen's own concept art; ravens stand whole on his shoulders; a calmer well
- **Odin** comes from Mazen's own generated concept art (the Wanderer in a wide hat, fur mantle, ravens and a rune ring) and the low-poly model generated from it. In Blender the model's two built-in ravens (separate mesh islands) were deleted, leaving 320k triangles. The texture was darkened to a near-black ghost of itself, the camera was framed on the upper body, and he is lit only by violet and teal rims. The render sits over a violet sky with a gold Elder Futhark ring behind his head (`odin.webp`, 31 KB). The previous statue model is no longer used.
- **His eye**: the glowing texels of the model's own texture locate his left eye exactly (centre 55.6% / 36.0% of the frame, 3.6% of the frame wide). The CSS glow is a gold almond of that size at that point. It wakes when the ravens land and flares while you type.
- **The ravens** are rendered on their own in profile from the rigged raven, whole body (a scanned twig under the toes was cut away). They sit in front of him, so nothing covers them, and land on his shoulder tops (`ravenL.webp`, `ravenR.webp`).
- **The well's water** is calmer: smaller, quicker-fading ripples and fewer drips, so the eye stays readable while you play with the surface.
- Sources are in `D:\Crow\`: `tripo_odin_clean.blend`, `todin_*.png` and `perch_*.png`.

## v8: Odin blends into the dusk; live ravens on his shoulders; his eye opens
- **No background:** Odin is the transparent render, faded out at the bottom and sides, so he stands straight on the page's own dark (`odin.webp`, 30 KB, with alpha).
- **The ravens on his shoulders are live 3D**, the same rigged ravens as at dawn, with the same idle life: snapping head turns, tilts, blinking gold eyes, breathing, tail flicks and feather ruffles. `raven3d.js` now has two stages that share ONE WebGL canvas: the hero, and the dusk, where an orthographic camera is mapped onto Odin's square figure. The canvas moves to whichever stage is on screen and renders only there. When the 2D flight lands, `blackwing3d.duskLand(i)` drops that raven onto its shoulder point (`data-at`) with a settling shake of its feathers. The twig the scan grips is cut from the dusk ravens' geometry. Without WebGL, the 2D perched ravens are still used.
- **His eye** is now a small point of light (1.2% of the frame), not a lit shape. It sits on the model's left eye and opens like an eyelid once both ravens have landed, then breathes, and flares while you write.

## v9: he raises his head; the ravens always land on him; no CDN for 3D; Mazen Ashraf by name
- **Odin raises his head.** Twelve frames were rendered in Blender (`odin_tilt.py`): his head goes from bowed (+12°, eye hidden under the brim) to chin-up (-5°). A smooth weight from the shoulders up to the hat moves neck, beard and hat together with no seams. Only the head region is in the sheet (`odin-raise.webp`, 150 KB). It loads quietly after the page loads, and the still `odin.webp` is its last frame. The sequence: he waits bowed, the ravens land, he raises his head (1.7 s, eased), then the eye opens.
- **The landing no longer depends on scrolling.** The two flying ravens are now children of Odin's figure and fly in coordinates relative to it. They always end exactly on his shoulder points (`data-at`), where the live 3D ravens appear, however fast you scroll.
- **Hero ravens on every load.** three.js, its loaders and the Draco decoder are now hosted with the site (`vendor/three/`, 1.1 MB, cached) instead of jsDelivr, and the raven model is preloaded. If loading fails, it is retried up to three times.
- **Name:** the title, nav, page title and copy now say **Mazen Ashraf** instead of Blackwing. The folder and URL stay `/blackwing/`.
- Tested at 1400 px, a narrow window and a 375 px phone (touch emulated): same flights, landing, head raise and eye, with no horizontal overflow.
