import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiArrowRight } from "react-icons/hi2";
import { MagneticProductCard, InfiniteMarquee, LeafIcon, SparkIcon } from "../../components/merry/index.js";
import { MERRY_PRODUCTS, SHOP_MARQUEE_ITEMS } from "../../data/merry/mock.js";

/* =====================================================================
   SHOP — banner with floating organic shapes + a giant "TAKE THE HAIR
   QUIZ" button, then chunky filter tabs (All / Hair Care / Skin Care)
   over a responsive grid of MagneticProductCards.
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

const Shop = () => {
  const [filter, setFilter] = useState("all");

  const products = useMemo(
    () =>
      filter === "all"
        ? MERRY_PRODUCTS
        : MERRY_PRODUCTS.filter((p) => p.category === filter),
    [filter]
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
              Nine potions.
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
          <p className="font-slab text-xs uppercase tracking-widest2 text-merry-forest/60 sm:text-sm">
            {products.length} {products.length === 1 ? "potion" : "potions"}
          </p>
        </div>
      </section>

      {/* ── Product grid: 1 col mobile → 3 col desktop ───────────────── */}
      <section className="bg-merry-cream px-6 pb-20 pt-8 sm:px-10 lg:pb-28">
        <div className="mx-auto max-w-[1440px]">
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
