/**
 * WavyVineDivider — Organic wavy section divider inspired by leaf edges
 * and vine shapes. Replaces hard rectangular section edges with a
 * botanical SVG wave, in a single flat brand color.
 *
 * Used between major full-bleed sections (hero → features, features →
 * signature product band, etc.). This extends the concept of the
 * existing VineDivider.jsx with an actual SVG wave shape.
 *
 * The shape has a wavy organic quality — like a leaf edge or vine —
 * rather than a generic sine wave.
 */

const WavyVineDivider = ({
  from = "ink",          // background color of the section above
  to = "ivory",          // background color of the section below
  flip = false,          // rotate 180° to use at bottom of section
  height = 60,           // pixel height of the divider wave
  className = "",
}) => {
  // Colors map from Tailwind names to hex
  const colorMap = {
    ink: "#0e0c08",
    "ink-soft": "#17130d",
    espresso: "#2a1d14",
    ivory: "#f7f2e7",
    cream: "#efe6d3",
    "cream-dim": "#e7dcc4",
    moss: "#5c6b42",
    "moss-dim": "#788a5a",
    gold: "#d9ac47",
    "gold-1": "#a9791c",
    "gold-2": "#d9ac47",
    "gold-3": "#f2d88a",
    transparent: "transparent",
  };

  const fromColor = colorMap[from] || from;
  const toColor = colorMap[to] || to;

  return (
    <div
      className={`w-full overflow-hidden leading-none ${className}`}
      style={{
        height: `${height}px`,
        transform: flip ? "rotate(180deg)" : undefined,
        marginTop: "-1px",  // sub-pixel gap fix
        marginBottom: "-1px",
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        className="w-full h-full block"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/*
          Organic wavy path — not a generic sine wave.
          The path uses irregular bezier curves that evoke a leaf edge
          or vine tendril, with small leaf-like bumps along the wave.
        */}
        <path
          d="M0,40
             C80,20 120,55 200,35
             C280,15 320,50 400,30
             C440,20 460,45 520,28
             C580,10 620,48 700,32
             C780,16 820,50 900,35
             C940,28 960,48 1020,30
             C1080,12 1120,45 1200,32
             C1280,18 1320,52 1380,38
             C1410,30 1430,35 1440,40
             L1440,80 L0,80 Z"
          fill={toColor}
        />
        {/* Second wave layer for organic depth — slightly offset */}
        <path
          d="M0,50
             C100,30 150,58 250,40
             C350,22 400,55 500,38
             C600,20 650,52 750,35
             C850,18 900,50 1000,38
             C1100,25 1150,55 1250,40
             C1350,25 1400,48 1440,45
             L1440,80 L0,80 Z"
          fill={toColor}
          fillOpacity="0.6"
        />
        {/* Small decorative leaf-like bumps along the wave */}
        <circle cx="200" cy="34" r="4" fill={toColor} fillOpacity="0.8" />
        <circle cx="700" cy="30" r="3.5" fill={toColor} fillOpacity="0.7" />
        <circle cx="1200" cy="30" r="4" fill={toColor} fillOpacity="0.8" />
        {/* Tiny vine tendril accents */}
        <path
          d="M400,28 Q410,18 420,25"
          stroke={toColor}
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.6"
        />
        <path
          d="M1000,36 Q1010,26 1020,33"
          stroke={toColor}
          strokeWidth="1.5"
          fill="none"
          strokeOpacity="0.6"
        />
      </svg>
    </div>
  );
};

export default WavyVineDivider;
