/* =====================================================================
   APOCALYPSE ICON SET — chunky, high-contrast vector glyphs.
   All paths hand-drawn for this project; fill/stroke = currentColor so
   Tailwind text-* classes tint them and drop-shadow utilities give the
   neon glow on dark sections.
   ===================================================================== */

const base = "inline-block shrink-0";

export const SkullIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12 1.5c-5.2 0-9 3.7-9 8.8 0 2.9 1.3 5 3.2 6.4v3.1c0 .9.7 1.7 1.6 1.7h1v-2.2h1.5v2.2h1.5v-2.2h1.5v2.2h1v0c.9 0 1.6-.8 1.6-1.7v-3.1c1.9-1.4 3.2-3.5 3.2-6.4 0-5.1-3.8-8.8-9-8.8Z" />
    <circle cx="8.4" cy="10.6" r="2.5" fill="#0f0c09" />
    <circle cx="15.6" cy="10.6" r="2.5" fill="#0f0c09" />
    <path d="M12 13.2l1.5 2.9h-3L12 13.2Z" fill="#0f0c09" />
  </svg>
);

export const DropIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12 1.8S4.6 10.2 4.6 15a7.4 7.4 0 0 0 14.8 0C19.4 10.2 12 1.8 12 1.8Zm0 17.6a4.5 4.5 0 0 1-4.5-4.5c0-.6.5-1.1 1.1-1.1s1.1.5 1.1 1.1a2.3 2.3 0 0 0 2.3 2.3c.6 0 1.1.5 1.1 1.1s-.5 1.1-1.1 1.1Z" />
  </svg>
);

export const BoltIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M13.6 1.5 3.2 13.6h6.5L8.4 22.5 20.8 9.9h-6.9l-.3-8.4Z" />
  </svg>
);

export const CrosshairIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
    <circle cx="12" cy="12" r="7.2" />
    <circle cx="12" cy="12" r="2.1" fill="currentColor" stroke="none" />
    <path d="M12 1.2v4.4M12 18.4v4.4M1.2 12h4.4M18.4 12h4.4" />
  </svg>
);

export const ScalesIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M11 3h2v17h-2z" />
    <path d="M4 5h16v2H4z" />
    <path d="M5.5 7 2 14h7L5.5 7Zm0 8.6A3.5 3.5 0 0 1 2 14h7a3.5 3.5 0 0 1-3.5 1.6Z" />
    <path d="M18.5 7 15 14h7l-3.5-7Zm0 8.6A3.5 3.5 0 0 1 15 14h7a3.5 3.5 0 0 1-3.5 1.6Z" />
    <path d="M7 20.4h10v2H7z" />
  </svg>
);

export const SnowIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="square" aria-hidden="true">
    <path d="M12 1.8v20.4M3.2 6.9l17.6 10.2M20.8 6.9 3.2 17.1" />
    <path d="M12 1.8 9.6 4.2M12 1.8l2.4 2.4M12 22.2l-2.4-2.4M12 22.2l2.4-2.4" />
  </svg>
);

export const FlameIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M12.7 1.6c.6 3.4-.9 5.2-2.6 7C8.2 10.6 6.4 12.5 6.4 16a5.9 5.9 0 0 0 11.8.3c0-2.5-1-4.3-2.2-6-.4 1.2-1 1.9-1.9 2.5.5-3.6-.4-8-1.4-11.2Z" />
  </svg>
);

/* Coffee-bean / seed oval used as a quiz-section floater */
export const BeanIcon = ({ className = "w-8 h-8" }) => (
  <svg viewBox="0 0 24 24" className={`${base} ${className}`} fill="currentColor" aria-hidden="true">
    <path d="M17.6 3.4c-4-1.9-9.4.3-12 4.9-2.6 4.6-1.6 9.9 2.4 11.8 4 1.9 9.4-.3 12-4.9 2.6-4.6 1.6-9.9-2.4-11.8Zm-8.9 14c2-3.9 4.4-7.6 7.6-10.6.5.5.9 1.1 1.2 1.8-3 2.9-5.4 6.4-7.3 10.1a6 6 0 0 1-1.5-1.3Z" />
  </svg>
);

export const ICON_MAP = {
  skull: SkullIcon,
  drop: DropIcon,
  bolt: BoltIcon,
  crosshair: CrosshairIcon,
  scales: ScalesIcon,
  snow: SnowIcon,
  flame: FlameIcon,
  bean: BeanIcon,
};
