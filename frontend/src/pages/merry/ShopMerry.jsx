import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { MagneticProductCard, InfiniteMarquee, LeafIcon, SparkIcon } from "../../components/merry/index.js";
import { SHOP_MARQUEE_ITEMS } from "../../data/merry/mock.js";
import { MerryProductGridSkeleton } from "../../components/Skeleton.jsx";
import { useProducts } from "../../hooks/useProducts.js";

/* =====================================================================
   SHOP — banner with floating organic shapes + a giant "TAKE THE HAIR
   QUIZ" button, then chunky filter tabs (All / Hair Care / Skin Care)
   over a responsive grid of MagneticProductCards.

   Inventory comes from GET /api/products — the same collection the admin
   panel writes to. The grid used to render a hardcoded catalog, so the
   shop sold `_id`s that existed in no database and checkout died with
   "Resource not found".
   ===================================================================== */

const FILTERS = [
  { value: "all", label: "All" },
  { value: "hair-care", label: "Hair Care" },
  { value: "skin-care", label: "Skin Care" },
];

/* Slow-drifting organic shapes for the banner — pure CSS blobs. */
const BannerBlob = ({ className = "", delay = 0, drift = 18 }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute ${className}`}
      style={{ borderRadius: "58% 42% 55% 45% / 45% 58% 42% 55%" }}
      animate={reduce ? undefined : { y: [0, -drift, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay }}
    />
  );
};

/* Shown when the request fails. The grid is empty but the shop is still
   navigable — and the copy tells the shopper why, instead of silently
   serving products that can't be ordered. */
const InventoryError = ({ onRetry }) => (
  <div className="border-4 border-merry-forest bg-merry-oat p-8 text-center sm:p-12">
    <LeafIcon className="mx-auto h-10 w-10 -rotate-12 text-merry-clay" />
    <p className="mt-4 font-slab text-lg uppercase sm:text-xl">
      The shelf didn't load
    </p>
    <p className="mx-auto mt-2 max-w-md text-sm font-medium text-merry-forest/70">
      We couldn't reach the store inventory. Check your connection and try
      again — nothing has been added to your cart.
    </p>
    <button
      type="button"
      onClick={onRetry}
      className="pressable mt-6 inline-flex items-center gap-2 border-4 border-merry-forest bg-merry-cream px-6 py-3 font-slab text-sm uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-cream"
    >
      Try again
    </button>
  </div>
);

/* ShopMerry's empty state: the API answered, the catalogue is simply empty
   (or has nothing in the selected category yet). */
const EmptyShelf = ({ filtered }) => (
  <div className="border-4 border-merry-forest bg-merry-oat p-10 text-center sm:p-16">
    <p className="font-slab text-3xl uppercase leading-tight sm:text-5xl">
      New batches
      <br />
      <span className="text-merry-clay">coming soon...</span>
    </p>
    <p className="mx-auto mt-5 max-w-md text-sm font-medium text-merry-forest/70 sm:text-base">
      {filtered
        ? "Nothing in this category yet — try another filter, or take the quiz and we'll pick for you."
        : "The copper pot is working. Our next cold-pressed batch lands here the moment it's bottled."}
    </p>
    <Link
      to="/quiz"
      className="pressable mt-8 inline-flex items-center gap-3 border-4 border-merry-forest bg-merry-clay px-7 py-3.5 font-slab text-sm uppercase tracking-wide text-merry-cream shadow-hard-merry"
    >
      <SparkIcon className="h-4 w-4" />
      Take the hair quiz
    </Link>
  </div>
);

const Shop = () => {
  const [filter, setFilter] = useState("all");

  // Live inventory. Fetched once on mount; the filter tabs below are a
  // client-side view over the same array, so switching tabs is instant
  // (and never refetches the whole catalogue).
  const {
    products: inventory,
    loading,
    error,
    refetch,
  } = useProducts();

  const products = useMemo(
    () =>
      filter === "all"
        ? inventory
        : inventory.filter((p) => p.category === filter),
    [inventory, filter]
  );

  return (
    <>
      {/* ── Top banner: floating organic shapes + giant quiz CTA ─────── */}
      <section className="relative overflow-hidden border-b-4 border-merry-forest bg-merry-forest">
        <BannerBlob className="-left-24 -top-24 h-80 w-80 bg-merry-pine" delay={0} />
        <BannerBlob className="right-[12%] top-10 h-40 w-40 bg-merry-moss/70" delay={1.5} drift={12} />
        <BannerBlob className="bottom-[-4rem] left-[38%] h-56 w-56 border-4 border-merry-moss/60" delay={0.8} />
        <BannerBlob className="bottom-10 right-[6%] h-24 w-24 bg-merry-clay/90" delay={2.2} drift={10} />
        <BannerBlob className="left-[16%] top-[52%] h-14 w-14 bg-merry-sage/70" delay={1.1} drift={8} />

        <div className="relative mx-auto grid max-w-[1440px] gap-10 px-6 py-16 sm:px-10 lg:grid-cols-[1.4fr_1fr] lg:items-center lg:py-24">
          <div>
            <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-sage sm:text-sm">
              <LeafIcon className="h-4 w-4 text-merry-clay" />
              The whole shelf
            </p>
            <h1 className="mt-5 text-5xl uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
              Every potion.
              <br />
              <span className="text-merry-clay">Zero chemicals.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base font-medium leading-relaxed text-merry-cream/85 sm:text-lg">
              Every bottle is cold-pressed, small-batch and priced for real
              bathrooms. Filter by mood below — or let the quiz choose for you.
            </p>
          </div>

          {/* The giant, unmissable quiz button */}
          <div className="relative">
            <Link
              to="/quiz"
              className="pressable group relative flex w-full flex-col items-center justify-center gap-3 border-4 border-merry-cream bg-merry-clay px-8 py-12 text-center font-slab text-merry-cream shadow-hard-merry-cream sm:py-16 lg:py-20"
            >
              <SparkIcon className="h-8 w-8 -rotate-12 text-merry-cream transition-transform duration-300 group-hover:rotate-12" />
              <span className="text-4xl uppercase leading-[0.95] sm:text-5xl">
                Take the
                <br />
                hair quiz
              </span>
              <span className="mt-1 inline-flex items-center gap-2 border-t-2 border-merry-cream/50 pt-3 text-[11px] font-bold uppercase tracking-widest2 text-merry-cream/90 sm:text-xs">
                60 seconds · personalized ritual
                <HiArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Filter tabs ───────────────────────────────────────────────── */}
      <section className="bg-merry-cream px-6 pb-4 pt-12 sm:px-10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div
            role="tablist"
            aria-label="Filter products"
            className="flex w-fit flex-wrap gap-3"
          >
            {FILTERS.map((f) => {
              const active = filter === f.value;
              return (
                <button
                  key={f.value}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(f.value)}
                  className={`pressable border-4 border-merry-forest px-6 py-3 font-slab text-sm uppercase tracking-wide sm:text-base ${
                    active
                      ? "bg-merry-forest text-merry-cream shadow-hard-merry-clay"
                      : "bg-merry-cream text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
          <p
            aria-live="polite"
            className="font-slab text-xs uppercase tracking-widest2 text-merry-forest/60 sm:text-sm"
          >
            {loading
              ? "Loading the shelf…"
              : `${products.length} ${products.length === 1 ? "potion" : "potions"}`}
          </p>
        </div>
      </section>

      {/* ── Product grid: 1 col mobile → 3 col desktop ───────────────── */}
      <section className="bg-merry-cream px-6 pb-20 pt-8 sm:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1440px]">
          {loading ? (
            /* Mirrors the real grid's columns/gaps so the cards land exactly
               where the placeholders were. */
            <MerryProductGridSkeleton
              count={6}
              className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
            />
          ) : error ? (
            <InventoryError onRetry={refetch} />
          ) : products.length === 0 ? (
            <EmptyShelf filtered={filter !== "all"} />
          ) : (
            <motion.div layout className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
              <AnimatePresence mode="popLayout">
                {products.map((product) => (
                  <motion.div
                    layout
                    key={product._id}
                    initial={{ opacity: 0, y: 28, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ type: "spring", stiffness: 180, damping: 22 }}
                  >
                    <MagneticProductCard product={product} className="h-full" />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom band — marquee hand-off toward the footer */}
      <InfiniteMarquee
        items={SHOP_MARQUEE_ITEMS}
        bg="bg-merry-forest"
        fg="text-merry-cream"
        duration={28}
      />
    </>
  );
};

export default Shop;
