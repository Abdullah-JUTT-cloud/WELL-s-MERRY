import { useId } from "react";
import { motion, useReducedMotion } from "framer-motion";

/* =====================================================================
   StampBadge — circular rubber-stamp / geographic-seal badge.
   Rotating ring text around a centre glyph, hard-edged sticker frame.
   Used for "CERTIFIED ORGANIC", "DESTINATION: LAHORE, PK", etc.
   ===================================================================== */
const StampBadge = ({
  text = "CERTIFIED ORGANIC • 100% NATURAL • ",
  center = null,
  className = "",
  bg = "bg-apoc-bone",
  fg = "text-apoc-soot",
  ring = "border-apoc-soot",
  size = 128,
  spin = 26,
  float = true,
}) => {
  /* React ids contain colons (":r1:") which are unsafe inside SVG
     url(#) references — strip them. */
  const pathId = `stamp-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={`relative rounded-full border-4 ${ring} ${bg} ${fg} shadow-hard-ink select-none ${className}`}
      style={{ width: size, height: size }}
      animate={float && !reduce ? { y: [0, -9, 0], rotate: [0, 3, 0] } : undefined}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        <defs>
          <path id={pathId} d="M100,100 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0" fill="none" />
        </defs>
        <circle cx="100" cy="100" r="86" fill="none" stroke="currentColor" strokeWidth="3" opacity="0.85" />
        <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2.5" opacity="0.7" />
        <motion.g
          animate={reduce ? undefined : { rotate: 360 }}
          transition={{ duration: spin, repeat: Infinity, ease: "linear" }}
          style={{ originX: "100px", originY: "100px" }}
        >
          <text fill="currentColor" fontSize="17.5" fontWeight="800" letterSpacing="2.5" fontFamily="Archivo, sans-serif">
            <textPath href={`#${pathId}`}>{text}</textPath>
          </text>
        </motion.g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{center}</div>
    </motion.div>
  );
};

export default StampBadge;
