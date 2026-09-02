/* =====================================================================
   MERRY CONTENT — brand copy, quiz content and map theming.

   This file is deliberately NOT a catalogue anymore. Products live in
   MongoDB and reach the pages through `GET /api/products`
   (see `src/hooks/useProducts.js`); what stays here is the content that
   has no business in a database yet: the brand timeline, the quiz
   questions and its goal→slug map, the marquee lines, the homepage
   feature copy and the map's "Forest & Cream" theme.

   Keeping a hardcoded product list here is what broke checkout: the shop
   rendered ids like `merry-p1` that existed in no collection, so
   `Product.findById()` found nothing and every order 404'd. Inventory
   is now single-sourced from the API.
   ===================================================================== */

import bottleAmber from "../../assets/apoc/bottle-amber.jpg";
import bottleRust from "../../assets/apoc/bottle-rust.jpg";
import oilBoxStanding from "../../assets/oil-box-bottle-standing.jpg";
import oilFlatlay from "../../assets/oil-flatlay-diagonal.jpg";
import boxFur from "../../assets/box.jpg";

/* ---------------------------------------------------------------------
   TIMELINE — the brand's formulation history, mapped through the
   CollageTimeline component. `pos` pins each polaroid to the desktop
   collage canvas (percent offsets), `rotate` is its tilt in degrees.
   Five entries match the component's five string-pins exactly.
   --------------------------------------------------------------------- */
export const MERRY_TIMELINE = [
  {
    year: "2019",
    caption:
      "One grandmother's recipe, one copper pot. The first batch is pressed for a niece's postpartum hair loss — it never loses.",
    image: bottleAmber,
    rotate: -6,
    pos: "lg:left-[3%] lg:top-[1%]",
  },
  {
    year: "2020",
    caption:
      "Forty bottles pressed on a kitchen stove sell out in a weekend. The waiting list hits three hundred. The kitchen loses.",
    image: oilFlatlay,
    rotate: 4,
    pos: "lg:left-[52%] lg:top-[8%]",
  },
  {
    year: "2022",
    caption:
      "The lab years. Every oil pH-tested, every batch logged. The blend settles at eight oils — and refuses to grow further.",
    image: oilBoxStanding,
    rotate: -3,
    pos: "lg:left-[12%] lg:top-[36%]",
  },
  {
    year: "2024",
    caption:
      "Five outlets across three cities, a proper cold-press floor, and 12,000 bottles gone. Still zero chemicals in the ledger.",
    image: boxFur,
    rotate: 5,
    pos: "lg:left-[56%] lg:top-[45%]",
  },
  {
    year: "Today",
    caption:
      "Same pot, same patience, a lot more hair to care for. Next up: refillable clay bottles and a compostable cap.",
    image: bottleRust,
    rotate: -4,
    pos: "lg:left-[31%] lg:top-[70%]",
  },
];

/* ---------------------------------------------------------------------
   HAIR QUIZ — four chunky-toggle steps and a result mapper.

   Each step: { id, eyebrow, question, hint, key, options[] }.
   `answers[step.key] = option.value`. `recommend(answers)` returns the
   winning product slug + a personalised ritual built from the answers.
   --------------------------------------------------------------------- */
