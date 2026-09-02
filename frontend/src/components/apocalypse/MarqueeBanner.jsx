import { motion, useReducedMotion } from "framer-motion";
import { ICON_MAP } from "./icons.jsx";

/* =====================================================================
   MarqueeBanner — fast, infinite, Framer-Motion driven ticker band.
   Two identical rows sit side by side; the track animates x from 0 to
   -50% on a linear infinite loop, so the seam is invisible.
   `icon` separates each repetition (skull / drop / bolt...).
   ===================================================================== */
const MarqueeBanner = ({
  text = "THE LAST HAIR OIL YOU'LL EVER NEED",
  icon = "skull",
  repeats = 6,
  duration = 14,
  reverse = false,
  bg = "bg-apoc-ember",
  fg = "text-apoc-soot",
  border = "border-y-4 border-apoc-soot",
  rotate = 0,
  iconClass = "w-6 h-6 sm:w-7 sm:h-7",
  textClass = "text-lg sm:text-2xl",
  className = "",
}) => {
  const reduce = useReducedMotion();
  const Icon = ICON_MAP[icon] || ICON_MAP.skull;

  const Row = ({ hidden = false }) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeats }).map((_, i) => (
        <span key={i} className="flex items-center shrink-0">
          <span className={`font-condensed uppercase tracking-wide px-5 sm:px-7 whitespace-nowrap ${textClass}`}>
            {text}
          </span>
          <Icon className={iconClass} />
        </span>
      ))}
    </div>
  );

  return (
    <div
      className={`relative overflow-hidden ${bg} ${fg} ${border} select-none ${className}`}
      style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}
    >
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <Row />
        <Row hidden />
      </motion.div>
    </div>
  );
};

export default MarqueeBanner;
