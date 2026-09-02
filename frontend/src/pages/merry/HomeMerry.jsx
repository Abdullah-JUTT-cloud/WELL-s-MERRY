import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import {
  InfiniteMarquee,
  MagneticProductCard,
  PinnedFeatures,
  WavyDivider,
  RealResultsBanner,
  IngredientSpotlight,
  NoBsFaq,
  CommunityGrid,
  LeafIcon,
} from "../../components/merry/index.js";
import {
  MERRY_PRODUCTS,
  HOME_FEATURES,
  HERO_MARQUEE_ITEMS,
  SHOP_MARQUEE_ITEMS,
  MERRY_REVIEW_SNIPPETS,
} from "../../data/merry/mock.js";
import bottleAmber from "../../assets/apoc/bottle-amber.jpg";
import bottleRust from "../../assets/apoc/bottle-rust.jpg";
import bottleDropper from "../../assets/apoc/bottle-dropper.jpg";
import bottlePump from "../../assets/apoc/bottle-black-pump.jpg";
import oilBoxStanding from "../../assets/oil-box-bottle-standing.jpg";

/* =====================================================================
   HOME — the Merry takeover.

   Flow: split hero (massive type left, floating bottles right)
     → InfiniteMarquee
     → horizontal grid of MagneticProductCards
     → reverse marquee (rhythm break)
     → PinnedFeatures scroll block
     → wavy hand-off into the Footer's clay newsletter band.
   ===================================================================== */

/* One floating bottle = parallax wrapper (follows the cursor at its own
   depth) × float loop (slow sine bob + tilt). `reduce` disables both.
   The photos are studio shots on a cream backdrop, so each floater is
   framed as a bordered cream card — the photo bg melts into the frame
   and the card reads as a deliberate, brutalist collage piece. */
const FLOATERS = [
  { src: bottleAmber, alt: "Well's Merry organic hair oil — amber bottle", frame: "w-44 sm:w-60 lg:w-72 aspect-[3/4]", pos: "left-[6%] top-[10%] sm:top-[8%]", depth: 34, rotate: -6, bob: 16, dur: 5.2, delay: 0.15, z: "z-20" },
  { src: bottleRust, alt: "Well's Merry Ember Elixir hair oil", frame: "w-36 sm:w-48 lg:w-60 aspect-[3/4]", pos: "right-[4%] top-[36%]", depth: 22, rotate: 7, bob: 13, dur: 6.4, delay: 0.35, z: "z-10" },
  { src: bottleDropper, alt: "Well's Merry rosemary scalp serum dropper bottle", frame: "w-28 sm:w-36 lg:w-44 aspect-[3/4]", pos: "left-[1%] bottom-[4%]", depth: 44, rotate: -12, bob: 11, dur: 4.6, delay: 0.55, z: "z-30" },
  { src: bottlePump, alt: "Well's Merry midnight scalp oil pump bottle", frame: "w-28 sm:w-40 lg:w-48 aspect-[3/4]", pos: "right-[24%] top-[1%]", depth: 16, rotate: 4, bob: 14, dur: 5.8, delay: 0.75, z: "z-0" },
];

const FloatingBottle = ({ f, px, py }) => {
  const reduce = useReducedMotion();
  // Parallax at this floater's depth (spring-smoothed), opposite to cursor.
  const x = useTransform(px, (v) => (reduce ? 0 : v * f.depth));
  const y = useTransform(py, (v) => (reduce ? 0 : v * f.depth));

  return (
    <motion.div
      style={{ x, y }}
      className={`absolute ${f.pos} ${f.z}`}
      initial={reduce ? false : { opacity: 0, y: 120, rotate: f.rotate * 2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ type: "spring", stiffness: 60, damping: 14, delay: f.delay }}
    >
      <motion.div
        animate={reduce ? undefined : { y: [0, -f.bob, 0], rotate: [f.rotate, f.rotate * 0.4, f.rotate] }}
        transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut", delay: f.delay }}
        className={`overflow-hidden border-4 border-merry-cream bg-merry-cream shadow-hard-merry-cream ${f.frame}`}
      >
        <img
          src={f.src}
          alt={f.alt}
          className="h-full w-full object-cover"
          draggable="false"
        />
      </motion.div>
    </motion.div>
  );
};

