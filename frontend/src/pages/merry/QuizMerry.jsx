import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiArrowLeft, HiArrowRight, HiCheck } from "react-icons/hi2";
import { LeafIcon, SparkIcon, BottleIcon } from "../../components/merry/index.js";
import { MERRY_QUIZ_STEPS, recommend } from "../../data/merry/mock.js";

/* =====================================================================
   QUIZ — full-screen, immersive hair quiz.

   • Forest-green stage, thick cream progress rail, step counter.
   • Chunky toggle buttons: select one and the form glides to the next
     question on its own (direction-aware slide, AnimatePresence).
   • Result screen: recommended product from the mock catalog, a
     personalised ritual, add-to-cart straight into the drawer.
   ===================================================================== */

const STEP_SPRING = { type: "spring", stiffness: 260, damping: 28 };

const variants = {
  enter: (dir) => ({ x: dir > 0 ? 90 : -90, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -90 : 90, opacity: 0 }),
};

const Quiz = () => {
  const reduce = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const dir = useRef(1);
  const advancing = useRef(false);

  const total = MERRY_QUIZ_STEPS.length;
  const done = stepIndex >= total;
  const step = MERRY_QUIZ_STEPS[Math.min(stepIndex, total - 1)];
  const result = useMemo(() => (done ? recommend(answers) : null), [done, answers]);

  const pick = (value) => {
    if (advancing.current) return;
    advancing.current = true;
    setAnswers((a) => ({ ...a, [step.key]: value }));
    dir.current = 1;
    window.setTimeout(() => {
      setStepIndex((i) => i + 1);
      advancing.current = false;
    }, reduce ? 120 : 320); // let the pressed state register, then glide on
  };

  const back = () => {
    dir.current = -1;
    setStepIndex((i) => Math.max(0, i - 1));
  };

  const restart = () => {
    dir.current = -1;
    setAnswers({});
    setStepIndex(0);
  };

  return (
    <section className="relative flex min-h-[calc(100svh-5rem)] flex-col overflow-hidden bg-merry-forest">
      {/* stage decoration */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-merry-pine" style={{ borderRadius: "58% 42% 55% 45% / 45% 58% 42% 55%" }} />
        <div className="absolute -bottom-40 -right-24 h-[30rem] w-[30rem] bg-merry-pine/70" style={{ borderRadius: "45% 55% 48% 52% / 55% 45% 58% 42%" }} />
        <LeafIcon className="absolute right-[12%] top-[18%] h-10 w-10 -rotate-12 text-merry-moss/50" />
        <LeafIcon className="absolute bottom-[14%] left-[8%] h-14 w-14 rotate-45 text-merry-moss/40" />
      </div>

      {/* progress rail */}
      <div className="relative z-10 px-6 pt-8 sm:px-10">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          <span className="shrink-0 border-2 border-merry-cream/70 px-3 py-1.5 font-slab text-[11px] uppercase tracking-widest2 text-merry-cream">
            {done ? "Match" : `${String(stepIndex + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`}
          </span>
          <div className="h-4 flex-1 border-[3px] border-merry-cream/80 bg-transparent">
            <motion.div
              className="h-full bg-merry-clay"
              initial={false}
              animate={{ width: `${(Math.min(stepIndex, total) / total) * 100}%` }}
              transition={reduce ? { duration: 0 } : { ...STEP_SPRING }}
            />
          </div>
          <button
            type="button"
            onClick={restart}
            className="shrink-0 font-slab text-[11px] uppercase tracking-widest2 text-merry-cream/70 underline decoration-merry-clay decoration-2 underline-offset-4 transition-colors hover:text-merry-cream sm:text-xs"
          >
            Restart
          </button>
        </div>
      </div>

      {/* stage body */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-3xl">
          <AnimatePresence mode="wait" custom={dir.current}>
            {!done ? (
              <motion.div
                key={step.id}
                custom={dir.current}
                variants={reduce ? undefined : variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={STEP_SPRING}
              >
                <p className="font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
                  {step.eyebrow}
                </p>
                <h1 className="mt-4 text-4xl uppercase leading-[0.98] text-merry-cream sm:text-6xl">
                  {step.question}
                </h1>
                <p className="mt-4 text-sm font-medium text-merry-cream/70 sm:text-base">
                  {step.hint}
                </p>

                {/* chunky toggle buttons */}
                <div
                  className={`mt-10 grid gap-4 ${step.options.length > 3 ? "sm:grid-cols-2" : ""}`}
                  role="group"
                  aria-label={step.question}
                >
                  {step.options.map((opt) => {
                    const selected = answers[step.key] === opt.value;
                    return (
                      <motion.button
                        key={opt.value}
                        type="button"
                        onClick={() => pick(opt.value)}
                        whileTap={reduce ? undefined : { scale: 0.97 }}
                        aria-pressed={selected}
                        className={`flex items-center justify-between gap-4 border-4 px-6 py-5 text-left transition-colors duration-150 sm:px-8 sm:py-6 ${
                          selected
                            ? "border-merry-cream bg-merry-clay text-merry-cream shadow-hard-merry-cream"
                            : "border-merry-cream/85 bg-transparent text-merry-cream hover:border-merry-cream hover:bg-merry-pine"
                        }`}
                      >
                        <span>
                          <span className="block font-slab text-2xl uppercase leading-none sm:text-3xl">
                            {opt.label}
                          </span>
                          {opt.sub && (
                            <span className="mt-2 block text-xs font-bold uppercase tracking-wider text-merry-cream/70 sm:text-sm">
                              {opt.sub}
                            </span>
                          )}
                        </span>
                        <span
                          className={`grid h-10 w-10 shrink-0 place-items-center border-4 ${
                            selected ? "border-merry-cream bg-merry-cream text-merry-clay" : "border-merry-cream/50 text-transparent"
                          }`}
                        >
                          <HiCheck className="h-6 w-6" strokeWidth={3} />
                        </span>
                      </motion.button>
                    );
                  })}
                </div>

                {/* back */}
                <div className="mt-10 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={back}
                    disabled={stepIndex === 0}
                    className="inline-flex items-center gap-2 font-slab text-xs uppercase tracking-widest2 text-merry-cream/70 transition-colors hover:text-merry-cream disabled:cursor-not-allowed disabled:opacity-30 sm:text-sm"
                  >
                    <HiArrowLeft className="h-4 w-4" />
                    Back
                  </button>
                  {answers[step.key] && (
                    <button
                      type="button"
                      onClick={() => pick(answers[step.key])}
                      className="ml-auto inline-flex items-center gap-2 border-b-2 border-merry-clay pb-1 font-slab text-xs uppercase tracking-widest2 text-merry-cream sm:text-sm"
                    >
                      Next
                      <HiArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ) : (
              result && (
                <motion.div
                  key="result"
                  custom={dir.current}
                  variants={reduce ? undefined : variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={STEP_SPRING}
                >
                  <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
                    <SparkIcon className="h-4 w-4" />
                    Your match
                  </p>
                  <h1 className="mt-4 text-4xl uppercase leading-[0.98] text-merry-cream sm:text-6xl">
                    {result.headline}
                  </h1>

                  <div className="mt-10 grid gap-6 sm:grid-cols-[minmax(0,240px)_1fr] sm:gap-8">
                    <div className="border-4 border-merry-cream bg-merry-cream shadow-hard-merry-cream">
                      <img
                        src={result.product.images[0]}
                        alt={result.product.name}
                        className="aspect-[4/5] w-full object-cover"
                      />
                      <div className="flex items-center justify-between border-t-4 border-merry-forest px-4 py-3 text-merry-forest">
                        <span className="font-slab text-lg">{result.product.name}</span>
                        <span className="font-slab text-lg text-merry-clay-deep">
                          Rs. {result.product.price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-bold uppercase tracking-widest2 text-merry-sage">
                        Your personalized ritual
                      </p>
                      <ol className="mt-4 space-y-3">
                        {result.ritual.map((line, i) => (
                          <li key={i} className="flex gap-3 text-sm font-medium leading-relaxed text-merry-cream/90 sm:text-base">
                            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center border-2 border-merry-clay font-slab text-xs text-merry-clay">
                              {i + 1}
                            </span>
                            {line}
                          </li>
                        ))}
                      </ol>
                      <p className="mt-5 flex items-center gap-2 border-l-4 border-merry-clay pl-3 text-xs font-bold uppercase tracking-wider text-merry-cream/80 sm:text-sm">
                        <BottleIcon className="h-5 w-5 text-merry-clay" />
                        {result.sizeNote}
                      </p>

                      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <Link
                          to={`/product/${result.product.slug}`}
                          className="pressable inline-flex items-center justify-center gap-3 border-4 border-merry-cream bg-merry-clay px-7 py-4 font-slab text-base uppercase tracking-wide text-merry-cream shadow-hard-merry-cream"
                        >
                          Get your match
                          <HiArrowRight className="h-5 w-5" />
                        </Link>
                        <Link
                          to="/shop"
                          className="inline-flex items-center justify-center gap-2 border-b-2 border-merry-cream/60 pb-1 font-slab text-xs uppercase tracking-widest2 text-merry-cream/85 transition-colors hover:border-merry-cream hover:text-merry-cream sm:text-sm"
                        >
                          Browse the full shelf
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Quiz;
