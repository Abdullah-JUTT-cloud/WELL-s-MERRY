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
      },
      fontFamily: {
        display: ["Fraunces", "serif"], // elegant serif for headings
        body: ["Jost", "sans-serif"],   // clean sans for body text
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