/* Organic blob — CSS border-radius morph, the no-SVG way. */
const Blob = ({ className = "", morph = false, delay = 0 }) => (
  <motion.div
    aria-hidden="true"
    className={`pointer-events-none absolute ${className}`}
    style={{ borderRadius: "58% 42% 55% 45% / 45% 58% 42% 55%" }}
    animate={morph ? { borderRadius: ["58% 42% 55% 45% / 45% 58% 42% 55%", "45% 55% 48% 52% / 55% 45% 58% 42%", "58% 42% 55% 45% / 45% 58% 42% 55%"] } : undefined}
    transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay }}
  />
);

const Hero = () => {
  const reduce = useReducedMotion();
  const stageRef = useRef(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness: 60, damping: 20 });
  const py = useSpring(rawY, { stiffness: 60, damping: 20 });

  const handleMove = (e) => {
    if (reduce || !stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * -2); // -1 … 1
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * -2);
  };

  return (
    <section className="grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2">
      {/* LEFT — the words */}
      <div className="flex flex-col justify-center px-6 pb-16 pt-14 sm:px-10 lg:px-16 lg:pb-10">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex w-fit items-center gap-2.5 border-4 border-merry-forest bg-merry-oat px-4 py-2 font-slab text-[11px] uppercase tracking-widest2 shadow-hard-merry-sm sm:text-xs"
        >
          <LeafIcon className="h-4 w-4 text-merry-clay" />
          Est. 2019 · Small-batch · 100% Organic
        </motion.p>

        <motion.h1
          initial={reduce ? false : { opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.1 }}
          className="mt-8 text-[17vw] uppercase leading-[0.9] sm:text-7xl lg:text-[5.6rem] xl:text-[6.5rem]"
        >
          Rooted
          <br />
          in{" "}
          <span className="relative inline-block text-merry-clay">
            Nature
            {/* hand-drawn underline blob */}
            <svg viewBox="0 0 220 22" aria-hidden="true" className="absolute -bottom-2 left-0 w-full">
              <path
                d="M4 14 C 60 4, 120 20, 216 8"
                fill="none"
                stroke="currentColor"
                strokeWidth="7"
                strokeLinecap="round"
                className="text-merry-forest opacity-90"
              />
            </svg>
          </span>
        </motion.h1>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-8 max-w-md text-base font-medium leading-relaxed text-merry-forest/80 sm:text-lg"
        >
          Cold-pressed organic hair oil, blended in small batches from eight
          living oils. No sulfates, no silicones, no shortcuts — just the
          patience of a copper pot.
        </motion.p>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            to="/shop"
            className="pressable flex items-center justify-center gap-3 border-4 border-merry-forest bg-merry-clay px-8 py-4 text-center font-slab text-lg uppercase tracking-wide text-merry-cream shadow-hard-merry"
          >
            Shop the oil
            <LeafIcon className="h-5 w-5" />
          </Link>
          <Link
            to="/quiz"
            className="pressable flex items-center justify-center gap-3 border-4 border-merry-forest bg-merry-cream px-8 py-4 text-center font-slab text-lg uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
          >
            Take the hair quiz
          </Link>
        </motion.div>

        {/* Stats strip */}
        <motion.dl
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-12 grid max-w-md grid-cols-3 border-4 border-merry-forest bg-merry-cream shadow-hard-merry-sm"
        >
          {[
            ["8", "organic oils"],
            ["0", "chemicals, ever"],
            ["4.9★", "231 reviews"],
          ].map(([num, label], i) => (
            <div
              key={label}
              className={`px-4 py-4 text-center ${i > 0 ? "border-l-4 border-merry-forest" : ""}`}
            >
              <dt className="sr-only">{label}</dt>
              <dd className="font-slab text-2xl sm:text-3xl">{num}</dd>
              <dd className="mt-1 text-[10px] font-bold uppercase tracking-wider text-merry-forest/60 sm:text-[11px]">
                {label}
              </dd>
            </div>
          ))}
        </motion.dl>
      </div>

      {/* RIGHT — floating bottle stage */}
      <div
        ref={stageRef}
        onMouseMove={handleMove}
        onMouseLeave={() => {
          rawX.set(0);
          rawY.set(0);
        }}
        className="relative min-h-[26rem] overflow-hidden border-t-4 border-merry-forest bg-merry-forest sm:min-h-[30rem] lg:min-h-0 lg:border-l-4 lg:border-t-0"
      >
        {/* organic field: blobs, rings, grain dots */}
        <Blob className="-left-24 top-8 h-96 w-96 bg-merry-pine" morph delay={0} />
        <Blob className="-right-20 bottom-[-6rem] h-[28rem] w-[28rem] bg-merry-pine/80" morph delay={2} />
        <Blob className="left-[34%] top-[30%] h-64 w-64 border-4 border-merry-moss/70" delay={1} />
        <Blob className="right-[30%] top-[8%] h-24 w-24 bg-merry-clay/90" morph delay={3} />
        <Blob className="left-[16%] bottom-[16%] h-14 w-14 bg-merry-sage/80" delay={2} />

        {FLOATERS.map((f) => (
          <FloatingBottle key={f.src} f={f} px={px} py={py} />
        ))}

        {/* stamp */}
        <motion.div
          initial={reduce ? false : { scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: -8 }}
          transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.9 }}
          className="absolute bottom-6 right-6 z-30 grid h-24 w-24 place-items-center rounded-full border-4 border-dashed border-merry-cream/80 bg-merry-clay text-center font-slab text-[10px] uppercase leading-tight tracking-wider text-merry-cream shadow-hard-merry-cream sm:h-28 sm:w-28 sm:text-[11px]"
        >
          Cold
          <br />
          pressed
          <br />
          daily
        </motion.div>
      </div>
    </section>
  );
};

