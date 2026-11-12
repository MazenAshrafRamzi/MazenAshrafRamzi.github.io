// Shared project data, copied from main.js (keep both in sync until Blackwing replaces the current site).
window.PROJECTS = [
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
