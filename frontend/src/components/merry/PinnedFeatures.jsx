import { motion } from "framer-motion";
import { MERRY_ICON_MAP, LeafIcon, BottleIcon } from "./icons.jsx";

/* =====================================================================
   PinnedFeatures — the extreme pinned-scroll features block.

   Anatomy (desktop):
     <section relative flex items-start>
       LEFT  — w-1/2 sticky top-20 h-[calc(100vh-6rem)] flex flex-col px-10
               massive heading + large rounded image, pinned in place
       RIGHT — w-1/2 flex flex-col gap-32 py-32
               4–5 heavily padded bento feature cards

   The PARENT dictates the scroll height: the right column's stacked
   cards + gap-32 + py-32 make the section far taller than one viewport,
   so the sticky left column stays pinned until the final card passes.
   On <lg screens everything gracefully stacks (sticky disabled).
   ===================================================================== */

const DEFAULT_FEATURES = [
  {
    icon: "sprout",
    tone: "cream",
    title: "Grows New Hair",
    text: "Rice bran and wheat germ oils feed dormant follicles the fatty acids they've been starving for. Give it eight weeks — your hairline will report back.",
  },
  {
    icon: "drop",
    tone: "forest",
    title: "Cold-Pressed, Never Heated",
    text: "Heat murders nutrients. Every oil in the bottle is pressed slowly at room temperature, so the vitamins arrive at your scalp alive.",
  },
  {
    icon: "leaf",
    tone: "clay",
    title: "8 Organic Oils, Zero Chemicals",
    text: "Sesame, almond, coconut, walnut, olive and friends. No sulfates, no silicones, no parabens — nothing your grandmother couldn't pronounce.",
  },
  {
    icon: "sun",
    tone: "oat",
    title: "Shine Without The Grease",
    text: "A lightweight blend that sinks in instead of sitting on top. Frizz calms down, light bounces back, pillowcases stay clean.",
  },
  {
    icon: "hand",
    tone: "cream",
    title: "Safe For The Whole Family",
    text: "Gentle enough for kids, strong enough for damage repair. One bottle on the shelf, everyone's hair covered — cash on delivery, no risk.",
  },
];

/* Bento tones — alternating surfaces keep the long scroll lively. */
const TONES = {
  cream: "bg-merry-cream text-merry-forest border-merry-forest shadow-hard-merry",
  oat: "bg-merry-oat text-merry-forest border-merry-forest shadow-hard-merry",
  forest: "bg-merry-forest text-merry-cream border-merry-forest shadow-hard-merry-clay",
  clay: "bg-merry-clay text-merry-cream border-merry-forest shadow-hard-merry",
};

/* Icon tint per tone — clay icons vanish on the clay card, so it swaps
   to forest there. */
const ICON_TONES = {
  cream: "text-merry-clay",
  oat: "text-merry-clay",
  forest: "text-merry-clay",
  clay: "text-merry-forest",
};

const PinnedFeatures = ({
  eyebrow = "Why Well's Merry",
  heading = "Your hair knows the difference.",
  image, // optional image URL for the pinned frame
  imageAlt = "Well's Merry organic hair oil",
  features = DEFAULT_FEATURES,
  className = "",
}) => (
  <section className={`bg-merry-cream ${className}`}>
    {/* PARENT: its height comes from the tall right column, which is what
        keeps the sticky left column pinned until the last card passes. */}
    <div className="relative mx-auto flex max-w-[1440px] flex-col items-start lg:flex-row">
      {/* LEFT — pinned column */}
      <div className="flex w-full flex-col justify-center px-6 pt-16 pb-6 sm:px-10 lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:w-1/2 lg:px-10 lg:py-0">
        <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
          <LeafIcon className="h-4 w-4" />
          {eyebrow}
        </p>
        <h2 className="mt-4 text-4xl uppercase leading-[0.98] sm:text-6xl xl:text-7xl">
          {heading}
        </h2>

        {/* Large rounded image container — pinned along with the heading */}
        <div className="relative mt-8 h-56 flex-none overflow-hidden rounded-[2.5rem] border-4 border-merry-forest bg-merry-oat shadow-hard-merry-lg sm:h-72 lg:mt-10 lg:h-auto lg:max-h-[44vh] lg:flex-1">
          {image ? (
            <img src={image} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-merry-forest/15">
              <BottleIcon className="h-36 w-36" />
            </div>
          )}
          <span className="absolute bottom-4 left-4 rotate-[-2deg] border-2 border-merry-forest bg-merry-clay px-3 py-1.5 font-slab text-xs uppercase tracking-wider text-merry-cream">
            100% Organic
          </span>
        </div>
      </div>

      {/* RIGHT — the tall scrolling column of bento cards */}
      <div className="flex w-full flex-col gap-16 px-6 py-16 sm:px-10 lg:w-1/2 lg:gap-32 lg:py-32">
        {features.map((f, i) => {
          const Icon = MERRY_ICON_MAP[f.icon] || LeafIcon;
          return (
            <motion.article
              key={f.title}
              initial={{ opacity: 0, y: 56 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ type: "spring", stiffness: 90, damping: 16 }}
              className={`relative rounded-[2rem] border-4 p-8 sm:p-12 ${TONES[f.tone] || TONES.cream}`}
            >
              <span className="absolute -top-5 left-8 border-2 border-merry-forest bg-merry-clay px-3 py-1 font-slab text-sm text-merry-cream">
                0{i + 1}
              </span>
              <Icon className={`h-12 w-12 ${ICON_TONES[f.tone] || "text-merry-clay"}`} />
              <h3 className="mt-5 text-2xl uppercase leading-tight sm:text-3xl">{f.title}</h3>
              <p className="mt-4 max-w-md text-base leading-relaxed opacity-80 sm:text-lg">
                {f.text}
              </p>
            </motion.article>
          );
        })}
      </div>
    </div>
  </section>
);

export default PinnedFeatures;
