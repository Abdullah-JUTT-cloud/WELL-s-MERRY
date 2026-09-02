/**
 * BotanicalElements — Decorative ambient SVG elements scattered around
 * hero sections and key areas. Each element is a small illustrated
 * botanical (leaf, oil droplet, seed pod) with a gentle idle float/bob
 * animation and subtle drop shadow.
 *
 * These are aria-hidden garnishes, not interactive content.
 * Respects prefers-reduced-motion via the global CSS rule.
 */

// A simple botanical leaf shape
const LeafSVG = ({ className, style }) => (
  <svg
    viewBox="0 0 40 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M20 2C20 2 6 16 6 34C6 46 12 56 20 58C28 56 34 46 34 34C34 16 20 2 20 2Z"
      fill="#5c6b42"
      fillOpacity="0.7"
      stroke="#0e0c08"
      strokeWidth="1.5"
    />
    <path
      d="M20 8V54"
      stroke="#0e0c08"
      strokeWidth="1"
      strokeOpacity="0.5"
    />
    <path
      d="M20 20L12 28M20 30L14 36M20 20L28 28M20 30L26 36"
      stroke="#0e0c08"
      strokeWidth="0.8"
      strokeOpacity="0.4"
    />
  </svg>
);

// An oil droplet shape
const DropletSVG = ({ className, style }) => (
  <svg
    viewBox="0 0 32 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M16 4C16 4 4 20 4 30C4 38 9.5 44 16 44C22.5 44 28 38 28 30C28 20 16 4 16 4Z"
      fill="#d9ac47"
      fillOpacity="0.5"
      stroke="#0e0c08"
      strokeWidth="1.5"
    />
    <ellipse
      cx="12"
      cy="30"
      rx="3"
      ry="5"
      fill="#f2d88a"
      fillOpacity="0.6"
    />
  </svg>
);

// A seed pod / small round botanical
const SeedPodSVG = ({ className, style }) => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <circle
      cx="18"
      cy="18"
      r="14"
      fill="#a9791c"
      fillOpacity="0.4"
      stroke="#0e0c08"
      strokeWidth="1.5"
    />
    <circle
      cx="18"
      cy="18"
      r="8"
      fill="#d9ac47"
      fillOpacity="0.3"
      stroke="#0e0c08"
      strokeWidth="0.8"
      strokeOpacity="0.5"
    />
    <circle cx="18" cy="18" r="3" fill="#0e0c08" fillOpacity="0.2" />
  </svg>
);

// A small sprig/twig with tiny leaves
const SprigSVG = ({ className, style }) => (
  <svg
    viewBox="0 0 50 30"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    style={style}
    aria-hidden="true"
  >
    <path
      d="M4 26C12 22 20 18 28 12C32 9 38 5 46 4"
      stroke="#5c6b42"
      strokeWidth="1.5"
      strokeOpacity="0.8"
    />
    <ellipse cx="14" cy="22" rx="5" ry="3" fill="#5c6b42" fillOpacity="0.5" stroke="#0e0c08" strokeWidth="1" transform="rotate(-20 14 22)" />
    <ellipse cx="24" cy="16" rx="5" ry="3" fill="#5c6b42" fillOpacity="0.5" stroke="#0e0c08" strokeWidth="1" transform="rotate(-30 24 16)" />
    <ellipse cx="34" cy="10" rx="4" ry="2.5" fill="#5c6b42" fillOpacity="0.5" stroke="#0e0c08" strokeWidth="1" transform="rotate(-40 34 10)" />
  </svg>
);

/**
 * HeroBotanicals — A set of ambient botanical elements positioned
 * around the hero section. Scattered with varied positions, sizes,
 * rotations and animation speeds for a natural feel.
 */
export const HeroBotanicals = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-10" aria-hidden="true">
    {/* Top-right leaf */}
    <LeafSVG
      className="absolute top-[22%] right-[6%] w-10 h-14 opacity-40 wm-float"
      style={{ "--float-rotate": "15deg", animationDelay: "0s" }}
    />
    {/* Mid-left droplet */}
    <DropletSVG
      className="absolute top-[55%] left-[3%] w-7 h-10 opacity-35 wm-float-slow"
      style={{ "--float-rotate": "-10deg", animationDelay: "1.5s" }}
    />
    {/* Bottom-right seed pod */}
    <SeedPodSVG
      className="absolute bottom-[28%] right-[12%] w-8 h-8 opacity-30 wm-float-drift"
      style={{ "--float-rotate": "8deg", animationDelay: "0.8s" }}
    />
    {/* Top-left sprig */}
    <SprigSVG
      className="absolute top-[15%] left-[8%] w-14 h-8 opacity-30 wm-float-slow"
      style={{ "--float-rotate": "-5deg", animationDelay: "2.2s" }}
    />
    {/* Small leaf near bottom */}
    <LeafSVG
      className="absolute bottom-[18%] left-[18%] w-6 h-9 opacity-25 wm-float"
      style={{ "--float-rotate": "-20deg", animationDelay: "3s" }}
    />
  </div>
);

/**
 * SectionBotanicals — Ambient elements for use between major sections.
 * Lighter, more subtle than hero garnish.
 */
export const SectionBotanicals = ({ variant = "cream" }) => {
  const opacity = variant === "dark" ? "opacity-20" : "opacity-25";
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      <LeafSVG
        className={`absolute top-[10%] right-[4%] w-8 h-12 ${opacity} wm-float-slow`}
        style={{ "--float-rotate": "12deg", animationDelay: "0.5s" }}
      />
      <DropletSVG
        className={`absolute bottom-[15%] left-[5%] w-5 h-8 ${opacity} wm-float-drift`}
        style={{ "--float-rotate": "-8deg", animationDelay: "2s" }}
      />
    </div>
  );
};
