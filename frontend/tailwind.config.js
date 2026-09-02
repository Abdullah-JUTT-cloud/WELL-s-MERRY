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
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(120deg, #a9791c, #f2d88a 45%, #a9791c)",
      },
      maxWidth: {
        content: "1240px",
      },
    },
  },
  plugins: [],
};