import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import bottleAmber from "../../assets/apoc/bottle-amber.jpg";
import bottleRust from "../../assets/apoc/bottle-rust.jpg";
import bottleDropper from "../../assets/apoc/bottle-dropper.jpg";
import bottlePump from "../../assets/apoc/bottle-black-pump.jpg";
import macroRosemary from "../../assets/merry/ingredient-rosemary.jpg";
import flatlay from "../../assets/oil-flatlay-diagonal.jpg";

/* =====================================================================
   CommunityGrid — "JOIN THE GROVE." UGC bento wall.

   Design
   • Full-bleed Forest (#1A2E24) band, cream slab headline, clay accents.
   • Asymmetric bento: 6 tiles across a 4-col / 3-row desktop grid —
     one tall hero, one wide macro, two squares, plus two stylized
     text-review tiles (clay + cream) that break the photo rhythm.
   • Photos sit at `grayscale` and resolve to full color on hover/focus,
     with a slow scale push, so the wall feels alive under the cursor.

   Everything is placeholder lifestyle content sourced from the local
   asset folder — swap `TILES[].src` for real customer UGC when it lands.
   ===================================================================== */

const TILES = [
  {
    type: "image",
    src: bottleAmber,
    alt: "Customer holding the Well's Merry amber bottle in morning light",
    handle: "@ayeshanoor",
    caption: "Week 6. Hairline is filling in.",
    // tall hero
    area: "sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2",
  },
  {
    type: "image",
    src: macroRosemary,
    alt: "Extreme macro shot of cold-pressed rosemary oil",
    handle: "@thegrovelab",
    caption: "Cold-pressed, up close.",
    area: "sm:col-span-2 lg:col-span-2 lg:row-span-1",
  },
  {
    type: "quote",
    quote: "Three bottles in. My barber asked what changed.",
    author: "Bilal K.",
    tone: "clay",
    area: "sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    type: "image",
    src: bottleDropper,
    alt: "Dropper close-up over a palm, mid-application",
    handle: "@hina.rx",
    caption: "Seven drops, every night.",
    area: "sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    type: "image",
    src: flatlay,
    alt: "Flatlay of the bottle, kraft box and fresh botanicals",
    handle: "@merrymornings",
    caption: "Unboxing never gets old.",
    area: "sm:col-span-2 lg:col-span-1 lg:row-span-1",
  },
  {
    type: "quote",
    quote: "Shedding stopped in three weeks. I stopped counting strands.",
    author: "Mahnoor S.",
    tone: "cream",
    area: "sm:col-span-2 lg:col-span-2 lg:row-span-1",
  },
  {
    type: "image",
    src: bottleRust,
    alt: "Macro shot of healthy, high-shine hair strands",
    handle: "@usman.g",
    caption: "Shine with zero grease.",
    area: "sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
  {
    type: "image",
    src: bottlePump,
    alt: "Bottle on a bathroom shelf beside a linen towel",
    handle: "@zoyaaa",
    caption: "Lives on the shelf now.",
    area: "sm:col-span-1 lg:col-span-1 lg:row-span-1",
  },
];

const ImageTile = ({ tile }) => (
  <figure
    tabIndex={0}
    className={`group relative overflow-hidden border-4 border-merry-cream bg-merry-pine
      outline-none focus-visible:ring-4 focus-visible:ring-merry-clay ${tile.area}`}
  >
    <img
      src={tile.src}
      alt={tile.alt}
      loading="lazy"
      className="h-full min-h-[13rem] w-full object-cover grayscale contrast-[1.05] transition-all duration-500 ease-out
        group-hover:scale-[1.06] group-hover:grayscale-0 group-focus-visible:scale-[1.06] group-focus-visible:grayscale-0"
    />

    {/* Legibility scrim — only present once the tile wakes up */}
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-merry-forest/85 via-merry-forest/10 to-transparent
        opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
    />

    <figcaption
      className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-500
        group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
    >
      <span className="font-slab text-[11px] uppercase tracking-widest text-merry-clay">
        {tile.handle}
      </span>
      <p className="mt-1 font-slab text-sm uppercase leading-tight text-merry-cream sm:text-base">
        {tile.caption}
      </p>
    </figcaption>
  </figure>
);

const QuoteTile = ({ tile }) => {
  const clay = tile.tone === "clay";
  return (
    <blockquote
      className={`flex flex-col justify-between border-4 p-6 transition-transform duration-300 hover:-translate-y-1 sm:p-7
        ${clay
          ? "border-merry-cream bg-merry-clay text-merry-cream"
          : "border-merry-forest bg-merry-cream text-merry-forest"} ${tile.area}`}
    >
      <span
        className={`font-slab text-2xl leading-none ${clay ? "text-merry-cream/70" : "text-merry-clay"}`}
        aria-hidden="true"
      >
        ★★★★★
      </span>
      <p className="mt-4 font-slab text-lg uppercase leading-[1.15] sm:text-xl lg:text-2xl">
        &ldquo;{tile.quote}&rdquo;
      </p>
      <footer
        className={`mt-5 text-[11px] uppercase tracking-widest ${clay ? "text-merry-cream/80" : "text-merry-forest/60"}`}
      >
        — {tile.author}, verified buyer
      </footer>
    </blockquote>
  );
};

const CommunityGrid = ({
  eyebrow = "12,400 in the grove",
  heading = "Join the grove.",
  tiles = TILES,
}) => {
  const reduce = useReducedMotion();

  return (
    <section
      id="community"
      aria-labelledby="community-heading"
      className="border-y-4 border-merry-forest bg-merry-forest py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Header row */}
        <div className="flex flex-col gap-6 border-b-4 border-merry-cream/25 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="inline-block border-4 border-merry-cream bg-merry-forest px-3 py-1.5 font-slab text-[11px] uppercase tracking-widest text-merry-clay">
              {eyebrow}
            </span>
            <h2
              id="community-heading"
              className="mt-6 font-slab text-[16vw] uppercase leading-[0.85] text-merry-cream sm:text-7xl lg:text-8xl xl:text-[8rem]"
            >
              {heading}
            </h2>
          </div>
          <p className="max-w-sm text-[15px] leading-relaxed text-merry-sage">
            Real bottles, real bathrooms, real regrowth. Tag{" "}
            <span className="font-slab uppercase text-merry-clay">#WellsMerry</span>{" "}
            and you might end up on this wall.
          </p>
        </div>

        {/* Asymmetric bento wall */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 grid auto-rows-[13rem] grid-cols-1 gap-4 sm:grid-cols-4 sm:gap-5 lg:auto-rows-[15rem] lg:grid-cols-4"
        >
          {tiles.map((tile, i) =>
            tile.type === "quote" ? (
              <QuoteTile key={`q-${i}`} tile={tile} />
            ) : (
              <ImageTile key={tile.src + i} tile={tile} />
            )
          )}
        </motion.div>

        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            to="/shop"
            className="border-4 border-merry-cream bg-merry-clay px-7 py-4 font-slab text-sm uppercase tracking-wide text-merry-cream transition-colors duration-200 hover:bg-merry-clay-deep"
          >
            Start your bottle
          </Link>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-4 border-merry-clay pb-1 font-slab text-sm uppercase tracking-wide text-merry-cream transition-colors duration-200 hover:text-merry-clay"
          >
            See the whole feed →
          </a>
        </div>
      </div>
    </section>
  );
};

export default CommunityGrid;