export const MERRY_QUIZ_STEPS = [
  {
    id: "type",
    key: "hairType",
    eyebrow: "Question 01 — The basics",
    question: "What is your hair type?",
    hint: "How your hair behaves on a normal day, zero products.",
    options: [
      { value: "dry", label: "Dry", sub: "Sucks up every drop of oil" },
      { value: "oily", label: "Oily", sub: "Greasy roots by sunset" },
      { value: "normal", label: "Normal", sub: "Behaves, mostly" },
    ],
  },
  {
    id: "goal",
    key: "goal",
    eyebrow: "Question 02 — The mission",
    question: "What's the number one thing you want to fix?",
    hint: "Pick the one that stings the most. We can fix the rest later.",
    options: [
      { value: "growth", label: "Grow new hair", sub: "Thin edges, sparse spots" },
      { value: "hairfall", label: "Stop hair fall", sub: "Drains and pillows know" },
      { value: "frizz", label: "Beat frizz", sub: "Humidity always wins" },
      { value: "dandruff", label: "Calm dandruff", sub: "Shoulders say sorry" },
    ],
  },
  {
    id: "scalp",
    key: "scalp",
    eyebrow: "Question 03 — The roots",
    question: "How does your scalp feel by evening?",
    hint: "The scalp is skin. We treat it like it.",
    options: [
      { value: "tight", label: "Tight & dry", sub: "Pulls when you raise a brow" },
      { value: "greasy", label: "Greasy", sub: "One day after wash day" },
      { value: "itchy", label: "Itchy & flaky", sub: "The scratch test fails" },
      { value: "fine", label: "Just fine", sub: "No complaints" },
    ],
  },
  {
    id: "time",
    key: "ritual",
    eyebrow: "Question 04 — The ritual",
    question: "How much time will you actually give this?",
    hint: "Be honest. The best routine is the one you keep.",
    options: [
      { value: "overnight", label: "Overnight", sub: "Sleep in it, wake up soft" },
      { value: "hour", label: "One hour pre-wash", sub: "Sunday-oil-champi energy" },
      { value: "quick", label: "Quick 20 minutes", sub: "In, out, out the door" },
    ],
  },
];

/* Result map: the quiz "goal" picks the hero product, hair type tunes
   the size, scalp and ritual answers build the personalised routine. */
const GOAL_PRODUCTS = {
  growth: "hair-care-oil",
  hairfall: "amla-strength-oil",
  frizz: "ember-elixir-hair-oil",
  dandruff: "rosemary-scalp-serum",
};

const SIZE_BY_TYPE = {
  dry: { size: "200ml", note: "Dry hair drinks fast — the 200ml pays for itself." },
  oily: { size: "100ml", note: "Oily roots need less, more often. The 100ml is your friend." },
  normal: { size: "200ml", note: "Normal hair + the 200ml = a very lazy, very shiny year." },
};

const SCALP_STEP = {
  tight: "Warm the oil between your palms first — cold oil on a tight scalp is nobody's friend.",
  greasy: "Keep it to the scalp massage; skip slicking the roots. Rinse well, twice.",
  itchy: "Massage with fingertips only (no nails), five full minutes. The itch usually clocks out by week two.",
  fine: "You've got headroom — push the massage to a full ten minutes for the growth boost.",
};

const RITUAL_LINE = {
  overnight: "Apply before bed, wrap in a soft cloth, sleep in it. Wash out in the morning shower.",
  hour: "Work it in an hour before your shower and let the steam do the heavy lifting.",
  quick: "Twenty focused minutes with a hot-towel wrap, then wash. Small ritual, real results.",
};

/**
 * Map quiz answers onto a recommendation.
 *
 * `products` is the LIVE catalogue (GET /api/products). The questions, the
 * ritual copy and the goal→slug map are content and stay here; the bottle
 * itself comes from the database, because the result screen has an
 * "Add to cart" button on it — a mock id there is a checkout that 404s.
 *
 * Returns `product: null` when the shelf is empty; the caller decides how
 * to say so.
 */
export const recommend = (answers = {}, products = []) => {
  const slug = GOAL_PRODUCTS[answers.goal] || "hair-care-oil";
  // The goal→slug map is a content nicety, never a gate: if that bottle
  // isn't on the shelf, recommend whatever is rather than nothing.
  const product = products.find((p) => p.slug === slug) || products[0] || null;
  const size = SIZE_BY_TYPE[answers.hairType] || SIZE_BY_TYPE.normal;

  if (!product) {
    return {
      product: null,
      headline: "Your scalp called. We answered.",
      sizeNote: size.note,
      ritual: [],
    };
  }

  return {
    product,
    headline:
      answers.goal === "dandruff"
        ? "Your scalp called. We answered."
        : product.tagline || "Your bottle is waiting.",
    sizeNote: size.note,
    ritual: [
      `Start with ${product.name} — ${product.size || "a bottle"} of cold-pressed patience.`,
      SCALP_STEP[answers.scalp] || SCALP_STEP.fine,
      RITUAL_LINE[answers.ritual] || RITUAL_LINE.hour,
      "Twice a week for eight weeks. Your hairline will report back.",
    ],
  };
};

