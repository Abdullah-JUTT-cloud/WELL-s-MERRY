import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useProducts } from "../../hooks/useProducts.js";
import StampBadge from "./StampBadge.jsx";
import { DropIcon, SkullIcon, FlameIcon } from "./icons.jsx";

/* =====================================================================
   HeroApocalypse — the "IT'S THE END... OF BAD HAIRCARE." opener.
   Left: oversized aggressive stacked typography.
   Right: 3–4 product bottles stamped onto the page at hard angles,
   overlapping sticker frames + rotating circular geographic badges.

   The bottles are the first products in the live catalogue, not a
   hardcoded set: this hero used to look products up by invented ids
   ("wm-last-hair-oil") that match no document in Mongo.
   ===================================================================== */

/* Hero composition — where each bottle gets stamped onto the canvas.
   Positions/rotations are percentages of the hero visual canvas; the
   bottle in each slot is whatever the catalogue returns, in order, so a
   new admin product shows up here without a code change. */
const HERO_SLOTS = [
  { x: 6, y: 4, w: 47, rot: -6, z: 2, delay: 0.15 },
  { x: 48, y: 0, w: 42, rot: 5, z: 1, delay: 0.3 },
  { x: 0, y: 46, w: 40, rot: 4, z: 3, delay: 0.45 },
  { x: 42, y: 40, w: 46, rot: -4, z: 4, delay: 0.6 },
];

const HEADLINE = [
  { text: "IT'S THE END", cls: "text-apoc-soot" },
  { text: "OF BAD", cls: "text-apoc-soot" },
  { text: "HAIRCARE.", cls: "text-apoc-ember font-distressed" },
];

