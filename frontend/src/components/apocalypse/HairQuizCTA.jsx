import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { motion, useReducedMotion } from "framer-motion";
import { APOC_QUIZ } from "../../data/apocalypse/quiz.js";
import { ICON_MAP, DropIcon } from "./icons.jsx";
import StampBadge from "./StampBadge.jsx";

/* =====================================================================
   HairQuizCTA — full-width chaotic quiz banner ("Find Your Brew" adapted).
   Floating drops/skulls/beans drift behind a giant blocky CTA button.
   Set APOC_QUIZ.ctaLink to a real route when the quiz page exists;
   until then the button fires a toast.
   ===================================================================== */
const HairQuizCTA = () => {
  const reduce = useReducedMotion();

  const handleCta = () => {
    if (APOC_QUIZ.ctaLink) return; // <Link> handles navigation
    toast(APOC_QUIZ.ctaToast, {
      icon: "🧴",
      duration: 4000,
      style: {
        background: "#0f0c09",
        color: "#f2ebdc",
        border: "3px solid #d95312",
        borderRadius: 0,
        fontWeight: 700,
      },
    });
  };

  const CtaInner = (
    <>
      {APOC_QUIZ.cta} <span aria-hidden="true">→</span>
    </>
  );
  const ctaClass =
    "inline-flex items-center gap-4 bg-apoc-soot text-apoc-bone border-4 border-apoc-soot " +
    "shadow-hard-bone px-10 sm:px-16 py-6 sm:py-8 font-apoc uppercase text-xl sm:text-3xl lg:text-4xl tracking-wide";

  return (
    <section id="apoc-quiz" className="relative bg-apoc-ember text-apoc-soot apoc-noise overflow-hidden">
      {/* halftone field */}
      <div aria-hidden="true" className="absolute inset-0 apoc-halftone text-apoc-soot opacity-[0.12] pointer-events-none" />

      {/* chaotic floaters */}
      {APOC_QUIZ.floaters.map((f, i) => {
        const Icon = ICON_MAP[f.icon] ?? ICON_MAP.drop;
        return (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute text-apoc-soot opacity-20 pointer-events-none"
            style={{ left: `${f.x}%`, top: `${f.y}%`, width: f.size, height: f.size, rotate: `${f.rot}deg` }}
            animate={reduce ? undefined : { y: [0, -22, 0], rotate: [f.rot, f.rot + 8, f.rot] }}
            transition={{ duration: f.dur, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="w-full h-full" />
          </motion.span>
        );
      })}

      <div className="container-content relative z-10 px-4 sm:px-6 py-24 sm:py-32 text-center">
        <span className="inline-block font-distressed text-sm sm:text-base uppercase tracking-[0.2em] mb-5 -rotate-1 bg-apoc-soot text-apoc-ember px-3 py-1.5 border-2 border-apoc-soot">
          {APOC_QUIZ.eyebrow}
        </span>

        <h2 className="font-apoc uppercase leading-[0.9] text-4xl sm:text-6xl lg:text-8xl mb-6">
          {APOC_QUIZ.title.map((line, i) => (
            <motion.span
              key={line}
              className={`block ${i === 1 ? "apoc-outline text-apoc-soot" : ""} ${i === 2 ? "text-apoc-soot" : ""}`}
              initial={reduce ? false : { opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ type: "spring", stiffness: 120, damping: 16, delay: i * 0.1 }}
            >
              {line}
            </motion.span>
          ))}
        </h2>

        <p className="font-grotesk font-bold text-sm sm:text-lg max-w-xl mx-auto mb-10 sm:mb-12 text-apoc-soot/85">
          {APOC_QUIZ.copy}
        </p>

        <motion.div
          className="inline-block"
          whileHover={reduce ? undefined : { scale: 1.05, rotate: -1.5 }}
          whileTap={{ scale: 0.95 }}
        >
          {APOC_QUIZ.ctaLink ? (
            <Link to={APOC_QUIZ.ctaLink} className={ctaClass}>
              {CtaInner}
            </Link>
          ) : (
            <button type="button" onClick={handleCta} className={ctaClass}>
              {CtaInner}
            </button>
          )}
        </motion.div>

        <p className="font-grotesk font-bold text-[11px] sm:text-xs uppercase tracking-[0.18em] mt-8 text-apoc-soot/70">
          {APOC_QUIZ.note}
        </p>

        <StampBadge
          text="THREE QUESTIONS • SIXTY SECONDS • "
          center={<DropIcon className="w-9 h-9 text-apoc-soot" />}
          bg="bg-apoc-bone"
          className="absolute right-4 sm:right-12 top-10 sm:top-16 hidden sm:flex"
          size={120}
        />
      </div>
    </section>
  );
};

export default HairQuizCTA;