/* ---------------------------------------------------------------------
   OUTLETS — physical retail partners. `coords` feeds both the cards
   ("Get directions") and the Leaflet pins; `span` drives the
   asymmetric grid on /outlets (12-col spans per card).
   --------------------------------------------------------------------- */
export const MERRY_OUTLETS = [
  {
    id: "karachi-flagship",
    name: "The Grove — Flagship",
    city: "Karachi",
    area: "DHA Phase 6",
    address: "14-C Khayaban-e-Shahbaz, Bukhari Commercial, DHA Phase 6",
    phone: "+92 21 3584 2210",
    hours: "Mon–Sat · 11am – 9pm",
    flagship: true,
    badge: "Oil bar + scalp consults",
    specialties: ["Fill your own bottle", "Free scalp check", "Full range"],
    coords: { lat: 24.8206, lng: 67.0351 },
    span: "lg:col-span-7",
    rotate: "lg:-rotate-1",
    tone: "clay",
  },
  {
    id: "karachi-dolmen",
    name: "Dolmen Mall Kiosk",
    city: "Karachi",
    area: "Clifton",
    address: "Ground Floor, Dolmen Mall Clifton, Block 4",
    phone: "+92 21 3583 9917",
    hours: "Daily · 12pm – 10pm",
    flagship: false,
    badge: "Quiz-fitting counter",
    specialties: ["Hair quiz on the spot", "Travel minis"],
    coords: { lat: 24.8107, lng: 67.0311 },
    span: "lg:col-span-5",
    rotate: "lg:rotate-1",
    tone: "cream",
  },
  {
    id: "lahore-liberty",
    name: "Liberty Market Shop",
    city: "Lahore",
    area: "Gulberg III",
    address: "Shop 22, Main Boulevard, Liberty Market",
    phone: "+92 42 3575 4482",
    hours: "Mon–Sat · 12pm – 9pm",
    flagship: false,
    badge: "Heritage counter",
    specialties: ["Family bundles", "Refill discount"],
    coords: { lat: 31.5155, lng: 74.3436 },
    span: "lg:col-span-5",
    rotate: "lg:rotate-1",
    tone: "forest",
  },
  {
    id: "lahore-packages",
    name: "Packages Mall Counter",
    city: "Lahore",
    area: "Gulberg",
    address: "First Floor, Packages Mall, Main Ferozepur Road",
    phone: "+92 42 111 935 579",
    hours: "Daily · 11am – 10pm",
    flagship: false,
    badge: "Newest opening",
    specialties: ["Full range", "Gift sets"],
    coords: { lat: 31.5697, lng: 74.3099 },
    span: "lg:col-span-7",
    rotate: "lg:-rotate-1",
    tone: "oat",
  },
  {
    id: "islamabad-f7",
    name: "F-7 Markaz Studio",
    city: "Islamabad",
    area: "F-7",
    address: "Unit 3, Building 9, F-7 Markaz",
    phone: "+92 51 261 3345",
    hours: "Mon–Sat · 11am – 8pm",
    flagship: false,
    badge: "Quietest one — bring a book",
    specialties: ["Skin line focus", "Scalp consults"],
    coords: { lat: 33.7296, lng: 73.0546 },
    span: "lg:col-span-12",
    rotate: "lg:rotate-0",
    tone: "cream",
  },
];

/* ---------------------------------------------------------------------
   MAP THEME — "Forest & Cream", a custom map-style JSON in Mapbox GL
   structure. It is the single source of truth for the map's look:

     • With a Mapbox/MapTiler token: pass this object straight to
       mapboxgl.Map({ style: MAP_STYLE }) — the paints below are valid
       Mapbox GL layer definitions.
     • Without a token (our case): MerryMap applies MAP_STYLE.tiles
       .cssFilter to free OSM raster tiles, deriving the same forest-
       and-cream grade from the colors declared here.

   Swapping the hexes here re-skins both modes — no component edits.
   --------------------------------------------------------------------- */
