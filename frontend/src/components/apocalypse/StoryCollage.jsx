import { motion, useReducedMotion } from "framer-motion";
import { APOC_TIMELINE, APOC_STRINGS } from "../../data/apocalypse/timeline.js";
import { SkullIcon } from "./icons.jsx";

/* =====================================================================
   StoryCollage — the chaotic "Our Story" conspiracy board.
   Torn newspaper clippings, taped polaroids, sticky notes and rubber
   stamps overlap on an aged-paper canvas, pinned and cross-linked with
   red string (SVG, non-scaling stroke so it survives the stretch).
   Cards are draggable — the board is meant to feel handled.
   ===================================================================== */

const Pin = ({ className = "" }) => (
  <span
    aria-hidden="true"
    className={`absolute -top-2.5 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full
                bg-apoc-rust border-2 border-apoc-soot shadow-[2px_2px_0_rgba(15,12,9,0.5)] z-20 ${className}`}
  />
);

const YearStamp = ({ year, className = "" }) => (
  <span
    className={`inline-block font-distressed text-apoc-rust text-lg sm:text-xl uppercase tracking-widest
                border-2 border-apoc-rust/70 px-2 py-0.5 rotate-[-3deg] ${className}`}
  >
    {year}
  </span>
);

/* ---------- card skins ---------- */
const ArticleCard = ({ item }) => (
  <div className="relative bg-[#efe7d2] border border-apoc-soot/40 shadow-hard-ink p-5 sm:p-6">
    <Pin />
    <div className="flex items-start justify-between gap-3 mb-3">
      <YearStamp year={item.year} />
      <span className="font-grotesk font-black text-[9px] uppercase tracking-[0.22em] text-apoc-soot/50 text-right">
        Well&apos;s Merry Gazette
        <br />
        Vol. {item.year} — № 0{item.id.length % 9}
      </span>
    </div>
    <h3 className="font-apoc uppercase text-xl sm:text-2xl leading-[0.95] mb-1.5">{item.headline}</h3>
    <p className="font-grotesk font-bold italic text-[12px] sm:text-[13px] text-apoc-rust mb-3">{item.deck}</p>
    <div className="border-t-2 border-apoc-soot/60 pt-3">
      <p className="apoc-newsprint font-grotesk font-medium text-[11.5px] sm:text-[12.5px] leading-relaxed text-apoc-soot/85">
        {item.body}
      </p>
    </div>
    <div aria-hidden="true" className="mt-4 h-10 apoc-halftone text-apoc-soot/30" />
  </div>
);

const PolaroidCard = ({ item }) => (
  <div className="relative bg-apoc-bone border border-apoc-soot/30 shadow-hard-ink p-3 pb-9">
    <span aria-hidden="true" className="apoc-tape -top-3 left-1/2" style={{ "--tape-rot": "-5deg" }} />
    <img
      src={item.image}
      alt={item.caption}
      className="w-full aspect-square object-cover border border-apoc-soot/40 grayscale contrast-125"
      loading="lazy"
      draggable={false}
    />
    <p className="absolute bottom-2.5 left-3 right-3 font-distressed text-[11px] sm:text-xs uppercase tracking-wide text-apoc-soot/80 truncate">
      {item.caption}
    </p>
    <YearStamp year={item.year} className="absolute -bottom-3 -right-2 !text-sm !rotate-6" />
  </div>
);

const NoteCard = ({ item }) => (
  <div className="relative bg-apoc-volt text-apoc-soot border-2 border-apoc-soot shadow-hard-ink p-5">
    <Pin className="!bg-apoc-soot" />
    <YearStamp year={item.year} className="!border-apoc-soot !text-apoc-soot mb-3" />
    <h3 className="font-apoc uppercase text-lg sm:text-xl leading-tight mb-2">{item.headline}</h3>
    <p className="font-grotesk font-bold text-[12.5px] sm:text-[13.5px] leading-snug">{item.body}</p>
  </div>
);

const StampCard = ({ item }) => (
  <div className="relative border-4 border-apoc-rust text-apoc-rust bg-apoc-paper/60 p-5 sm:p-6">
    <Pin />
    <div className="flex items-center gap-2 mb-3">
      <SkullIcon className="w-6 h-6" />
      <YearStamp year={item.year} className="!rotate-2" />
    </div>
    <h3 className="font-distressed uppercase text-2xl sm:text-3xl leading-none mb-3">{item.headline}</h3>
    <p className="font-grotesk font-bold text-[12.5px] sm:text-[13.5px] leading-snug">{item.body}</p>
  </div>
);

