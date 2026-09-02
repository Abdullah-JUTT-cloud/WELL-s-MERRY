import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { LeafIcon } from "./icons.jsx";

/* =====================================================================
   TheRitual — "THE RITUAL. THREE STEPS." application guide.

   Goal: show the user exactly how to use the product so they trust it
   will work — killing pre-purchase anxiety before the FAQ even has to.

   Design
   • Cream (#F9F6F0) band, chunky forest rules top and bottom.
   • Massive asymmetric split: left 1/3 is a STICKY oversized headline
     that holds while the reader scrolls the steps (desktop only); right
     2/3 is a vertical stack of three heavily padded horizontal cards.
   • Each card: giant slab number, heavy title, plain-spoken body.
   • A prominent "SHOP THE OIL" CTA closes the stack.

   Keeps the brutalist bones — thick borders, heavy type, hard shadow.
   ===================================================================== */

const STEPS = [
  {
    num: "01",
    title: "The Dose",
    text: "Five to seven drops for shoulder-length hair — eight to ten if it falls past your shoulders. Less is more: the scalp drinks, the strand doesn't need it.",
  },
  {
    num: "02",
    title: "The Massage",
    text: "Part your hair in sections and press the oil along each part line. Use your fingertips, never your nails, in slow circles for sixty seconds. The friction is the medicine.",
  },
  {
    num: "03",
    title: "The Patience",
    text: "Leave it in. Twenty minutes minimum, overnight if you can. It's a leave-in treatment, not a rinse — let the follicle actually absorb before you wash.",
  },
];

const RitualStep = ({ step, index }) => {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="group flex flex-col gap-5 border-b-4 border-merry-forest p-8 transition-colors duration-300 hover:bg-merry-oat sm:p-12 lg:flex-row lg:items-center lg:gap-12 lg:p-16"
    >
      {/* Giant slab number */}
      <div className="shrink-0 font-slab text-7xl uppercase leading-none text-merry-clay sm:text-8xl lg:text-[7rem]">
        {step.num}
      </div>

      {/* Title + body */}
      <div className="flex-1">
        <h3 className="font-slab text-3xl uppercase leading-none text-merry-forest sm:text-4xl lg:text-5xl">
          {step.title}
        </h3>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-merry-forest/75 sm:text-lg">
          {step.text}
        </p>
      </div>
    </motion.div>
  );
};

const TheRitual = ({
  eyebrow = "How to use",
  heading = ["The Ritual.", "Three Steps."],
  intro = "Exactly how to use it, so you actually get the results on the bottle. No guesswork, no overthinking — three minutes, three times a week.",
  steps = STEPS,
  ctaLabel = "Shop the oil",
  ctaTo = "/shop",
}) => (
  <section
    id="ritual"
    aria-labelledby="ritual-heading"
    className="border-y-4 border-merry-forest bg-merry-cream"
  >
    <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-3">
      {/* LEFT — sticky oversized text (1/3) */}
      <div className="border-b-4 border-merry-forest p-6 sm:p-10 lg:sticky lg:top-28 lg:col-span-1 lg:self-start lg:border-b-0 lg:border-r-4">
        <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
          <LeafIcon className="h-4 w-4" />
          {eyebrow}
        </p>
        <h2
          id="ritual-heading"
          className="mt-5 font-slab text-[15vw] uppercase leading-[0.85] text-merry-forest sm:text-7xl lg:text-[4.6rem] xl:text-[5.2rem]"
        >
          {heading[0]}
          <br />
          <span className="text-merry-clay">{heading[1]}</span>
        </h2>
        <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-merry-forest/70">
          {intro}
        </p>
      </div>

      {/* RIGHT — three massive cards + closing CTA (2/3) */}
      <div className="flex flex-col lg:col-span-2">
        {steps.map((step, i) => (
          <RitualStep key={step.num} step={step} index={i} />
        ))}

        {/* Prominent conversion CTA */}
        <Link
          to={ctaTo}
          className="pressable flex items-center justify-center gap-3 border-t-4 border-merry-forest bg-merry-clay px-8 py-10 font-slab text-2xl uppercase tracking-wide text-merry-cream shadow-hard-merry sm:py-12 sm:text-3xl"
        >
          {ctaLabel}
          <LeafIcon className="h-7 w-7" />
        </Link>
      </div>
    </div>
  </section>
);

export default TheRitual;
