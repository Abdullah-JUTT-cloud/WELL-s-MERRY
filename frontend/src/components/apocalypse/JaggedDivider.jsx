import { useMemo } from "react";

/* =====================================================================
   JaggedDivider — never a straight line.
   Sits between two colour blocks: the wrapper is painted with `from`
   and the SVG path (the top edge of the next section) is filled `to`.

   variants:
     "jagged" — sharp saw-tooth tear
     "wave"   — big uneven swells
     "torn"   — noisy paper-tear edge
     "drip"   — paint drips / oil runnels
   `seed` changes the irregularity; `flip` mirrors horizontally.
   ===================================================================== */

/* Deterministic PRNG so server/client and re-renders agree */
const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const W = 1440;
const H = 100;

const buildPath = (variant, seed) => {
  const rnd = mulberry32(seed);
  const between = (min, max) => min + rnd() * (max - min);

  if (variant === "jagged") {
    let x = 0;
    let y = between(38, 62);
    let d = `M0,${H} L0,${y.toFixed(1)}`;
    while (x < W) {
      const step = between(70, 150);
      x = Math.min(W, x + step);
      y = between(18, 78);
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return `${d} L${W},${H} Z`;
  }

  if (variant === "wave") {
    let x = 0;
    let y = between(40, 60);
    let d = `M0,${H} L0,${y.toFixed(1)}`;
    while (x < W) {
      const step = between(220, 340);
      const nx = Math.min(W, x + step);
      const cy = between(6, 92);
      const ny = between(34, 66);
      d += ` Q${(x + step / 2).toFixed(1)},${cy.toFixed(1)} ${nx.toFixed(1)},${ny.toFixed(1)}`;
      x = nx;
      y = ny;
    }
    return `${d} L${W},${H} Z`;
  }

  if (variant === "torn") {
    let x = 0;
    let y = between(42, 58);
    let d = `M0,${H} L0,${y.toFixed(1)}`;
    while (x < W) {
      const step = between(24, 64);
      x = Math.min(W, x + step);
      y = Math.max(20, Math.min(80, y + between(-16, 16)));
      d += ` L${x.toFixed(1)},${y.toFixed(1)}`;
    }
    return `${d} L${W},${H} Z`;
  }

  /* drip — scalloped runnels of varying depth */
  let x = 0;
  let d = `M0,${H} L0,34`;
  while (x < W) {
    const step = between(60, 150);
    const nx = Math.min(W, x + step);
    const depth = rnd() > 0.62 ? between(58, 92) : between(14, 40);
    d += ` Q${(x + step / 2).toFixed(1)},${depth.toFixed(1)} ${nx.toFixed(1)},34`;
    x = nx;
  }
  return `${d} L${W},${H} Z`;
};

const JaggedDivider = ({
  from = "#0f0c09",
  to = "#f2ebdc",
  variant = "jagged",
  seed = 7,
  flip = false,
  height = 72,
  className = "",
}) => {
  const d = useMemo(() => buildPath(variant, seed), [variant, seed]);

  return (
    <div
      aria-hidden="true"
      className={`relative w-full overflow-hidden leading-none ${className}`}
      style={{ backgroundColor: from, height }}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        <path d={d} fill={to} />
      </svg>
    </div>
  );
};

export default JaggedDivider;
