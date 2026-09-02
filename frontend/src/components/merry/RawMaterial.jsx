import { motion, useReducedMotion } from "framer-motion";
import { LeafIcon } from "./icons.jsx";
import rosemaryMacro from "../../assets/merry/ingredient-rosemary.jpg";
import arganMacro from "../../assets/merry/ingredient-argan.jpg";
import almondMacro from "../../assets/merry/ingredient-almond.jpg";
import jojobaMacro from "../../assets/merry/ingredient-jojoba.jpg";

/* =====================================================================
   RawMaterial — "THE RAW MATERIAL." transparency block.

   Goal: prove the organic claim by showing the actual botanicals,
   not a marketing noun.

   Design
   • Full-width Deep Forest Green (#1A2E24) band with chunky forest
     rules top and bottom (matches the other trust blocks).
   • CSS grid: 2 cols on mobile, 4 cols on lg — four thick-bordered
     bento boxes (cream 4px frame so the specimens pop on the dark).
   • Each tile = macro ingredient photo under a dark overlay. On hover
     the overlay lightens, the photo pushes in, and heavy bold copy
     slides up detailing exactly what that oil does for the scalp.

   The image is the tile; the name stays put and the proof slides up,
   so the reveal never collides with the label.
   ===================================================================== */

const INGREDIENTS = [
  {
    name: "Rosemary",
    kicker: "01 · Root stimulant",
    img: rosemaryMacro,
    alt: "Extreme macro photograph of fresh rosemary steeping in cold-pressed oil",
    detail:
      "Stimulates the follicle and wakes dormant roots — the classic circulation boost for a thicker, denser hairline.",
  },
  {
    name: "Argan",
    kicker: "02 · Strength & shine",
    img: arganMacro,
    alt: "Extreme macro photograph of cracked argan kernels and golden argan oil",
    detail:
      "Vitamin-E dense and feather-light. Seals split ends and shields the strand without ever weighing it down.",
  },
  {
    name: "Almond",
    kicker: "03 · Softness",
    img: almondMacro,
    alt: "Extreme macro photograph of raw almonds with their brown speckled skin",
    detail:
      "Rich fatty acids that soften the scalp and tame frizz, leaving lengths gleaming and touchably smooth.",
  },
  {
    name: "Jojoba",
    kicker: "04 · Balance",
    img: jojobaMacro,
    alt: "Extreme macro photograph of jojoba seeds and clear golden jojoba oil beads",
    detail:
      "Closest oil to your skin's own sebum. Dissolves buildup and rebalances the scalp's moisture barrier.",
  },
];

const RawMaterialTile = ({ ing, index }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="group relative h-72 overflow-hidden border-4 border-merry-cream sm:h-80 lg:h-[24rem]"
    >
      {/* Macro background image */}
      <img
        src={ing.img}
        alt={ing.alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* Dark overlay — lightens on hover to reveal the specimen */}
      <div className="absolute inset-0 bg-merry-forest/85 transition-colors duration-500 group-hover:bg-merry-forest/45" />

      {/* Always-visible label — slides up to make room for the proof */}
      <div className="absolute inset-x-0 bottom-0 translate-y-0 p-4 transition-transform duration-500 ease-out group-hover:-translate-y-[8rem] sm:p-5">
        <p className="font-slab text-[10px] uppercase tracking-widest2 text-merry-clay">
          {ing.kicker}
        </p>
        <h3 className="mt-1 font-slab text-3xl uppercase leading-[0.9] text-merry-cream drop-shadow-[0_2px_10px_rgba(26,46,36,0.85)] sm:text-4xl">
          {ing.name}
        </h3>
      </div>

      {/* Heavy bold proof — hidden below, slides up on hover */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-merry-forest via-merry-forest/85 to-transparent p-4 transition-transform duration-500 ease-out group-hover:translate-y-0 sm:p-5">
        <p className="font-slab text-[13px] font-bold uppercase leading-tight text-merry-cream drop-shadow-[2px_2px_0_rgba(26,46,36,0.6)] sm:text-sm">
          {ing.detail}
        </p>
      </div>
    </motion.div>
  );
};

const RawMaterial = ({
  eyebrow = "The raw material",
  heading = ["Four oils.", "Zero mystery."],
  intro = "Four of the eight living oils we cold-press into every bottle. Here is exactly what each one does for your scalp — no extracts, no lab shorthand, just the whole plant.",
  ingredients = INGREDIENTS,
}) => (
  <section
    id="raw-material"
    aria-labelledby="raw-material-heading"
    className="border-y-4 border-merry-forest bg-merry-forest"
  >
    <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:py-24">
      {/* Section header */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
            <LeafIcon className="h-4 w-4" />
            {eyebrow}
          </p>
          <h2
            id="raw-material-heading"
            className="mt-4 text-4xl uppercase leading-[0.98] text-merry-cream sm:text-6xl lg:text-7xl"
          >
            {heading[0]}
            <br />
            <span className="text-merry-sage">{heading[1]}</span>
          </h2>
        </div>
        <p className="max-w-sm text-sm font-medium leading-relaxed text-merry-cream/70 sm:text-base">
          {intro}
        </p>
      </div>

      {/* Bento grid — 2 cols mobile, 4 cols desktop */}
      <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {ingredients.map((ing, i) => (
          <RawMaterialTile key={ing.name} ing={ing} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default RawMaterial;
