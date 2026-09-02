import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { HiOutlineMapPin, HiOutlinePhone, HiOutlineClock, HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";
import { LeafIcon } from "../../components/merry/index.js";
import MerryMap from "../../components/merry/MerryMap.jsx";
import { MERRY_OUTLETS } from "../../data/merry/mock.js";

/* =====================================================================
   OUTLETS — physical retail partners as large asymmetric cards
   (12-col grid, varied spans + tilts), synced with an embedded map
   graded to the Forest & Cream MAP_STYLE JSON theme.

   Card tone map keeps every surface inside the global palette:
     clay / forest = dark cards (cream type) · cream / oat = light cards.
   ===================================================================== */

const TONES = {
  clay: "bg-merry-clay text-merry-cream shadow-hard-merry",
  forest: "bg-merry-forest text-merry-cream shadow-hard-merry-clay",
  cream: "bg-merry-cream text-merry-forest shadow-hard-merry",
  oat: "bg-merry-oat text-merry-forest shadow-hard-merry-sm",
};

const CHIP_TONES = {
  clay: "border-merry-cream/60 text-merry-cream",
  forest: "border-merry-cream/60 text-merry-cream",
  cream: "border-merry-forest/50 text-merry-forest",
  oat: "border-merry-forest/50 text-merry-forest",
};

/* `current` takes no alpha modifier in Tailwind v3, so hairline dividers
   are resolved per tone instead of via border-current/25. */
const DIVIDER_TONES = {
  clay: "border-merry-cream/30",
  forest: "border-merry-cream/30",
  cream: "border-merry-forest/20",
  oat: "border-merry-forest/20",
};

const OUTLET_INDEX = MERRY_OUTLETS.findIndex((o) => o.flagship);
const directionsUrl = (o) =>
  `https://www.google.com/maps/search/?api=1&query=${o.coords.lat},${o.coords.lng}`;

const OutletCard = ({ outlet, index, active, onLocate }) => {
  const reduce = useReducedMotion();
  const tone = TONES[outlet.tone] || TONES.cream;
  const chipTone = CHIP_TONES[outlet.tone] || CHIP_TONES.cream;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.1 }}
      className={`relative flex flex-col gap-5 border-4 border-merry-forest p-7 sm:p-9 ${tone} ${outlet.span} ${outlet.rotate} ${
        active ? "outline outline-4 outline-offset-4 outline-merry-clay" : ""
      }`}
    >
      {/* big index numeral */}
      <span className="pointer-events-none absolute -top-2 right-5 font-slab text-6xl opacity-15 sm:text-7xl">
        {String(index + 1).padStart(2, "0")}
      </span>

      {outlet.flagship && (
        <span className="absolute -top-4 left-6 -rotate-3 border-2 border-merry-forest bg-merry-cream px-3 py-1.5 font-slab text-[10px] uppercase tracking-widest2 text-merry-forest shadow-hard-merry-sm">
          Flagship
        </span>
      )}

      <header className="pt-2">
        <p className="flex items-center gap-2 font-slab text-xs uppercase tracking-widest2 opacity-75">
          <HiOutlineMapPin className="h-4 w-4" />
          {outlet.city} · {outlet.area}
        </p>
        <h2 className="mt-3 text-3xl uppercase leading-[0.98] sm:text-4xl">
          {outlet.name}
        </h2>
      </header>

      <p className="max-w-md text-sm font-medium leading-relaxed opacity-90 sm:text-base">
        {outlet.address}
      </p>

      <div className="flex flex-wrap gap-2">
        {outlet.specialties.map((s) => (
          <span key={s} className={`border-2 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sm:text-[11px] ${chipTone}`}>
            {s}
          </span>
        ))}
      </div>

      <dl className={`mt-auto grid gap-2 border-t-2 pt-4 text-sm font-medium sm:text-[15px] ${DIVIDER_TONES[outlet.tone] || DIVIDER_TONES.cream}`}>
        <div className="flex items-center gap-2.5">
          <HiOutlinePhone className="h-4 w-4 shrink-0" />
          <dt className="sr-only">Phone</dt>
          <dd>
            <a href={`tel:${outlet.phone.replace(/\s/g, "")}`} className="underline-offset-4 hover:underline">
              {outlet.phone}
            </a>
          </dd>
        </div>
        <div className="flex items-center gap-2.5">
          <HiOutlineClock className="h-4 w-4 shrink-0" />
          <dt className="sr-only">Hours</dt>
          <dd>{outlet.hours}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => onLocate(outlet.id)}
          className="pressable inline-flex items-center gap-2 border-4 border-current bg-transparent px-5 py-2.5 font-slab text-xs uppercase tracking-wide"
        >
          <LeafIcon className="h-4 w-4" />
          Find on map
        </button>
        <a
          href={directionsUrl(outlet)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 border-b-2 border-current pb-0.5 font-slab text-xs uppercase tracking-widest2 opacity-70 transition-opacity hover:opacity-100"
        >
          Directions
          <HiOutlineArrowTopRightOnSquare className="h-3.5 w-3.5" />
        </a>
        <span className="ml-auto hidden font-slab text-[10px] uppercase tracking-widest2 opacity-60 sm:inline">
          {outlet.badge}
        </span>
      </div>
    </motion.article>
  );
};