const SKINS = {
  article: ArticleCard,
  polaroid: PolaroidCard,
  note: NoteCard,
  stamp: StampCard,
};

/* ---------- red string geometry ---------- */
const anchorOf = (item) => ({ x: item.x + item.w / 2, y: item.y + 1.5 });

const StoryCollage = () => {
  const reduce = useReducedMotion();

  return (
    <section id="apoc-story" className="relative bg-apoc-paper text-apoc-soot apoc-noise overflow-hidden">
      {/* aged paper column ghosting */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: "repeating-linear-gradient(90deg, #0f0c09 0 1px, transparent 1px 54px)" }}
      />

      <div className="container-content relative z-10 px-4 sm:px-6 pt-14 sm:pt-20 pb-8">
        <div className="max-w-2xl">
          <span className="inline-block font-distressed text-apoc-rust text-sm sm:text-base uppercase tracking-[0.2em] mb-3 rotate-[-1deg]">
            Declassified
          </span>
          <h2 className="font-apoc uppercase leading-[0.88] text-4xl sm:text-6xl lg:text-7xl mb-4">
            Our story,
            <br />
            <span className="apoc-outline text-apoc-soot">pinned to the wall.</span>
          </h2>
          <p className="font-grotesk font-semibold text-sm sm:text-base text-apoc-soot/75">
            Every batch, every bottleneck, every &ldquo;we&apos;re out of stock
            again&rdquo; — documented like a case file. Drag the clippings
            around; the string stays, because the string always stays.
          </p>
        </div>
      </div>

      {/* ============ DESKTOP — absolute collage canvas ============ */}
      <div className="container-content relative z-10 px-4 sm:px-6 hidden lg:block pb-24">
        <div className="relative w-full" style={{ height: 860 }}>
          {/* red string overlay */}
          <svg
            aria-hidden="true"
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {APOC_STRINGS.map(([a, b]) => {
              const from = anchorOf(APOC_TIMELINE.find((i) => i.id === a));
              const to = anchorOf(APOC_TIMELINE.find((i) => i.id === b));
              if (!from || !to) return null;
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2 + 5;
              return (
                <path
                  key={`${a}-${b}`}
                  d={`M ${from.x} ${from.y} Q ${mx} ${my} ${to.x} ${to.y}`}
                  fill="none"
                  stroke="#c0271a"
                  strokeWidth="2.5"
                  vectorEffect="non-scaling-stroke"
                  opacity="0.85"
                />
              );
            })}
          </svg>

          {APOC_TIMELINE.map((item, i) => {
            const Skin = SKINS[item.kind] ?? ArticleCard;
            return (
              <motion.div
                key={item.id}
                className="absolute"
                style={{ left: `${item.x}%`, top: `${item.y}%`, width: `${item.w}%`, zIndex: item.z }}
                initial={reduce ? false : { opacity: 0, scale: 0.85, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 130, damping: 16, delay: i * 0.08 }}
                drag={item.draggable && !reduce}
                dragMomentum={false}
                whileDrag={{ scale: 1.05, zIndex: 60, cursor: "grabbing" }}
                whileHover={{ scale: 1.03, zIndex: 50 }}
              >
                <div style={{ rotate: `${item.rot}deg` }}>
                  <Skin item={item} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ============ MOBILE / TABLET — stacked clippings ============ */}
      <div className="container-content relative z-10 px-4 sm:px-6 lg:hidden pb-20">
        <div className="relative flex flex-col gap-10">
          {/* vertical red thread */}
          <span aria-hidden="true" className="absolute left-1/2 top-0 bottom-0 w-[2.5px] bg-[#c0271a]/70 -translate-x-1/2" />
          {APOC_TIMELINE.map((item, i) => {
            const Skin = SKINS[item.kind] ?? ArticleCard;
            return (
              <motion.div
                key={item.id}
                className="relative z-10 max-w-md w-full mx-auto"
                style={{ rotate: `${item.rot}deg` }}
                initial={reduce ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
              >
                <Skin item={item} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StoryCollage;
