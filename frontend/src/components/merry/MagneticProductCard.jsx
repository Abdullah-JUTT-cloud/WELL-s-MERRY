import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useCart } from "../../context/CartContext.jsx";
import { BottleIcon, LeafIcon } from "./icons.jsx";

/* =====================================================================
   MagneticProductCard — thick-bordered brutalist product card with:

   • MAGNETIC HOVER: the whole card is pulled a few px toward the cursor
     (spring-smoothed motion values), then snaps back on leave.
   • AGGRESSIVE IMAGE ZOOM: the bottle scales to 1.12 and lifts on the
     Y-axis while hovered.
   • QUICK ADD PANEL: a forest-green block with size options slides up
     from the card's bottom edge (also opens via keyboard focus, and
     stays reachable on touch since the panel toggles on tap).

   Props:
     product  — { _id, slug, name, price, size, images[], badge?, sizes? }
     sizes    — optional [{ label, price }] override for the quick-add row
     onAdd    — optional (product, sizeOption) => void; defaults to the
                global cart context's addItem
     strength — max magnetic pull in px (default 12)
   ===================================================================== */
const MagneticProductCard = ({ product, sizes, onAdd, strength = 12, className = "" }) => {
  const { addItem } = useCart();
  const reduce = useReducedMotion();
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  /* Magnetic pull — raw cursor offset feeds a spring, so the card glides
     rather than jitters, and eases home when the cursor leaves. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 18, mass: 0.6 });
  const y = useSpring(my, { stiffness: 260, damping: 18, mass: 0.6 });

  const handleMove = (e) => {
    if (reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    my.set(((e.clientY - r.top) / r.height - 0.5) * strength * 2);
  };

  const settle = () => {
    mx.set(0);
    my.set(0);
    setActive(false);
  };

  /* Size options: explicit prop → product.sizes → single fallback built
     from the product's own size/price. */
  const sizeOptions =
    sizes ??
    (product?.sizes?.length
      ? product.sizes
      : [{ label: product?.size || "120ml", price: product?.price }]);

  const image = product?.images?.[0];

  const quickAdd = (opt) => {
    const snapshot = { ...product, size: opt.label, price: opt.price ?? product.price };
    if (onAdd) onAdd(product, opt);
    else addItem(snapshot, 1);
  };

  return (
    <motion.article
      ref={ref}
      style={reduce ? undefined : { x, y }}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={settle}
      onFocus={() => setActive(true)}
      onBlur={(e) => {
        if (!ref.current?.contains(e.relatedTarget)) setActive(false);
      }}
      /* h-full + w-full: the card fills its grid cell edge-to-edge, so a
         row of cards is one solid band with no dead space between the
         border and the cell. The image stage below flexes to absorb any
         extra height the tallest sibling creates. */
      className={`group relative flex h-full w-full flex-col overflow-hidden border-4 border-merry-forest bg-merry-cream shadow-hard-merry transition-shadow duration-200 hover:shadow-hard-merry-clay ${className}`}
    >
      {product?.badge && (
        <span className="absolute left-3 top-3 z-20 -rotate-3 border-2 border-merry-forest bg-merry-clay px-3 py-1 font-slab text-[11px] uppercase tracking-wider text-merry-cream">
          {product.badge}
        </span>
      )}

      {/* Bottle stage — the aggressive scale + Y-lift on hover.
          `flex-1` lets the stage grow to fill whatever height the grid
          row settles on (aspect-[4/5] is the minimum), and the image is
          absolutely positioned so it always covers that box completely
          — no letterboxing, no cream gutters inside the frame. */}
      <Link
        to={product?.slug ? `/product/${product.slug}` : "/shop"}
        className="relative block w-full flex-1 aspect-[4/5] overflow-hidden border-b-4 border-merry-forest bg-merry-oat"
        aria-label={product?.name}
      >
        {image ? (
          <motion.img
            src={image}
            alt={product?.name || "Hair oil"}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            animate={active && !reduce ? { scale: 1.12, y: -16 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          />
        ) : (
          <motion.div
            className="absolute inset-0 flex h-full w-full items-center justify-center text-merry-forest/20"
            animate={active && !reduce ? { scale: 1.12, y: -16 } : { scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 18 }}
          >
            <BottleIcon className="h-32 w-32" />
          </motion.div>
        )}
      </Link>

      {/* Name + price row */}
      <div className="flex items-start justify-between gap-3 p-5">
        <div>
          <h3 className="font-slab text-base uppercase leading-tight sm:text-lg">
            {product?.name || "Hair Care Oil"}
          </h3>
          <p className="mt-1 text-xs uppercase tracking-widest2 text-merry-forest/50">
            {product?.tagline || "Cold-pressed · Organic"}
          </p>
        </div>
        <p className="whitespace-nowrap font-slab text-lg text-merry-clay">
          Rs. {Number(product?.price ?? 0).toLocaleString()}
        </p>
      </div>

      {/* QUICK ADD — slides up from the card's bottom edge */}
      <motion.div
        initial={false}
        animate={{ y: active ? "0%" : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        className="absolute inset-x-0 bottom-0 z-20 border-t-4 border-merry-forest bg-merry-forest p-4 text-merry-cream"
      >
        <p className="flex items-center gap-2 font-slab text-[11px] uppercase tracking-widest2 text-merry-sage">
          <LeafIcon className="h-3.5 w-3.5 text-merry-clay" />
          Quick add
        </p>
        <div className="mt-2 flex gap-2">
          {sizeOptions.map((opt) => (
            <button
              key={opt.label}
              type="button"
              onClick={() => quickAdd(opt)}
              className="flex-1 border-2 border-merry-cream/40 px-3 py-2.5 font-slab text-sm uppercase transition-colors duration-150 hover:border-merry-clay hover:bg-merry-clay focus-visible:border-merry-clay focus-visible:bg-merry-clay focus-visible:outline-none"
            >
              {opt.label}
            </button>
          ))}
        </div>
      </motion.div>
    </motion.article>
  );
};

export default MagneticProductCard;
