import { Link } from "react-router-dom";
import { LeafIcon, DropIcon, SparkIcon, HandHeartIcon } from "./icons.jsx";
import rosemaryMacro from "../../assets/merry/ingredient-rosemary.jpg";

/* =====================================================================
   IngredientSpotlight — the "no secrets" block (Section B).

   A heavily structured two-column slab:
     LEFT  — macro ingredient photograph, edge-to-edge, full-bleed to
             the block's own border (object-cover, no dead space), with
             a rotated clay stamp and a caption plate.
     RIGHT — massive "NO SECRETS. JUST SCIENCE." headline over a 2×2
             grid of hard-bordered bullet cards (sulfates, parabens,
             synthetics, silicones), then a supporting CTA row.

   On mobile the columns stack; the image keeps a fixed aspect so it
   never collapses. Every divider is a 4px forest rule so the section
   reads as one welded object rather than floating cards.
   ===================================================================== */

const DEFAULT_POINTS = [
  {
    icon: DropIcon,
    kicker: "0%",
    title: "No sulfates",
    text: "Nothing that strips the scalp's own oils and leaves it squeaking, tight and overproducing by Tuesday.",
  },
  {
    icon: SparkIcon,
    kicker: "0%",
    title: "No parabens",
    text: "No synthetic preservatives riding along for shelf life. Small batches, honest dates, cool dark storage.",
  },
  {
    icon: LeafIcon,
    kicker: "0%",
    title: "No synthetics",
    text: "No lab fragrance, no dyes, no silicone shine. What you smell is rosemary, sesame and amla — that's it.",
  },
  {
    icon: HandHeartIcon,
    kicker: "8",
    title: "Cold-pressed oils",
    text: "Rice bran, sesame, wheat germ, almond, coconut, walnut, olive and jojoba. Pressed cold, blended slow.",
  },
];

const IngredientSpotlight = ({
  eyebrow = "Ingredient spotlight",
  heading = ["No secrets.", "Just science."],
  image = rosemaryMacro,
  imageAlt = "Macro photograph of fresh rosemary steeping in cold-pressed oil",
  caption = "Rosemary officinalis · steeped 21 days",
  points = DEFAULT_POINTS,
  className = "",
}) => (
  <section
    aria-labelledby="ingredient-spotlight-heading"
    className={`border-t-4 border-merry-forest bg-merry-oat ${className}`}
  >
    <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:py-24">
      <div className="grid border-4 border-merry-forest bg-merry-cream shadow-hard-merry lg:grid-cols-2">
        {/* ── LEFT · macro image, edge-to-edge ─────────────────────── */}
        <div className="relative min-h-[20rem] overflow-hidden border-b-4 border-merry-forest bg-merry-forest lg:min-h-[36rem] lg:border-b-0 lg:border-r-4">
          <img
            src={image}
            alt={imageAlt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />

          {/* Rotated stamp */}
          <span className="absolute left-5 top-5 -rotate-3 border-4 border-merry-forest bg-merry-clay px-4 py-2 font-slab text-[11px] uppercase tracking-widest2 text-merry-cream shadow-hard-merry-sm">
            Whole ingredient · 100× macro
          </span>

          {/* Caption plate */}
          <div className="absolute inset-x-0 bottom-0 border-t-4 border-merry-forest bg-merry-forest/92 px-5 py-4 backdrop-blur-sm">
            <p className="flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-cream">
              <LeafIcon className="h-4 w-4 text-merry-clay" />
              {caption}
            </p>
          </div>
        </div>

        {/* ── RIGHT · the claim + 2×2 proof grid ───────────────────── */}
        <div className="flex flex-col">
          <div className="border-b-4 border-merry-forest px-6 py-10 sm:px-10 sm:py-12">
            <p className="flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
              <LeafIcon className="h-4 w-4" />
              {eyebrow}
            </p>
            <h2
              id="ingredient-spotlight-heading"
              className="mt-5 text-5xl uppercase leading-[0.9] sm:text-6xl lg:text-[4.2rem]"
            >
              {heading[0]}
              <br />
              <span className="text-merry-clay">{heading[1]}</span>
            </h2>
            <p className="mt-6 max-w-md text-sm font-medium leading-relaxed text-merry-forest/70 sm:text-base">
              The full formula is printed on the bottle, not hidden behind
              &ldquo;fragrance&rdquo;. Here&rsquo;s what we leave out — and what
              we refuse to compromise on.
            </p>
          </div>

          {/* 2×2 grid of hard-bordered proof cards */}
          <div className="grid flex-1 grid-cols-1 sm:grid-cols-2">
            {points.map(({ icon: Icon, kicker, title, text }, i) => (
              <div
                key={title}
                className={`p-6 sm:p-8 ${
                  // Internal rules: right border on the left column, bottom
                  // border on the top row — welded, no gaps.
                  i % 2 === 0 ? "sm:border-r-4 sm:border-merry-forest" : ""
                } ${i < points.length - 1 ? "border-b-4 border-merry-forest sm:border-b-0" : ""} ${
                  i < 2 ? "sm:border-b-4 sm:border-merry-forest" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border-4 border-merry-forest bg-merry-forest text-merry-cream">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="font-slab text-3xl leading-none text-merry-clay">{kicker}</span>
                </div>
                <h3 className="mt-4 font-slab text-lg uppercase leading-tight">{title}</h3>
                <p className="mt-2.5 text-[13px] font-medium leading-relaxed text-merry-forest/65">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="flex flex-col gap-4 border-t-4 border-merry-forest bg-merry-oat px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="text-[11px] font-bold uppercase tracking-widest2 text-merry-forest/60">
              Every batch, same recipe. Nothing hidden.
            </p>
            <Link
              to="/story"
              className="pressable inline-flex w-fit items-center gap-2 border-4 border-merry-forest bg-merry-forest px-6 py-3 font-slab text-sm uppercase tracking-wide text-merry-cream shadow-hard-merry-clay-sm"
            >
              Read the full formula
              <LeafIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default IngredientSpotlight;
