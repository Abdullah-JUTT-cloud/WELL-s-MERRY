/* =====================================================================
   WavyDivider — fluid organic SVG section divider. No straight lines.

   Sits BETWEEN two sections and paints the color hand-off:
     • `from` — the color of the section ABOVE (fills the div background)
     • `to`   — the color of the section BELOW (fills the wave path)

   A soft "echo" wave in the `to` color at low opacity floats above the
   main wave for a layered, watery feel.

   Usage:
     <SectionA className="bg-merry-forest" />
     <WavyDivider from="forest" to="cream" variant="swell" />
     <SectionB className="bg-merry-cream" />
   ===================================================================== */

const COLOR_TOKENS = {
  forest: "#1A2E24",
  pine: "#24382C",
  moss: "#3E5C49",
  cream: "#F9F6F0",
  oat: "#EFE8DB",
  clay: "#C17754",
};

const resolveColor = (c) => COLOR_TOKENS[c] || c;

/* All paths live in a 1440×122 box and close along the bottom edge
   (y=122 overshoots the 120 viewBox height by 2px to kill sub-pixel
   seams between the divider and the section below). */
const WAVES = {
  // Long, uneven rollers — the default hand-off wave.
  swell:
    "M0,46 C160,104 340,14 540,58 C740,102 900,20 1080,54 C1240,84 1360,30 1440,66 L1440,122 L0,122 Z",
  // Bigger, slower billows for hero → content transitions.
  billow:
    "M0,78 C180,18 360,110 560,66 C760,22 920,104 1120,58 C1280,22 1380,72 1440,44 L1440,122 L0,122 Z",
  // Tighter, choppier ripple for tween-content color flips.
  ripple:
    "M0,62 C90,32 180,92 270,62 C360,32 450,92 540,62 C630,32 720,92 810,62 C900,32 990,92 1080,62 C1170,32 1260,92 1350,62 C1400,46 1440,58 1440,58 L1440,122 L0,122 Z",
};

const WavyDivider = ({
  from = "forest",
  to = "cream",
  variant = "swell",
  flip = false, // mirror horizontally so back-to-back dividers don't repeat
  echo = true, // translucent secondary wave for depth
  heightClass = "h-14 sm:h-20 lg:h-28",
  className = "",
}) => {
  const d = WAVES[variant] || WAVES.swell;

  return (
    <div
      aria-hidden="true"
      className={`relative overflow-hidden leading-[0] ${className}`}
      style={{ backgroundColor: resolveColor(from) }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className={`block w-full ${heightClass} ${flip ? "-scale-x-100" : ""}`}
      >
        {echo && (
          <path
            d={d}
            fill={resolveColor(to)}
            opacity="0.3"
            transform="translate(0,-16)"
          />
        )}
        <path d={d} fill={resolveColor(to)} />
      </svg>
    </div>
  );
};

export default WavyDivider;
