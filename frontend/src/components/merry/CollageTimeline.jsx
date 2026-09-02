import { motion } from "framer-motion";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   CollageTimeline — brand-story timeline as a messy wall of overlapping
   polaroids, connected by a hand-strung SVG "string".

   • Desktop (lg+): a `relative` canvas with a fixed height; each
     polaroid is `absolute`-positioned via percentage offsets and its
     own rotation, and a dashed terracotta bezier path snakes behind
     them from pin to pin.
   • Mobile: the same polaroids fall back into normal flow (stacked,
     still tilted) and the string hides — no cramped absolute soup.

   Each polaroid: thick forest border, hard shadow, clay "tape" strip,
   square photo area (image or leaf fallback), year stamp + caption.
   ===================================================================== */

const DEFAULT_MOMENTS = [
  {
    year: "2019",
    caption: "One grandmother's recipe, one copper pot, a very patient stove.",
    rotate: -6,
    pos: "lg:left-[3%] lg:top-[1%]",
  },
  {
    year: "2020",
    caption: "First cold-pressed batch. Forty bottles — gone in a weekend.",
    rotate: 4,
    pos: "lg:left-[52%] lg:top-[8%]",
  },
  {
    year: "2022",
    caption: "The blend grows to eight organic oils. Still zero chemicals.",
    rotate: -3,
    pos: "lg:left-[12%] lg:top-[36%]",
  },
  {
    year: "2024",
    caption: "Outlets across the city, cash on delivery across the country.",
    rotate: 5,
    pos: "lg:left-[56%] lg:top-[45%]",
  },
  {
    year: "Today",
    caption: "Same pot. Same patience. A lot more hair to care for.",
    rotate: -4,
    pos: "lg:left-[31%] lg:top-[70%]",
  },
];

/* Dashed string connecting the polaroid pins, drawn in a 0–100 space
   stretched across the canvas. non-scaling-stroke keeps the dash crisp
   regardless of the container's aspect ratio. */
const STRING_PATH =
  "M 18 8 C 38 0, 58 4, 66 15 C 74 26, 44 30, 30 43 C 18 54, 56 44, 73 52 C 86 58, 64 70, 48 77";

const PIN_POINTS = [
  [18, 8],
  [66, 15],
  [30, 43],
  [73, 52],
  [48, 77],
];

const CollageTimeline = ({
  moments = DEFAULT_MOMENTS,
  heading = "How the merry started",
  eyebrow = "Our story",
  className = "",
}) => (
  <section className={`bg-merry-oat ${className}`}>
    <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:py-24">
      <p className="flex items-center justify-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
        <LeafIcon className="h-4 w-4" />
        {eyebrow}
      </p>
      <h2 className="mx-auto mt-4 max-w-3xl text-center text-4xl uppercase leading-[0.98] sm:text-6xl">
        {heading}
      </h2>

      {/* The collage canvas — relative parent, absolute polaroids on lg+ */}
      <div className="relative mt-14 lg:mt-20 lg:h-[1250px]">
        {/* The connecting string (desktop only) */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          <path
            d={STRING_PATH}
            fill="none"
            stroke="#C17754"
            strokeWidth="3"
            strokeDasharray="10 9"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
          {PIN_POINTS.map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r="0.8" fill="#1A2E24" />
          ))}
        </svg>

        {moments.map((m, i) => (
          <motion.figure
            key={m.year}
            initial={{ opacity: 0, y: 44, rotate: (m.rotate || 0) * 2.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: m.rotate || 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ type: "spring", stiffness: 120, damping: 14, delay: (i % 2) * 0.08 }}
            className={`relative mx-auto mb-12 w-full max-w-[280px] border-4 border-merry-forest bg-merry-cream p-3 pb-4 shadow-hard-merry sm:max-w-[320px] lg:absolute lg:mx-0 lg:mb-0 lg:w-[30%] ${m.pos || ""}`}
          >
            {/* clay "tape" strip */}
            <span
              aria-hidden="true"
              className="absolute -top-3.5 left-1/2 h-7 w-24 -translate-x-1/2 -rotate-3 border border-merry-forest/25 bg-merry-clay/85"
            />

            {/* photo area */}
            <div className="flex aspect-square items-center justify-center overflow-hidden border-2 border-merry-forest bg-merry-oat">
              {m.image ? (
                <img
                  src={m.image}
                  alt={m.alt || m.caption}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              ) : (
                <LeafIcon className="h-20 w-20 text-merry-forest/15" />
              )}
            </div>

            <figcaption className="mt-3 px-1">
              <span className="inline-block border-2 border-merry-forest bg-merry-forest px-2.5 py-0.5 font-slab text-sm uppercase text-merry-cream">
                {m.year}
              </span>
              <p className="mt-2.5 font-display text-[15px] italic leading-snug text-merry-forest/80">
                {m.caption}
              </p>
            </figcaption>
          </motion.figure>
        ))}
      </div>
    </div>
  </section>
);

export default CollageTimeline;
