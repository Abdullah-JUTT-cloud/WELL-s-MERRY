import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { APOC_FEATURES, APOC_STICKY_HEADER } from "../../data/apocalypse/features.js";
import { ICON_MAP } from "./icons.jsx";
import StampBadge from "./StampBadge.jsx";

/* =====================================================================
   StickyWhyApart — dark immersive doctrine section.
   Left: a massive sticky headline + live scroll-progress bar.
   Right: thick blocky feature cards that slide up as you scroll,
   each fronted by a neon-glow chunky vector icon.
   ===================================================================== */

const ACCENT_TEXT = {
  ember: "text-apoc-ember",
  volt: "text-apoc-volt",
};
const ACCENT_GLOW = {
  ember: "drop-shadow-[0_0_14px_rgba(217,83,18,0.75)]",
  volt: "drop-shadow-[0_0_14px_rgba(228,242,75,0.6)]",
};

const StickyWhyApart = () => {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const barScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section ref={ref} className="relative bg-apoc-coal text-apoc-bone apoc-noise apoc-noise-dark overflow-hidden">
      {/* ghost watermark type */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-10 text-center font-apoc uppercase text-[18vw] leading-none text-apoc-bone/[0.035] pointer-events-none select-none"
      >
        DOCTRINE
      </div>

      <div className="container-content relative z-10 px-4 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-16">
        {/* ============ LEFT — sticky header ============ */}
        <div className="relative lg:py-24">
          <div className="lg:sticky lg:top-[16vh]">
            <span className="inline-block font-distressed text-apoc-volt text-sm sm:text-base uppercase tracking-[0.2em] mb-4 -rotate-1">
              {APOC_STICKY_HEADER.eyebrow}
            </span>
            <h2 className="font-apoc uppercase leading-[0.84] text-5xl sm:text-7xl lg:text-[5.6rem] mb-6">
              {APOC_STICKY_HEADER.title[0]}
              <br />
              {APOC_STICKY_HEADER.title[1]}
              <br />
              <span className="text-apoc-ember">{APOC_STICKY_HEADER.title[2]}</span>
            </h2>
            <p className="font-grotesk font-semibold text-sm sm:text-base text-apoc-bone/70 max-w-md mb-8">
              {APOC_STICKY_HEADER.copy}
            </p>

            {/* scroll progress */}
            <div className="max-w-md mb-8">
              <div className="flex justify-between font-black text-[10px] uppercase tracking-[0.2em] text-apoc-bone/50 mb-2">
                <span>Scroll the doctrine</span>
                <span>05 blocks</span>
              </div>
              <div className="h-3 bg-apoc-smoke border-2 border-apoc-bone/25">
                <motion.div
                  className="h-full bg-apoc-ember origin-left"
                  style={{ scaleX: reduce ? 1 : barScale }}
                />
              </div>
            </div>

            <StampBadge
              text={APOC_STICKY_HEADER.badge}
              center={<span className="font-apoc text-2xl text-apoc-volt">№1</span>}
              bg="bg-apoc-soot"
              fg="text-apoc-volt"
              ring="border-apoc-volt"
              size={116}
              className="hidden lg:flex"
            />
          </div>
        </div>

        {/* ============ RIGHT — scrolling blocky cards ============ */}
        <div className="flex flex-col gap-8 lg:gap-10 py-16 lg:py-24">
          {APOC_FEATURES.map((f, i) => {
            const Icon = ICON_MAP[f.icon] ?? ICON_MAP.bolt;
            const tilt = i % 2 ? 1.2 : -1.2;
            return (
              <motion.article
                key={f.id}
                initial={reduce ? false : { y: 140, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: false, amount: 0.35 }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
                whileHover={{ rotate: 0, y: -8 }}
                className="relative border-4 border-apoc-bone bg-apoc-smoke p-7 sm:p-9 shadow-hard-ember min-h-[42vh] flex flex-col justify-between"
                style={{ rotate: `${tilt}deg` }}
              >
                <div className="flex items-start justify-between gap-4 mb-6">
                  <Icon className={`w-14 h-14 sm:w-16 sm:h-16 ${ACCENT_TEXT[f.accent]} ${ACCENT_GLOW[f.accent]}`} />
                  <span className="font-apoc text-5xl sm:text-6xl leading-none text-apoc-bone/15 select-none">
                    {f.no}
                  </span>
                </div>
                <div>
                  <h3 className="font-apoc uppercase text-2xl sm:text-4xl leading-[0.92] mb-4">{f.title}</h3>
                  <p className="font-grotesk font-semibold text-sm sm:text-base leading-relaxed text-apoc-bone/70 mb-6">
                    {f.copy}
                  </p>
                </div>
                <span
                  className={`self-start inline-block ${
                    f.accent === "volt" ? "bg-apoc-volt text-apoc-soot" : "bg-apoc-ember text-apoc-soot"
                  } border-2 border-apoc-soot px-3 py-1.5 font-black text-[10px] sm:text-[11px] uppercase tracking-[0.16em] -rotate-1`}
                >
                  {f.stat}
                </span>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StickyWhyApart;
