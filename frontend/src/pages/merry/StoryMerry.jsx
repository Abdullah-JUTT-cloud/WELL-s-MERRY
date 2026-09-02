import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CollageTimeline, LeafIcon, DropIcon, SparkIcon, HandHeartIcon } from "../../components/merry/index.js";
import { MERRY_TIMELINE } from "../../data/merry/mock.js";
import oilFlatlay from "../../assets/oil-flatlay-diagonal.jpg";

/* =====================================================================
   STORY — big hero image under a heavy forest overlay ("BUILT BY
   NATURE. BACKED BY SCIENCE."), then the CollageTimeline mapping the
   brand's formulation history, then a three-promise pledge band.
   ===================================================================== */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay },
});

const PROMISES = [
  {
    icon: DropIcon,
    tone: "bg-merry-forest text-merry-cream shadow-hard-merry-clay",
    chip: "text-merry-clay",
    title: "Cold-pressed or nothing",
    text: "Every oil is pressed slowly at room temperature on our own floor. If it can't be pressed, it doesn't get in the bottle.",
  },
  {
    icon: SparkIcon,
    tone: "bg-merry-clay text-merry-cream shadow-hard-merry",
    chip: "text-merry-forest",
    title: "The ledger stays short",
    text: "Eight oils, four extracts, zero unpronounceables. The full ingredient list fits on one label — always has.",
  },
  {
    icon: HandHeartIcon,
    tone: "bg-merry-oat text-merry-forest shadow-hard-merry",
    chip: "text-merry-clay",
    title: "Family-tested first",
    text: "Nothing ships until it survives a month on real heads in the family — the kids, the cousins, the very skeptical uncles.",
  },
];

const Story = () => {
  const reduce = useReducedMotion();

  return (
    <>
      {/* ── Hero: image under a heavy overlay ────────────────────────── */}
      <section className="relative flex min-h-[68svh] items-end overflow-hidden border-b-4 border-merry-forest">
        <motion.img
          src={oilFlatlay}
          alt="Well's Merry hair care oil bottle and box laid on warm fur"
          className="absolute inset-0 h-full w-full object-cover"
          initial={reduce ? false : { scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease: "easeOut" }}
        />
        {/* heavy overlay — the text must always win */}
        <div className="absolute inset-0 bg-merry-forest/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-merry-soot/70 via-transparent to-merry-forest/40" />

        <div className="relative mx-auto w-full max-w-[1440px] px-6 pb-16 pt-32 sm:px-10 lg:pb-24">
          <motion.p
            {...(reduce ? {} : fadeUp(0))}
            className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-sage sm:text-sm"
          >
            <LeafIcon className="h-4 w-4 text-merry-clay" />
            Our story
          </motion.p>
          <motion.h1
            {...(reduce ? {} : fadeUp(0.12))}
            className="mt-5 max-w-4xl text-5xl uppercase leading-[0.95] text-merry-cream sm:text-7xl lg:text-8xl"
          >
            Built by <span className="text-merry-clay">nature.</span>
            <br />
            Backed by <span className="text-merry-clay">science.</span>
          </motion.h1>
          <motion.p
            {...(reduce ? {} : fadeUp(0.24))}
            className="mt-7 max-w-xl text-base font-medium leading-relaxed text-merry-cream/90 sm:text-lg"
          >
            It started with a grandmother's copper pot and a niece's postpartum
            hairline. Six years later the pot is bigger, the ledger is pH-tested,
            and the recipe still refuses to grow past eight oils.
          </motion.p>
        </div>
      </section>

      {/* ── Formulation history — the collage timeline ───────────────── */}
      <CollageTimeline
        eyebrow="The formulation history"
        heading="Six years, one recipe"
        moments={MERRY_TIMELINE}
      />

      {/* ── Pledge band ──────────────────────────────────────────────── */}
      <section className="border-t-4 border-merry-forest bg-merry-cream px-6 py-16 sm:px-10 lg:py-24">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-2xl text-4xl uppercase leading-[0.98] sm:text-6xl">
              The merry <span className="text-merry-clay">pledge</span>
            </h2>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-merry-forest/70 sm:text-base">
              Three rules written on the lab wall in 2019. None have been
              edited since — not once, not for scale, not for margin.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3 lg:gap-8">
            {PROMISES.map((p, i) => (
              <motion.article
                key={p.title}
                initial={reduce ? false : { opacity: 0, y: 34 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12 }}
                className={`flex flex-col gap-5 border-4 border-merry-forest p-8 ${p.tone} ${i === 1 ? "lg:-translate-y-4 lg:-rotate-1" : ""}`}
              >
                <p.icon className="h-10 w-10" />
                <h3 className="text-2xl uppercase leading-tight sm:text-3xl">{p.title}</h3>
                <p className={`text-sm font-medium leading-relaxed sm:text-base ${p.chip.includes("text-merry-forest") ? "text-merry-forest/75" : "text-merry-cream/85"}`}>
                  {p.text}
                </p>
                <span className="mt-auto font-slab text-xs uppercase tracking-widest2 opacity-60">
                  Rule 0{i + 1}
                </span>
              </motion.article>
            ))}
          </div>

          <div className="mt-14 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/shop"
              className="pressable flex items-center justify-center gap-3 border-4 border-merry-forest bg-merry-forest px-8 py-4 text-center font-slab text-lg uppercase tracking-wide text-merry-cream shadow-hard-merry-clay"
            >
              Shop the result
              <LeafIcon className="h-5 w-5" />
            </Link>
            <Link
              to="/quiz"
              className="pressable flex items-center justify-center border-4 border-merry-forest bg-merry-cream px-8 py-4 text-center font-slab text-lg uppercase tracking-wide text-merry-forest shadow-hard-merry-sm hover:bg-merry-oat"
            >
              Find your match
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Story;