const Home = () => {
  /* Eight cards = two clean rows of four on lg, two of two on md, so the
     grid never ends in a half-empty row (six items across four columns
     was what left the awkward gaps). */
  const lineup = MERRY_PRODUCTS.slice(0, 8);

  return (
    <>
      <Hero />

      {/* Flow 2 — brand marquee */}
      <InfiniteMarquee
        items={HERO_MARQUEE_ITEMS}
        bg="bg-merry-clay"
        fg="text-merry-cream"
        iconClass="w-5 h-5 sm:w-7 sm:h-7"
        duration={26}
      />

      {/* Flow 3 — the lineup: horizontal grid of magnetic cards */}
      <section className="bg-merry-cream px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
                <LeafIcon className="h-4 w-4" />
                The lineup
              </p>
              <h2 className="mt-4 max-w-2xl text-4xl uppercase leading-[0.98] sm:text-6xl">
                Small shelf.
                <br />
                <span className="text-merry-moss">Serious results.</span>
              </h2>
            </div>
            <Link
              to="/shop"
              className="group inline-flex w-fit items-center gap-2 border-b-4 border-merry-clay pb-1 font-slab text-sm uppercase tracking-wide text-merry-forest transition-colors hover:text-merry-clay"
            >
              View all nine potions
              <span className="transition-transform duration-200 group-hover:translate-x-1.5">→</span>
            </Link>
          </div>

          {/* Bento grid — 1 / 2 / 4 columns.
              `auto-rows-fr` + `items-stretch` force every row to a single
              shared height and every card to fill its cell completely, so
              the images (h-full w-full object-cover inside the card) cover
              their boxes with no dead space or ragged bottoms. */}
          <div className="mt-12 grid auto-rows-fr grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
            {lineup.map((product, i) => (
              <MagneticProductCard
                key={product._id}
                product={product}
                strength={i % 2 ? 14 : 10}
                className="w-full"
              />
            ))}
          </div>
        </div>
      </section>

      {/* Rhythm break — reverse marquee on oat */}
      <InfiniteMarquee
        items={SHOP_MARQUEE_ITEMS}
        bg="bg-merry-oat"
        fg="text-merry-forest"
        border="border-y-4 border-merry-forest"
        reverse
        duration={30}
        textClass="text-base sm:text-xl"
      />

      {/* Flow 4 — pinned-scroll features */}
      <PinnedFeatures
        eyebrow="Why Well's Merry"
        heading="Your hair knows the difference."
        image={oilBoxStanding}
        imageAlt="Well's Merry hair care oil bottle and kraft box"
        features={HOME_FEATURES}
      />

      {/* Flow 5 — TRUST BLOCK A: social proof.
          Dark forest band, counter-scrolling 5-star review marquees. */}
      <RealResultsBanner reviews={MERRY_REVIEW_SNIPPETS} rating="4.9" reviewCount={231} />

      {/* Flow 6 — TRUST BLOCK B: ingredient transparency.
          Macro image left, "NO SECRETS. JUST SCIENCE." + 2×2 proof grid right. */}
      <IngredientSpotlight />

      {/* Flow 7 — TRUST BLOCK C: objection handling.
          Cream band, sticky "QUESTIONS? GOOD." headline + chunky accordion. */}
      <NoBsFaq />

      {/* Flow 8 — TRUST BLOCK D: community proof.
          Forest band, asymmetric bento wall of UGC + stylized reviews. */}
      <CommunityGrid />

      {/* Hand-off into the footer's clay newsletter band */}
      <WavyDivider from="forest" to="clay" variant="swell" />
    </>
  );
};

export default Home;
