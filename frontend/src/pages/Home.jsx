import HeroApocalypse from "../components/apocalypse/HeroApocalypse.jsx";
import MarqueeBanner from "../components/apocalypse/MarqueeBanner.jsx";
import JaggedDivider from "../components/apocalypse/JaggedDivider.jsx";
import ProductSlider from "../components/apocalypse/ProductSlider.jsx";
import StoryCollage from "../components/apocalypse/StoryCollage.jsx";
import StickyWhyApart from "../components/apocalypse/StickyWhyApart.jsx";
import HairQuizCTA from "../components/apocalypse/HairQuizCTA.jsx";

/* =====================================================================
   HOME — the "Apocalypse" takeover.
   Section rhythm alternates charcoal / ember / cream, and every colour
   change is bridged by a jagged, torn, dripped or wavy SVG divider —
   never a straight line.

   Palette hexes mirror tailwind.config.js (apoc.*):
     soot #0f0c09 · coal #181410 · bone #f2ebdc · paper #e8dfca
     ember #d95312 · rust #a63c11
   ===================================================================== */
const C = {
  soot: "#0f0c09",
  coal: "#181410",
  bone: "#f2ebdc",
  paper: "#e8dfca",
  ember: "#d95312",
};

const Home = () => (
  <div className="bg-apoc-soot font-grotesk">
    {/* 1 — Hero: "IT'S THE END... OF BAD HAIRCARE." */}
    <HeroApocalypse />

    {/* 2 — Fast marquee band, slightly cocked, bleeding off both edges */}
    <div className="relative z-20 -mt-6 sm:-mt-8">
      <MarqueeBanner
        text="THE LAST HAIR OIL YOU'LL EVER NEED"
        icon="skull"
        bg="bg-apoc-ember"
        fg="text-apoc-soot"
        border="border-y-4 border-apoc-soot"
        rotate={-1.2}
        duration={13}
        className="apoc-bleed shadow-hard-ink"
      />
    </div>

    {/* ember band → soot slider: dripped edge */}
    <JaggedDivider from={C.ember} to={C.soot} variant="drip" seed={11} height={64} className="-mt-3" />

    {/* 3 — The product slider */}
    <ProductSlider />

    {/* soot → paper: jagged tear */}
    <JaggedDivider from={C.soot} to={C.paper} variant="jagged" seed={4} height={80} />

    {/* 4 — Chaotic newspaper-collage timeline */}
    <StoryCollage />

    {/* paper → coal: torn edge */}
    <JaggedDivider from={C.paper} to={C.coal} variant="torn" seed={9} flip height={72} />

    {/* 5 — Sticky "FUEL FOR YOUR SCALP" doctrine */}
    <StickyWhyApart />

    {/* coal → ember: big uneven wave */}
    <JaggedDivider from={C.coal} to={C.ember} variant="wave" seed={21} height={96} />

    {/* 6 — "Find your formula" quiz banner */}
    <HairQuizCTA />

    {/* ember → soot footer: second marquee as the closing band */}
    <div className="relative z-20 -mb-4">
      <MarqueeBanner
        text="SMALL BATCH • NUMBERED • GONE FOREVER WHEN SOLD OUT"
        icon="drop"
        reverse
        bg="bg-apoc-soot"
        fg="text-apoc-bone"
        border="border-y-4 border-apoc-ember"
        rotate={1}
        duration={18}
        className="apoc-bleed"
        textClass="text-base sm:text-xl"
      />
    </div>
  </div>
);

export default Home;
