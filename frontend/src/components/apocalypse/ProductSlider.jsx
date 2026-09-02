import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import { useProducts } from "../../hooks/useProducts.js";
import { DropIcon } from "./icons.jsx";

/* =====================================================================
   ProductSlider — chunky horizontal carousel of bordered product blocks.
   Hover: the bottle springs up and out of its window while an ember
   size-select / QUICK ADD panel slams up from the card's bottom edge.
   Tap (touch devices) toggles the same state via onClick.

   The bottles come from GET /api/products, like every other catalog
   surface. The old `APOC_PRODUCTS` array invented ids (and a
   `${_id}-${size}` composite on quick-add) that matched no document in
   Mongo, so anything added from here died at checkout.
   ===================================================================== */

const ACCENTS = {
  ember: "bg-apoc-ember",
  rust: "bg-apoc-rust",
  flame: "bg-apoc-flame",
  volt: "bg-apoc-volt",
};

/* Cycled per card: the sticker colours are decoration, so there's no need
   to store them against the product. */
const ACCENT_CYCLE = ["ember", "rust", "flame", "volt"];

/**
 * Shape a live Product document for the card below.
 *
 * Only the presentation is invented here (uppercase name, tilt, accent,
 * a tag when the product has no badge). The `_id` is passed through
 * untouched — it is the MongoDB ObjectId the checkout will look up.
 */
const toSliderProduct = (p, index = 0) => {
  const label = p.size || "200ml";
  return {
    _id: p._id,
    slug: p.slug,
    name: (p.name || "Hair oil").toUpperCase(),
    subtitle: p.shortDescription || (p.category || "").replace(/-/g, " ") || "Cold-pressed",
    blurb: p.shortDescription || p.description || "",
    tag: (p.badge || (p.isFeatured ? "BEST SELLER" : "SMALL BATCH")).toUpperCase(),
    accent: ACCENT_CYCLE[index % ACCENT_CYCLE.length],
    tilt: index % 2 ? 2 : -2,
    image: p.images?.[0],
    sizes: p.sizes?.length ? p.sizes : [{ label, price: p.price }],
    stock: p.stock ?? 0,
  };
};

