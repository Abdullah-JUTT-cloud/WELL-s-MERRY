import { motion, useReducedMotion } from "framer-motion";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   RealResultsBanner — social-proof band (Section A).

   A full-bleed Deep Forest (#1A2E24) band carrying two infinite-scroll
   marquee rows of short, punchy 5-star reviews. Row one drifts left,
   row two drifts right, so the band reads as motion rather than a
   single ticker. Typography is heavy slab caps in cream with terracotta
   stars — maximum contrast against the dark ground.

   Implementation notes
   • Each row renders its phrase-set twice inside a `w-max` flex track
     and animates 0% → -50% (or the reverse), so the seam is invisible.
   • `prefers-reduced-motion` renders a static, still band.
   • The duplicated row is aria-hidden; the first copy carries the real
     text for screen readers.
   ===================================================================== */

const DEFAULT_REVIEWS = [
  { quote: "Saved my hairline.", author: "Ahmed" },
  { quote: "Zero frizz, finally.", author: "Sara" },
  { quote: "Baby hairs are back.", author: "Hina" },
  { quote: "My barber asked what I use.", author: "Bilal" },
  { quote: "Shedding stopped in 3 weeks.", author: "Mahnoor" },
  { quote: "Smells like a real kitchen.", author: "Usman" },
  { quote: "No greasy pillow. At last.", author: "Zoya" },
  { quote: "Dandruff gone by week two.", author: "Faisal" },
];

const Stars = ({ className = "text-merry-clay" }) => (
  <span className={`shrink-0 text-[0.75em] tracking-[0.12em] ${className}`} aria-hidden="true">
    ★★★★★
  </span>
);

const ReviewRow = ({ reviews, reverse = false, duration = 34, repeats = 2 }) => {
  const reduce = useReducedMotion();

  const Set = ({ hidden = false }) => (
    <div className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {Array.from({ length: repeats }).map((_, r) => (
        <span key={r} className="flex shrink-0 items-center">
          {reviews.map((review, i) => (
            <span key={`${r}-${i}`} className="flex shrink-0 items-center gap-4 px-6 sm:gap-5 sm:px-9">
              <Stars />
              <span className="whitespace-nowrap font-slab text-xl uppercase leading-none text-merry-cream sm:text-3xl lg:text-4xl">
                &ldquo;{review.quote}&rdquo;
              </span>
              <span className="whitespace-nowrap text-[11px] font-bold uppercase tracking-widest2 text-merry-sage sm:text-xs">
                — {review.author}
              </span>
              <LeafIcon className="h-4 w-4 shrink-0 text-merry-moss sm:h-5 sm:w-5" />
            </span>
          ))}
        </span>
      ))}
    </div>
  );

  return (
    <div className="overflow-hidden py-5 sm:py-7">
      <motion.div
        className="flex w-max"
        animate={reduce ? undefined : { x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration, ease: "linear", repeat: Infinity }}
      >
        <Set />
        <Set hidden />
      </motion.div>
    </div>
  );
};

const RealResultsBanner = ({
  reviews = DEFAULT_REVIEWS,
  rating = "4.9",
  reviewCount = 231,
  className = "",
}) => {
  // Split so the two rows never scroll identical copy past each other.
  const mid = Math.ceil(reviews.length / 2);
  const rowOne = reviews.slice(0, mid);
  const rowTwo = reviews.slice(mid).length ? reviews.slice(mid) : reviews;

  return (
    <section
      aria-label="Customer reviews"
      className={`select-none border-y-4 border-merry-forest bg-merry-forest text-merry-cream ${className}`}
    >
      {/* Header strip — the claim, stamped before the proof scrolls by */}
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 pt-10 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:pt-14">
        <div>
          <p className="flex items-center gap-2.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-clay">
            <LeafIcon className="h-4 w-4" />
            Real results
          </p>
          <h2 className="mt-4 text-4xl uppercase leading-[0.94] text-merry-cream sm:text-6xl">
            Don&rsquo;t take
            <br />
            <span className="text-merry-clay">our word for it.</span>
          </h2>
        </div>

        <div className="flex items-center gap-4 border-4 border-merry-cream/25 px-5 py-4">
          <span className="font-slab text-4xl leading-none text-merry-cream sm:text-5xl">
            {rating}
          </span>
          <span className="leading-tight">
            <Stars className="block text-merry-clay text-base" />
            <span className="mt-1.5 block text-[10px] font-bold uppercase tracking-widest2 text-merry-sage">
              {reviewCount} verified reviews
            </span>
          </span>
        </div>
      </div>

      {/* Two counter-scrolling marquee rows, fenced by thick rules */}
      <div className="mt-10 border-y-4 border-merry-cream/15">
        <ReviewRow reviews={rowOne} duration={34} />
      </div>
      <div className="border-b-4 border-merry-cream/15 bg-merry-pine">
        <ReviewRow reviews={rowTwo} reverse duration={40} />
      </div>

      <p className="mx-auto max-w-[1440px] px-6 py-6 text-center text-[10px] font-bold uppercase tracking-widest2 text-merry-sage sm:px-10">
        Collected from real Well&rsquo;s Merry customers · Cash on delivery, nationwide
      </p>
    </section>
  );
};

export default RealResultsBanner;
