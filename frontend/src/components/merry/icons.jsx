/* =====================================================================
   MERRY ICON SET — chunky, organic vector glyphs for the earthy theme.
   All paths hand-drawn for this project; fill/stroke = currentColor so
   Tailwind text-* classes tint them on cream and forest sections alike.
   ===================================================================== */

const base = "inline-block shrink-0";

/* Solid leaf silhouette with a curving stem — the brand mark and the
   default marquee separator. */
export const LeafIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M20.9 3.1C10.4 3.1 4 9.2 3.4 19.3c0 .6 0 1.1.1 1.6 1.5.4 3.1.5 4.7.3 7.7-1 12.4-8 12.7-18.1Z" />
    <path
      d="M2.6 21.6c2.2-6.7 6.6-11.8 13.2-15.2"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
    />
  </svg>
);

/* Two leaves on a sprouting stem — growth / "grows new hair". */
export const SproutIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M11 14.6C11 9.9 7.6 6.8 2.6 6.8c0 5.1 3.5 7.9 8.4 7.8Z" />
    <path d="M13 14.6c0-4.7 3.4-7.8 8.4-7.8 0 5.1-3.5 7.9-8.4 7.8Z" />
    <path
      d="M12 21.6v-5.4c0-2.2.9-4.2 2.6-5.8"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    />
  </svg>
);

/* Oil drop with a highlight notch — cold-pressed oil. */
export const DropIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12 1.9S4.8 10.1 4.8 14.9a7.2 7.2 0 0 0 14.4 0C19.2 10.1 12 1.9 12 1.9Zm0 17.2a4.4 4.4 0 0 1-4.4-4.4c0-.6.5-1.1 1.1-1.1.6 0 1.1.5 1.1 1.1a2.2 2.2 0 0 0 2.2 2.2c.6 0 1.1.5 1.1 1.1 0 .6-.5 1.1-1.1 1.1Z" />
  </svg>
);

/* Blocky sun — shine / radiance. */
export const SunIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <circle cx="12" cy="12" r="4.6" />
    <path
      d="M12 1.4v3.2M12 19.4v3.2M1.4 12h3.2M19.4 12h3.2M4.5 4.5l2.3 2.3M17.2 17.2l2.3 2.3M19.5 4.5l-2.3 2.3M6.8 17.2l-2.3 2.3"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);

/* Pump-top oil bottle with a knocked-out label band (evenodd hole, so it
   works on any background color). */
export const BottleIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M9.6 1.6h4.8a1 1 0 0 1 1 1v2.5l1.6 2.1c.7.9 1.1 2.1 1.1 3.3v9.4A2.3 2.3 0 0 1 15.8 22H8.2a2.3 2.3 0 0 1-2.3-2.3v-9.4c0-1.2.4-2.4 1.1-3.3l1.6-2.1V2.6a1 1 0 0 1 1-1Zm-1.2 10.6h7.2v4.6H8.4v-4.6Z"
    />
  </svg>
);

/* Four-point organic sparkle — purity / "zero chemicals" moments. */
export const SparkIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12 1.4c.9 5.2 4.4 8.7 9.6 9.6-5.2.9-8.7 4.4-9.6 9.6-.9-5.2-4.4-8.7-9.6-9.6 5.2-.9 8.7-4.4 9.6-9.6Z" />
  </svg>
);

/* Open hand holding a heart — family-safe / handmade care. */
export const HandHeartIcon = ({ className = "w-6 h-6" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12 10.4 8.9 7.2a3 3 0 0 1 0-4.2 2.9 2.9 0 0 1 4.2 0l-1.1-.1 1.1.1a2.9 2.9 0 0 1 4.2 0 3 3 0 0 1 0 4.2L12 10.4Z" />
    <path d="M21.4 13.4c-.8-.8-2-.8-2.8-.1l-3.3 2.7h-4.2a.9.9 0 0 1 0-1.8h2.7c.8 0 1.5-.6 1.5-1.4 0-.8-.7-1.4-1.5-1.4H8.6c-1.1 0-2.2.4-3 1.2l-2.9 2.7v5.3l3.7-.7 6.6 2 8.4-5.6c.9-.7 1-2 0-2.9Z" />
  </svg>
);

/* Named lookup so data files / props can reference icons by string. */
export const MERRY_ICON_MAP = {
  leaf: LeafIcon,
  sprout: SproutIcon,
  drop: DropIcon,
  sun: SunIcon,
  bottle: BottleIcon,
  spark: SparkIcon,
  hand: HandHeartIcon,
};