const SliderCard = ({ product, onAdd }) => {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [sizeIdx, setSizeIdx] = useState(0);
  const size =
    product.sizes?.[sizeIdx] ?? product.sizes?.[0] ?? { label: "—", price: 0 };

  const handleAdd = () => {
    // `product._id` verbatim: the cart line has to carry the id Mongo
    // knows, or POST /api/orders has nothing to look up.
    onAdd({
      _id: product._id,
      slug: product.slug,
      name: product.name,
      images: [product.image],
      price: size.price,
      size: size.label,
      stock: product.stock,
    });
  };

  return (
    <motion.article
      initial="rest"
      whileHover={reduce ? undefined : "hover"}
      animate={open ? "hover" : "rest"}
      onClick={() => setOpen((v) => !v)}
      className="group relative shrink-0 w-[280px] sm:w-[330px] snap-center cursor-pointer
                 bg-apoc-bone text-apoc-soot border-4 border-apoc-soot shadow-hard-ember
                 flex flex-col"
      style={{ rotate: `${product.tilt * 0.4}deg` }}
    >
      {/* Header strip */}
      <div className="flex items-center justify-between gap-2 border-b-4 border-apoc-soot px-4 py-2.5">
        <h3 className="font-condensed uppercase text-xl sm:text-2xl leading-none tracking-wide truncate">
          {product.name}
        </h3>
        <span
          className={`${ACCENTS[product.accent] ?? ACCENTS.ember} border-2 border-apoc-soot px-2 py-0.5
                      text-[9px] font-black uppercase tracking-[0.14em] -rotate-2 shrink-0`}
        >
          {product.tag}
        </span>
      </div>

      {/* Bottle window — overflow visible so the bottle can escape it */}
      <div className="relative h-[280px] sm:h-[320px] overflow-visible">
        {/* recessed window backdrop */}
        <div className="absolute inset-0 border-b-4 border-apoc-soot bg-apoc-paper apoc-halftone text-apoc-soot/25 overflow-hidden">
          <span className="absolute top-2 left-3 font-distressed text-[11px] uppercase tracking-widest text-apoc-rust/80">
            {product.subtitle}
          </span>
        </div>
        {/* the bottle itself — springs up & out on hover.
            NOTE: horizontal centering lives in the variants (x:"-50%"),
            because Framer writes an inline transform that would override a
            Tailwind -translate-x-1/2 class. */}
        <motion.img
          src={product.image}
          alt={product.name}
          draggable={false}
          variants={{
            rest: { x: "-50%", y: 14, scale: 0.94, rotate: 0 },
            hover: { x: "-50%", y: -58, scale: 1.16, rotate: -2.5 },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 17 }}
          className="absolute left-1/2 bottom-0 w-[62%] aspect-[3/4] object-cover
                     border-4 border-apoc-soot shadow-hard-ink origin-bottom z-10"
        />
      </div>

      {/* Footer — price + blurb (covered by the slide-up panel on hover) */}
      <div className="relative px-4 py-3 border-t-0">
        <p className="font-grotesk font-semibold text-[12px] leading-snug text-apoc-soot/75 line-clamp-2">
          {product.blurb}
        </p>
        <p className="font-apoc text-lg mt-1.5">
          RS.{size.price.toLocaleString()}
          <span className="font-grotesk font-bold text-[10px] uppercase tracking-widest text-apoc-soot/50 ml-2">
            / {size.label}
          </span>
        </p>
      </div>

      {/* QUICK ADD panel — slams up from the bottom edge */}
      <motion.div
        variants={{
          rest: { y: "103%" },
          hover: { y: "0%" },
        }}
        transition={{ type: "spring", stiffness: 480, damping: 34 }}
        className="absolute inset-x-0 bottom-0 z-20 bg-apoc-ember border-t-4 border-apoc-soot p-4"
      >
        <p className="font-apoc uppercase text-xs tracking-wide mb-2.5">Pick your size</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {product.sizes.map((s, i) => (
            <button
              key={s.label}
              onClick={(e) => {
                e.stopPropagation();
                setSizeIdx(i);
              }}
              className={`border-[3px] border-apoc-soot px-3 py-1.5 font-black text-[11px] tracking-wider
                         transition-colors ${
                           i === sizeIdx
                             ? "bg-apoc-soot text-apoc-bone"
                             : "bg-apoc-bone text-apoc-soot hover:bg-apoc-flame"
                         }`}
            >
              {s.label} — RS.{s.price.toLocaleString()}
            </button>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
          className="w-full bg-apoc-soot text-apoc-bone border-[3px] border-apoc-soot shadow-hard-bone
                     font-apoc uppercase text-sm tracking-wide py-3 flex items-center justify-center gap-2
                     hover:bg-apoc-rust transition-colors"
        >
          <DropIcon className="w-4 h-4" /> Quick add
        </button>
      </motion.div>
    </motion.article>
  );
};

const ProductSlider = () => {
  const scroller = useRef(null);
  const { addItem } = useCart();
  const { products: inventory, loading } = useProducts();

  // Mapped (not fetched) here so the id survives the trip into the card.
  const products = inventory.map(toSliderProduct);

  const nudge = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector("article");
    const step = card ? card.offsetWidth + 24 : 340;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  return (
    <section id="apoc-shop" className="relative bg-apoc-soot text-apoc-bone apoc-noise apoc-noise-dark overflow-hidden">
      <div className="container-content px-4 sm:px-6 pt-14 sm:pt-20 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-2">
          <div>
            <span className="inline-block font-distressed text-apoc-flame text-sm sm:text-base uppercase tracking-[0.2em] mb-3 -rotate-1">
              The arsenal
            </span>
            <h2 className="font-apoc uppercase leading-[0.88] text-4xl sm:text-6xl lg:text-7xl">
              Pick your
              <br />
              <span className="text-apoc-ember">weapon.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => nudge(-1)}
              aria-label="Previous products"
              className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-apoc-bone bg-transparent text-apoc-bone
                         font-apoc text-xl hover:bg-apoc-ember hover:text-apoc-soot hover:border-apoc-soot
                         transition-colors shadow-hard-ember"
            >
              ←
            </button>
            <button
              onClick={() => nudge(1)}
              aria-label="Next products"
              className="w-12 h-12 sm:w-14 sm:h-14 border-4 border-apoc-bone bg-transparent text-apoc-bone
                         font-apoc text-xl hover:bg-apoc-ember hover:text-apoc-soot hover:border-apoc-soot
                         transition-colors shadow-hard-ember"
            >
              →
            </button>
          </div>
        </div>
        <p className="font-grotesk font-semibold text-sm sm:text-base text-apoc-bone/60 max-w-xl mb-8">
          Hover a bottle to arm it. Every batch is numbered, stamped and gone
          forever when it sells out — restocks are a rumour.
        </p>
      </div>

      {/* Carousel track */}
      <div
        ref={scroller}
        className="overflow-x-auto snap-x snap-mandatory pb-14 pt-16 scrollbar-none"
      >
        <div className="flex gap-6 px-4 sm:px-8 w-max">
          {loading ? (
            /* Three placeholder blocks keep the track's height stable
               while the real bottles load. */
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                aria-hidden="true"
                className="skeleton skeleton-dark shrink-0 w-[280px] sm:w-[330px] h-[420px] border-4 border-apoc-bone/30"
              />
            ))
          ) : products.length === 0 ? (
            <div className="shrink-0 w-[280px] sm:w-[420px] border-4 border-dashed border-apoc-bone/40 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="font-apoc uppercase text-2xl leading-tight">
                New batches
                <br />
                <span className="text-apoc-ember">coming soon...</span>
              </p>
              <p className="font-grotesk font-semibold text-xs uppercase tracking-[0.14em] text-apoc-bone/50">
                The press is cold. The shelf refills soon.
              </p>
            </div>
          ) : (
            products.map((p) => <SliderCard key={p._id} product={p} onAdd={addItem} />)
          )}
          {/* End cap */}
          <div className="shrink-0 w-[220px] sm:w-[260px] snap-center border-4 border-dashed border-apoc-bone/40 flex flex-col items-center justify-center gap-4 p-6 text-center">
            <DropIcon className="w-10 h-10 text-apoc-ember" />
            <p className="font-condensed uppercase text-lg leading-tight tracking-wide">
              Batch № 048 is pressing now
            </p>
            <a
              href="#apoc-quiz"
              className="font-black text-[11px] uppercase tracking-[0.16em] text-apoc-flame underline decoration-2 underline-offset-4"
            >
              Find your formula
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;
