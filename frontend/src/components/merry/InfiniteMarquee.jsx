import { motion, useReducedMotion } from "framer-motion";
import { MERRY_ICON_MAP } from "./icons.jsx";

/* =====================================================================
   InfiniteMarquee — infinite-scrolling brand banner with thick top and
   bottom borders. Leaf icons separate each phrase.

   Framer-Motion drives the track from x:0% → x:-50% on a linear infinite
   loop; two identical rows sit side by side so the seam is invisible.
   Honors prefers-reduced-motion (renders a static band).

   Default text: "100% ORGANIC • COLD-PRESSED • CASH ON DELIVERY"
   (each phrase separated by a leaf instead of a bullet).
   ===================================================================== */
const InfiniteMarquee = ({
  items = ["100% ORGANIC", "COLD-PRESSED", "CASH ON DELIVERY"],
  icon = "leaf",
  repeats = 4, // how many times the phrase-set repeats per row
  duration = 22, // seconds per loop — lower = faster
  reverse = false,
  bg = "bg-merry-clay",
  fg = "text-merry-cream",
  border = "border-y-4 border-merry-forest",
  textClass = "text-lg sm:text-2xl",
  iconClass = "w-5 h-5 sm:w-7 sm:h-7",
  className = "",
}) => {
  const reduce = useReducedMotion();
  const Icon = MERRY_ICON_MAP[icon] || MERRY_ICON_MAP.leaf;

  const Row = ({ hidden = false }) => (
    <div className="flex items-center shrink-0" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeats }).map((_, r) => (
        <span key={r} className="flex items-center shrink-0">
          {items.map((phrase, i) => (
            <span key={i} className="flex items-center shrink-0">
              <span
                className={`font-slab uppercase tracking-wide px-5 sm:px-8 py-3 sm:py-4 whitespace-nowrap ${textClass}`}
              >
                {phrase}
              </span>
              <Icon className={iconClass} />
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <div className={`relative overflow-hidden ${bg} ${fg} ${border} select-none ${className}`}>
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

export default InfiniteMarquee;
