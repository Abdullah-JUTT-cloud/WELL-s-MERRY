/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0e0c08", // primary near-black, warm undertone
          soft: "#17130d",
        },
        espresso: "#2a1d14",
        gold: {
          1: "#a9791c",
          2: "#d9ac47",
          3: "#f2d88a",
        },
        ivory: "#f7f2e7",
        cream: {
          DEFAULT: "#efe6d3",
          dim: "#e7dcc4",
        },
        moss: {
          DEFAULT: "#5c6b42",
          dim: "#788a5a",
        },
        /* ---- "Apocalypse" brand palette --------------------------------
           The loud, raw sister-theme used by the homepage takeover:
           deep charcoal blacks, stark cream paper, burnt orange rust. */
        apoc: {
          coal: "#181410",   // warm near-black section background
          soot: "#0f0c09",   // deepest black (page base, borders)
          smoke: "#241d16",  // lifted dark surface (cards on black)
          bone: "#f2ebdc",   // stark off-white / cream
          paper: "#e8dfca",  // aged newsprint cream
          rust: "#a63c11",   // deep burnt orange
          ember: "#d95312",  // primary accent orange
          flame: "#f0762b",  // hot highlight orange
          volt: "#e4f24b",   // sparing neon accent (conspiracy notes, stats)
        },
        /* ---- "Merry" brand palette -------------------------------------
           Premium earthy organic sister-theme: same chunky, blocky bones
           as `apoc`, but deep forest green, warm cream, terracotta clay. */
        merry: {
          forest: "#1A2E24",     // primary dark — deep forest green
          pine: "#24382C",       // lifted dark surface (cards on forest)
          moss: "#3E5C49",       // mid green for strokes / hovers on dark
          sage: "#9DB4A4",       // muted green text on forest backgrounds
          cream: "#F9F6F0",      // primary light — warm cream
          oat: "#EFE8DB",        // darker cream for surfaces on cream
          clay: "#C17754",       // accent — terracotta / clay
          "clay-deep": "#A45C3B",// pressed / hover state of clay
          bark: "#54432F",       // warm brown support tone
        },
      },
      fontFamily: {
        display: ["Fraunces", "serif"], // elegant serif for headings
        body: ["Jost", "sans-serif"],   // clean sans for body text
        /* Apocalypse type stack:
           apoc       — chunky slab-black display for oversized headlines
           condensed  — tall compressed caps for marquees / card titles
           distressed — eroded rubber-stamp face for badges & annotations
           grotesk    — bold, ultra-legible sans for body copy */
        apoc: ['"Archivo Black"', "Impact", "sans-serif"],
        condensed: ["Anton", "Impact", "sans-serif"],
        distressed: ['"Rubik Distressed"', "cursive"],
        grotesk: ["Archivo", "sans-serif"],
        /* Merry type stack:
           slab  — heavy, condensed-feeling display serif for h1–h4,
                   marquees, prices and buttons (chunky, blocky)
           (body copy uses the ultra-legible Archivo sans via .theme-merry) */
        slab: ['"Alfa Slab One"', "Fraunces", "serif"],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(14,12,8,0.18)",
        // Neo-brutalist hard-edged offset shadow (no blur)
        hard: "4px 4px 0 #0e0c08",
        "hard-sm": "3px 3px 0 #0e0c08",
        "hard-lg": "6px 6px 0 #0e0c08",
        "hard-gold": "4px 4px 0 #a9791c",
        /* Apocalypse hard shadows — bigger, louder, tinted */
        "hard-ink": "8px 8px 0 #0f0c09",
        "hard-ink-lg": "14px 14px 0 #0f0c09",
        "hard-ember": "8px 8px 0 #d95312",
        "hard-bone": "8px 8px 0 #f2ebdc",
        "hard-rust": "8px 8px 0 #a63c11",
        /* Merry hard shadows — same brutalist offset, earthy tints */
        "hard-merry-sm": "4px 4px 0 #1A2E24",
        "hard-merry": "6px 6px 0 #1A2E24",
        "hard-merry-lg": "10px 10px 0 #1A2E24",
        "hard-merry-clay-sm": "4px 4px 0 #C17754",
        "hard-merry-clay": "6px 6px 0 #C17754",
        "hard-merry-cream": "6px 6px 0 #F9F6F0",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(120deg, #a9791c, #f2d88a 45%, #a9791c)",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [
    /* Scoped "Merry" typography theme.
       Wrap any page (or the whole app) in `.theme-merry` — MerryLayout does
       this automatically — and every h1–h4 inside becomes the heavy display
       slab serif, while body copy falls back to clean Archivo sans. Scoping
       via a class keeps the existing gold/ivory and apocalypse pages 100%
       untouched. Color is intentionally NOT set on headings so they inherit
       correctly on both cream and forest-green sections. */
    function merryTheme({ addComponents }) {
      addComponents({
        ".theme-merry": {
          fontFamily: 'Archivo, Jost, sans-serif',
          color: "#1A2E24",
        },
        ".theme-merry h1, .theme-merry h2, .theme-merry h3, .theme-merry h4": {
          fontFamily: '"Alfa Slab One", Fraunces, serif',
          fontWeight: "400", // Alfa Slab One ships a single (very heavy) weight
          letterSpacing: "0.005em",
          lineHeight: "1.02",
        },
        ".theme-merry ::selection": {
          backgroundColor: "#C17754",
          color: "#F9F6F0",
        },
        /* Shared neo-brutalist "press" interaction: the element slides
           into (and erases) its own hard shadow. Pair with any
           shadow-hard-merry* utility. Used by Navbar and the Merry
           pages' chunky buttons. */
        ".pressable": {
          transitionProperty: "transform, box-shadow",
          transitionDuration: "150ms",
          "&:hover": {
            transform: "translate(3px, 3px)",
            boxShadow: "none",
          },
          "&:active": {
            transform: "translate(4px, 4px)",
            boxShadow: "none",
          },
        },
      });
    },
  ],
};