const HeroApocalypse = () => {
  const reduce = useReducedMotion();
  const { products } = useProducts();

  return (
    <section className="relative bg-apoc-bone text-apoc-soot apoc-noise overflow-hidden">
      {/* Newspaper-column ghost texture + halftone corners */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #0f0c09 0 1px, transparent 1px 46px)",
        }}
      />
      <div aria-hidden="true" className="absolute -top-10 -left-10 w-72 h-72 apoc-halftone text-apoc-rust opacity-25 pointer-events-none" />
      <div aria-hidden="true" className="absolute bottom-6 right-1/3 w-80 h-40 apoc-halftone text-apoc-soot opacity-15 pointer-events-none" />

      <div className="container-content relative z-10 px-4 sm:px-6 pt-10 sm:pt-14 pb-20 sm:pb-28">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-6 items-center">
          {/* ================= LEFT — AGGRESSIVE TYPE ================= */}
          <div className="lg:col-span-7 relative z-20">
            {/* Stamp row */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="flex flex-wrap items-center gap-3 mb-6 sm:mb-8"
            >
              <span className="inline-flex items-center gap-2 bg-apoc-soot text-apoc-bone border-2 border-apoc-soot shadow-hard-ember px-3 py-1.5 text-[10px] sm:text-[11px] font-black tracking-[0.18em] uppercase -rotate-2">
                <FlameIcon className="w-3.5 h-3.5 text-apoc-ember" />
                Est. 2023 — Lahore, PK
              </span>
              <span className="inline-flex items-center gap-2 bg-apoc-bone border-2 border-apoc-soot shadow-hard-ink px-3 py-1.5 text-[10px] sm:text-[11px] font-black tracking-[0.18em] uppercase rotate-1">
                <SkullIcon className="w-3.5 h-3.5 text-apoc-rust" />
                No sulfates. No mercy.
              </span>
            </motion.div>

            {/* Oversized stacked headline */}
            <h1 className="font-apoc uppercase leading-[0.86] tracking-[-0.02em] mb-6 sm:mb-8">
              {HEADLINE.map((line, i) => (
                <motion.span
                  key={line.text}
                  className={`block ${line.cls} ${i === 2 ? "text-[13vw] sm:text-[9vw] lg:text-[6.6vw]" : "text-[13vw] sm:text-[9vw] lg:text-[6.6vw]"}`}
                  initial={reduce ? false : { opacity: 0, y: 60, rotate: i % 2 ? 1.5 : -1 }}
                  animate={{ opacity: 1, y: 0, rotate: i === 1 ? -1 : 0 }}
                  transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.1 + i * 0.12 }}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            {/* Body copy */}
            <motion.p
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="font-grotesk font-semibold text-base sm:text-lg max-w-xl leading-relaxed mb-8 sm:mb-10 text-apoc-soot/85"
            >
              Well&apos;s Merry bottles fifteen cold-pressed organic oils into one
              ruthless little weapon against frizz, fallout and fried ends.
              Chemical-free, family-safe, small-batch — and absolutely done
              playing nice with bad hair days.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 sm:gap-5 mb-10 sm:mb-12"
            >
              <motion.div whileHover={{ y: -4, rotate: -1 }} whileTap={{ scale: 0.96 }}>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-3 bg-apoc-ember text-apoc-soot border-4 border-apoc-soot shadow-hard-ink px-8 py-4 font-apoc uppercase text-sm sm:text-base tracking-wide"
                >
                  Shop the oils <span aria-hidden="true">→</span>
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -4, rotate: 1 }} whileTap={{ scale: 0.96 }}>
                <a
                  href="#apoc-story"
                  className="inline-flex items-center gap-3 bg-transparent text-apoc-soot border-4 border-apoc-soot px-8 py-4 font-apoc uppercase text-sm sm:text-base tracking-wide hover:bg-apoc-soot hover:text-apoc-bone transition-colors"
                >
                  Read the files
                </a>
              </motion.div>
            </motion.div>

            {/* Stat strip */}
            <motion.ul
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-wrap gap-x-8 gap-y-2 font-grotesk font-extrabold text-[11px] sm:text-xs uppercase tracking-[0.16em]"
            >
              <li>15 cold-pressed oils</li>
              <li className="text-apoc-rust">0 sulfates</li>
              <li>100% organic</li>
              <li className="text-apoc-rust">Batch № 047</li>
            </motion.ul>
          </div>

          {/* ================= RIGHT — STAMPED BOTTLES ================= */}
          <div className="lg:col-span-5 relative z-10">
            <div className="relative h-[420px] sm:h-[520px] lg:h-[600px]">
              {HERO_SLOTS.map((slot, i) => {
                const product = products[i];
                if (!product) return null;
                return (
                  <motion.div
                    key={product._id}
                    className="absolute"
                    style={{
                      left: `${slot.x}%`,
                      top: `${slot.y}%`,
                      width: `${slot.w}%`,
                      zIndex: slot.z,
                    }}
                    initial={reduce ? false : { opacity: 0, scale: 1.7, rotate: slot.rot * 2 }}
                    animate={{ opacity: 1, scale: 1, rotate: slot.rot }}
                    transition={{ type: "spring", stiffness: 140, damping: 15, delay: slot.delay }}
                  >
                    {/* idle float wrapper keeps the stamp-in spring clean */}
                    <motion.div
                      animate={reduce ? undefined : { y: [0, -10, 0] }}
                      transition={{ duration: 5 + slot.z, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 0, zIndex: 40 }}
                        className="bg-apoc-bone border-4 border-apoc-soot shadow-hard-ink p-2 sm:p-3"
                      >
                        <img
                          src={product.images?.[0]}
                          alt={product.name}
                          className="w-full aspect-[3/4] object-cover border-2 border-apoc-soot/20"
                          draggable={false}
                        />
                        <p className="font-condensed uppercase text-center text-[10px] sm:text-xs tracking-[0.2em] pt-1.5 sm:pt-2">
                          {product.name}
                        </p>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}

              {/* Floating circular badges — geographic / certification stamps */}
              <StampBadge
                text="CERTIFIED ORGANIC • 100% NATURAL • "
                center={<DropIcon className="w-9 h-9 text-apoc-rust" />}
                className="absolute -left-3 sm:-left-6 top-[38%] z-30"
                size={112}
              />
              <StampBadge
                text="DESTINATION: LAHORE, PK • SHIP WORLDWIDE • "
                center={<SkullIcon className="w-8 h-8 text-apoc-ember" />}
                bg="bg-apoc-ember"
                className="absolute right-0 sm:-right-4 bottom-[6%] z-30"
                size={128}
                spin={32}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroApocalypse;