const Outlets = () => {
  const [activeId, setActiveId] = useState(null);
  const mapFrameRef = useRef(null);

  const handleLocate = useCallback((id) => {
    setActiveId(id);
    mapFrameRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, []);

  return (
    <>
      {/* ── Header band ──────────────────────────────────────────────── */}
      <section className="border-b-4 border-merry-forest bg-merry-oat px-6 pb-14 pt-14 sm:px-10 lg:pb-20">
        <div className="mx-auto max-w-[1440px]">
          <p className="flex items-center gap-2.5 font-slab text-xs uppercase tracking-widest2 text-merry-clay sm:text-sm">
            <LeafIcon className="h-4 w-4" />
            Outlets
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl uppercase leading-[0.95] sm:text-7xl">
            Find us
            <br />
            in the <span className="text-merry-clay">wild</span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-medium leading-relaxed text-merry-forest/80 sm:text-lg">
            Five counters across three cities. Walk in for a free scalp
            consult, walk out with the right bottle — or just come smell the
            rosemary. Cash on delivery at every door.
          </p>
        </div>
      </section>

      {/* ── Asymmetric card grid ─────────────────────────────────────── */}
      <section className="bg-merry-cream px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-9">
          {MERRY_OUTLETS.map((outlet, i) => (
            <OutletCard
              key={outlet.id}
              outlet={outlet}
              index={i}
              active={activeId === outlet.id}
              onLocate={handleLocate}
            />
          ))}
        </div>
      </section>

      {/* ── Themed map ───────────────────────────────────────────────── */}
      <section ref={mapFrameRef} className="border-t-4 border-merry-forest bg-merry-forest px-6 py-14 sm:px-10 lg:py-20">
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-4xl uppercase leading-[0.98] text-merry-cream sm:text-5xl">
              The grove map
            </h2>
            <p className="max-w-sm text-sm font-medium text-merry-cream/75 sm:text-base">
              Click a card to fly the map — or a pin to raise its card.
              Painted in forest &amp; cream, like everything else we make.
            </p>
          </div>

          <div className="mt-10 border-4 border-merry-cream bg-merry-pine shadow-hard-merry-cream">
            <div className="h-[26rem] lg:h-[34rem]">
              <MerryMap outlets={MERRY_OUTLETS} activeId={activeId} onSelect={setActiveId} />
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t-4 border-merry-cream bg-merry-forest px-5 py-3.5 text-merry-cream">
              <span className="flex items-center gap-2 font-slab text-[10px] uppercase tracking-widest2 sm:text-[11px]">
                <span className="merry-pin merry-pin--inline" aria-hidden="true" />
                Counter
              </span>
              <span className="flex items-center gap-2 font-slab text-[10px] uppercase tracking-widest2 sm:text-[11px]">
                <span className="merry-pin merry-pin--inline merry-pin--flagship" aria-hidden="true" />
                Flagship — The Grove, Karachi
              </span>
              <span className="ml-auto hidden text-[10px] font-bold uppercase tracking-wider text-merry-cream/60 sm:inline">
                {MERRY_OUTLETS.length} outlets · {new Set(MERRY_OUTLETS.map((o) => o.city)).size} cities
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Outlets;