export const MAP_STYLE = {
  version: 8,
  name: "Well's Merry — Forest & Cream",
  light: "OpenStreetMap",
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
  sources: {
    merry: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#1A2E24" } },
    { id: "land", type: "raster", source: "merry", paint: { "raster-opacity": 0.92 } },
    {
      id: "parks",
      type: "background",
      paint: { "background-color": "#24382C" },
      metadata: { note: "green belts — pine" },
    },
    {
      id: "water",
      type: "symbol",
      paint: { "text-color": "#9DB4A4" },
      metadata: { note: "water labels — sage" },
    },
    {
      id: "roads",
      type: "symbol",
      paint: { "text-color": "#F9F6F0" },
      metadata: { note: "road labels — cream" },
    },
    {
      id: "buildings",
      type: "background",
      paint: { "background-color": "#3E5C49" },
      metadata: { note: "built-up — moss" },
    },
  ],
  /* Raster-grade fallback for keyless embeds — derived from the palette
     above: sepia warms OSM's cream land, hue-rotate pushes it into the
     forest greens, brightness sinks it to the deep-green base. */
  tiles: {
    cssFilter: "sepia(0.85) hue-rotate(60deg) saturate(1.5) brightness(0.62) contrast(1.06)",
    marker: "#C17754",
    markerStroke: "#F9F6F0",
  },
};

export const MAP_CENTER = { lat: 30.62, lng: 70.4 }; // centred on Pakistan

/* ---------------------------------------------------------------------
   HOME EXTRAS — features for the pinned-scroll block + marquee items.
   --------------------------------------------------------------------- */
export const HOME_FEATURES = [
  {
    icon: "sprout",
    tone: "cream",
    title: "It Grows New Hair",
    text: "Rice bran and wheat germ feed dormant follicles the fatty acids they've been starving for. Give it eight weeks — your hairline will file a report.",
  },
  {
    icon: "drop",
    tone: "forest",
    title: "Cold-Pressed, Never Heated",
    text: "Heat murders nutrients. Every oil in the bottle is pressed slowly at room temperature on our own floor, so the vitamins arrive at your scalp alive.",
  },
  {
    icon: "leaf",
    tone: "clay",
    title: "Eight Oils, Zero Chemicals",
    text: "Sesame, almond, coconut, walnut, olive and friends. No sulfates, no silicones, no parabens — nothing your grandmother couldn't pronounce.",
  },
  {
    icon: "sun",
    tone: "oat",
    title: "Shine Without The Grease",
    text: "A lightweight blend that sinks in instead of sitting on top. Frizz calms down, light bounces back, pillowcases stay in the clear.",
  },
  {
    icon: "hand",
    tone: "cream",
    title: "Safe For The Whole House",
    text: "Gentle enough for the kids' braids, strong enough for bleach damage. One bottle on the shelf, every head covered — cash on delivery, no risk.",
  },
];

export const HERO_MARQUEE_ITEMS = [
  "100% Organic",
  "Cold-Pressed",
  "Cash On Delivery",
  "Eight Hero Oils",
  "Zero Chemicals",
  "Family Safe",
];

export const SHOP_MARQUEE_ITEMS = [
  "Free delivery over Rs. 5,000",
  "Fill your own bottle at The Grove",
  "Refills save 15%",
  "Not sure? Take the quiz",
];

/* ---------------------------------------------------------------------
   REAL RESULTS — short, punchy 5-star review snippets for the social
   proof marquee on the homepage (components/merry/RealResultsBanner).
   Deliberately one-liners: the band scrolls, so anything longer than a
   breath is unreadable at speed.
   --------------------------------------------------------------------- */
export const MERRY_REVIEW_SNIPPETS = [
  { quote: "Saved my hairline.", author: "Ahmed" },
  { quote: "Zero frizz, finally.", author: "Sara" },
  { quote: "Baby hairs are back.", author: "Hina" },
  { quote: "My barber asked what I use.", author: "Bilal" },
  { quote: "Shedding stopped in 3 weeks.", author: "Mahnoor" },
  { quote: "Smells like a real kitchen.", author: "Usman" },
  { quote: "No greasy pillow. At last.", author: "Zoya" },
  { quote: "Dandruff gone by week two.", author: "Faisal" },
  { quote: "Two bottles in. No going back.", author: "Areeba" },
  { quote: "Softest my hair has ever been.", author: "Danish" },
];
