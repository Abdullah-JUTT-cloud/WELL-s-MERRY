import { useState, useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/* =====================================================================
   NoBsFaq — "QUESTIONS? GOOD." objection-killer block.

   Layout
   • Full-width Cream (#F9F6F0) band, chunky forest rules top and bottom.
   • Left column: oversized slab heading that STICKS while the reader
     scrolls the answers (desktop only — it un-sticks under lg).
   • Right column: thick-bordered accordion, one item open at a time.

   Interaction
   • Framer Motion height auto → 0 slide, opacity-tweened, so the answer
     unfurls instead of popping. `prefers-reduced-motion` snaps instead.
   • Accessible disclosure semantics: real <button>, aria-expanded,
     aria-controls, region labelled by its trigger.
   ===================================================================== */

const DEFAULT_FAQS = [
  {
    q: "How long until I see baby hairs?",
    a: "Most people spot new growth along the hairline between week four and week six of daily use. Shedding usually calms down first — that is the early signal the follicle is settling. Give it one full growth cycle (about twelve weeks) before you judge it.",
  },
  {
    q: "Is this safe for colored hair?",
    a: "Yes. There is no sulfate, no silicone and no alcohol in the formula, so nothing strips your dye or dulls the tone. Apply it to the scalp rather than soaking the lengths and your color lasts exactly as long as it should.",
  },
  {
    q: "Why cold-pressed?",
    a: "Heat is cheap and fast, and it destroys the fatty acids and vitamin E that actually feed a follicle. Cold-pressing keeps the oil under 45°C, so what reaches your scalp is the same thing that came out of the seed. Lower yield, higher potency, no shortcuts.",
  },
  {
    q: "Will it make my hair greasy?",
    a: "Not if you use it as directed — five to seven drops, worked into the scalp, not the strands. It absorbs in about twenty minutes. Overnight users wake up to a clean pillow, which is honestly the whole point.",
  },
  {
    q: "What if it does not work for me?",
    a: "Then you did not lose anything. Finish the bottle, tell us it failed, and we refund it. No photo evidence, no interrogation, no restocking fee.",
  },
];

const PlusMinus = ({ open }) => (
  <span
    aria-hidden="true"
    className={`relative grid h-11 w-11 shrink-0 place-items-center border-4 border-merry-forest transition-colors duration-200
      ${open ? "bg-merry-clay text-merry-cream" : "bg-merry-cream text-merry-forest"}`}
  >
    <span className="absolute h-1 w-5 bg-current" />
    <span
      className={`absolute h-5 w-1 bg-current transition-transform duration-300 ${open ? "scale-y-0" : "scale-y-100"}`}
    />
  </span>
);

const FaqItem = ({ item, open, onToggle, index }) => {
  const reduce = useReducedMotion();
  const uid = useId();
  const panelId = `faq-panel-${uid}`;
  const buttonId = `faq-button-${uid}`;

  return (
    <div
      className={`border-4 border-merry-forest transition-colors duration-200
        ${open ? "bg-merry-oat" : "bg-merry-cream"}`}
    >
      <h3>
        <button
          type="button"
          id={buttonId}
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center gap-4 px-5 py-5 text-left sm:gap-6 sm:px-7 sm:py-6"
        >
          <span className="font-slab text-sm text-merry-clay sm:text-base">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 font-slab text-lg uppercase leading-tight text-merry-forest transition-colors duration-200 group-hover:text-merry-clay sm:text-2xl">
            {item.q}
          </span>
          <PlusMinus open={open} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="panel"
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduce ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.42, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.26, ease: "easeOut" },
            }}
            className="overflow-hidden"
          >
            <div className="border-t-4 border-merry-forest px-5 py-5 sm:px-7 sm:py-7">
              <p className="max-w-2xl text-[15px] leading-relaxed text-merry-forest/80 sm:text-base">
                {item.a}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NoBsFaq = ({
  eyebrow = "No BS answers",
  heading = "Questions? Good.",
  faqs = DEFAULT_FAQS,
}) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="border-y-4 border-merry-forest bg-merry-cream py-20 sm:py-28"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
        {/* Left — massive sticky heading */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <span className="inline-block border-4 border-merry-forest bg-merry-clay px-3 py-1.5 font-slab text-[11px] uppercase tracking-widest text-merry-cream">
            {eyebrow}
          </span>
          <h2
            id="faq-heading"
            className="mt-6 font-slab text-[15vw] uppercase leading-[0.85] text-merry-forest sm:text-7xl lg:text-8xl xl:text-[7.5rem]"
          >
            {heading}
          </h2>
          <p className="mt-6 max-w-sm text-[15px] leading-relaxed text-merry-forest/70">
            Everything people ask us before they buy, answered without the
            marketing fog. Still stuck? Message us — a human replies.
          </p>
          <div className="mt-8 h-2 w-40 bg-merry-clay" aria-hidden="true" />
        </div>

        {/* Right — chunky accordion */}
        <div className="flex flex-col gap-5">
          {faqs.map((item, i) => (
            <FaqItem
              key={item.q}
              item={item}
              index={i}
              open={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default NoBsFaq;
