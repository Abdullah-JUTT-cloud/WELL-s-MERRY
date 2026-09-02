/* =====================================================================
   MERRY MOCK DATA — the single seam every Merry page reads from.

   Everything on /, /shop, /story, /quiz and /outlets is driven by the
   arrays in this file, so the whole experience runs without a backend.
   Shapes intentionally mirror the real API resources (Product, Outlet)
   so swapping `MERRY_*` for live `getProducts()` / `getOutlets()` calls
   later is a one-line change per page.

   Product images reuse the studio bottle photography already shipped in
   `src/assets/` (and the apocalypse set, which was shot on the same
   cream backdrop — it reads as one brand family).
   ===================================================================== */

import bottleAmber from "../../assets/apoc/bottle-amber.jpg";
import bottleRust from "../../assets/apoc/bottle-rust.jpg";
import bottleDropper from "../../assets/apoc/bottle-dropper.jpg";
import bottlePump from "../../assets/apoc/bottle-black-pump.jpg";
import oilLyingPump from "../../assets/oil-lying-pump.jpg";
import oilBoxStanding from "../../assets/oil-box-bottle-standing.jpg";
import oilFlatlay from "../../assets/oil-flatlay-diagonal.jpg";
import oilLabel from "../../assets/oil-ingredients-label.jpg";
import boxFur from "../../assets/box.jpg";

/* ---------------------------------------------------------------------
   PRODUCTS — 6 hair care + 3 skin care.
   `sizes` feeds the MagneticProductCard quick-add row; `badge` feeds
   the rotated corner stamp; `category` drives the /shop filter tabs.
   --------------------------------------------------------------------- */
export const MERRY_PRODUCTS = [
  {
    _id: "merry-p1",
    slug: "hair-care-oil",
    name: "Hair Care Oil",
    tagline: "The original eight-oil blend. Where every hair story starts.",
    category: "hair-care",
    price: 1880,
    compareAtPrice: 2250,
    size: "200ml",
    stock: 42,
    rating: 4.9,
    numReviews: 231,
    badge: "Bestseller",
    images: [bottleAmber, oilBoxStanding, oilFlatlay],
    sizes: [
      { label: "100ml", price: 1180 },
      { label: "200ml", price: 1880 },
    ],
    shortDescription:
      "100% organic hair oil — deeply moisturizing for softness & shine. Chemical free, safe for all hair types.",
    description:
      "The bottle that built the brand. Eight cold-pressed organic oils — rice bran, sesame, wheat germ, sweet almond, coconut, walnut, olive and jojoba — slow-blended in small batches with henna, amla and fenugreek extracts. It feeds the scalp, calms the frizz and coaxes dormant follicles back to work. Nothing your grandmother couldn't pronounce.",
    benefits: [
      "Grows new hair",
      "Deep shine",
      "Removes frizz",
      "Chemical free",
      "Dandruff remover",
      "Strengthens strands",
    ],
    ingredients: [
      "Rice bran oil",
      "Sesame seed oil",
      "Wheat germ oil",
      "Sweet almond oil",
      "Coconut oil",
      "Walnut oil",
      "Olive oil",
      "Jojoba oil",
      "Henna leaf extract",
      "Amla seed oil",
      "Fenugreek extract",
    ],
    howToUse:
      "Massage a small amount into the scalp in slow circles. Work the rest through your lengths. Leave for at least one hour — overnight for the deep fix — then wash with a mild shampoo. Two to three times a week.",
  },
  {
    _id: "merry-p2",
    slug: "ember-elixir-hair-oil",
    name: "Ember Elixir — Rosemary & Amla",
    tagline: "The stimulating one. Rosemary heat, amla bite.",
    category: "hair-care",
    price: 2150,
    compareAtPrice: null,
    size: "100ml",
    stock: 28,
    rating: 4.8,
    numReviews: 64,
    badge: "New batch",
    images: [bottleRust, bottleAmber],
    sizes: [
      { label: "50ml", price: 1280 },
      { label: "100ml", price: 2150 },
    ],
    shortDescription:
      "A warming rosemary-and-amla scalp elixir that wakes up sleepy follicles and boosts circulation at the root.",
    description:
      "Our spiciest blend. French rosemary oil and cold-pressed amla are steeped into a sesame-coconut base to create a gentle, warming scalp treatment. Circulation rises, follicles wake up, and week-old itchy patches calm down. The clay bottle is fired locally — refill it, we beg.",
    benefits: ["Wakes follicles", "Boosts circulation", "Soothes itch", "Amla-powered"],
    ingredients: ["Rosemary oil", "Amla oil", "Sesame oil", "Coconut oil", "Clove extract"],
    howToUse:
      "Part the hair in sections, drop directly onto the scalp, and massage for five minutes. Expect a gentle warmth — that's the rosemary working. Wash out after an hour or sleep in it.",
  },
  {
    _id: "merry-p3",
    slug: "midnight-scalp-oil",
    name: "Midnight Scalp Oil",
    tagline: "The overnight repair crew. Sleep in it, wake up softer.",
    category: "hair-care",
    price: 1950,
    compareAtPrice: null,
    size: "100ml",
    stock: 35,
    rating: 4.7,
    numReviews: 88,
    badge: "Overnight",
    images: [bottlePump, oilFlatlay],
    sizes: [{ label: "100ml", price: 1950 }],
    shortDescription:
      "A heavier, slow-absorbing night oil with wheat germ and walnut for deep repair while you sleep.",
    description:
      "Designed for pillowcases, not desks. Wheat germ and walnut oils are thicker and slower to absorb, which is exactly the point — they keep working through the night on damaged lengths and dry ends. Pump a few drops into your palms, press through the last two inches of hair, and let the dark hours do the rest.",
    benefits: ["Night repair", "Fixes dry ends", "Slow-release moisture"],
    ingredients: ["Wheat germ oil", "Walnut oil", "Almond oil", "Vitamin E"],
    howToUse:
      "Thirty minutes before bed, press 3–5 drops through dry lengths and ends. Wrap, braid, or sleep free — it absorbs by morning. Two to three nights a week.",
  },
  {
    _id: "merry-p4",
    slug: "amla-strength-oil",
    name: "Amla Strengthening Oil",
    tagline: "For hair that snaps when you look at it wrong.",
    category: "hair-care",
    price: 2050,
    compareAtPrice: 2400,
    size: "200ml",
    stock: 19,
    rating: 4.8,
    numReviews: 112,
    badge: "Strong hold",
    images: [oilBoxStanding, bottleAmber, oilLabel],
    sizes: [{ label: "200ml", price: 2050 }],
    shortDescription:
      "Protein-rich amla and henna steeped in eight oils to reinforce the strand from cuticle to tip.",
    description:
      "Breakage is a protein problem. This blend packs amla (the strongest natural source of vitamin C for hair) and henna leaf into our base eight oils, reinforcing the cuticle so strands bend instead of snap. Built for bleach survivors, heat stylers and tight-bun enthusiasts.",
    benefits: ["Stops breakage", "Protein repair", "Heat protection", "Thicker feel"],
    ingredients: ["Amla oil", "Henna extract", "Rice bran oil", "Sesame oil", "Coconut oil"],
    howToUse:
      "Apply to scalp and lengths once a week as a 90-minute pre-wash mask. For chronically fragile hair, keep it on overnight twice a week.",
  },
  {
    _id: "merry-p5",
    slug: "henna-gloss-tonic",
    name: "Henna Gloss Tonic",
    tagline: "The shine cheat. Ten minutes to glass hair.",
    category: "hair-care",
    price: 1450,
    compareAtPrice: null,
    size: "150ml",
    stock: 51,
    rating: 4.6,
    numReviews: 47,
    images: [oilFlatlay, oilLyingPump],
    sizes: [{ label: "150ml", price: 1450 }],
    shortDescription:
      "A lightweight henna-and-rice-bran rinse-out gloss that smooths the cuticle flat so light bounces back.",
    description:
      "Not a treatment — a cheat code. A whisper-light tonic of rice bran oil and henna gloss that lays the cuticle flat on contact. Ten minutes in the shower and your hair reads like glass under any light. Zero tint: it will not color your hair.",
    benefits: ["Instant shine", "Anti-frizz finish", "No color deposit"],
    ingredients: ["Rice bran oil", "Henna gloss", "Jojoba oil", "Hibiscus extract"],
    howToUse:
      "Smooth through wet hair from ears down, wait ten minutes, rinse cool. Safe to use every wash day.",
  },
  {
    _id: "merry-p6",
    slug: "family-ritual-set",
    name: "The Family Ritual Set",
    tagline: "One shelf, every head in the house covered.",
    category: "hair-care",
    price: 4900,
    compareAtPrice: 5600,
    size: "4-piece set",
    stock: 12,
    rating: 5.0,
    numReviews: 36,
    badge: "Gift ready",
    images: [boxFur, bottleAmber, bottlePump, oilBoxStanding],
    sizes: [{ label: "Set of 4", price: 4900 }],
    shortDescription:
      "Hair Care Oil, Midnight Scalp Oil, Amla Strength and the Scalp Serum, boxed in kraft with a hand-tied ribbon.",
    description:
      "The whole shelf in one box: the 200ml original, the Midnight overnight oil, the Amla Strength repair blend and the 50ml Rosemary Scalp Serum. Packed in a kraft gift box with our ritual card — because 'which bottle is mine?' is a real Sunday-morning problem.",
    benefits: ["Four full bottles", "Kraft gift box", "Ritual card included", "Saves Rs. 700"],
    ingredients: ["See individual bottles"],
    howToUse: "One shelf. Everyone's hair covered. Pass the box around.",
  },
  {
    _id: "merry-p7",
    slug: "rosemary-scalp-serum",
    name: "Rosemary Scalp Serum",
    tagline: "Scalp care is skin care. Treat the soil, not just the crop.",
    category: "skin-care",
    price: 1450,
    compareAtPrice: null,
    size: "50ml",
    stock: 60,
    rating: 4.8,
    numReviews: 129,
    badge: "Scalp care",
    images: [bottleDropper, bottleAmber],
    sizes: [{ label: "50ml", price: 1450 }],
    shortDescription:
      "A featherweight leave-in dropper serum that keeps the scalp balanced between wash days.",
    description:
      "We make one rule-breaker: a leave-in. Rosemary and tea tree in a jojoba base, light enough to disappear into the scalp in minutes. A few drops between wash days keeps itch, flake and grease swings off your calendar. Great under hijabs, helmets and winter hats.",
    benefits: ["Leave-in, no wash", "Balances flakes", "Zero grease", "Hijab friendly"],
    ingredients: ["Rosemary oil", "Tea tree oil", "Jojoba oil", "Niacinamide"],
    howToUse:
      "Part the hair, drip 3–4 drops along the scalp, massage in with fingertips. No rinse needed. Use between wash days or after the gym.",
  },
  {
    _id: "merry-p8",
    slug: "sweet-almond-face-nectar",
    name: "Sweet Almond Face Nectar",
    tagline: "Three ingredients. One very smug glow.",
    category: "skin-care",
    price: 1250,
    compareAtPrice: null,
    size: "30ml",
    stock: 44,
    rating: 4.7,
    numReviews: 58,
    images: [oilLyingPump, boxFur],
    sizes: [{ label: "30ml", price: 1250 }],
    shortDescription:
      "Cold-pressed sweet almond and a drop of vitamin E — the entire ingredient list of this face oil.",
    description:
      "Our skin line started as a happy accident: the sweet almond oil we press for hair turned out to be miraculous on faces. So we bottled it straight. Two oils, nothing else. It sinks in before your tea is done and plays perfectly under makeup or on bare skin.",
    benefits: ["3-ingredient list", "Non-comedogenic", "Makeup-friendly", "Sinks in fast"],
    ingredients: ["Sweet almond oil", "Vitamin E", "Jojoba oil"],
    howToUse:
      "Warm 3 drops between palms and press into damp skin, morning or night. A little goes a long way — this bottle lasts about four months.",
  },
  {
    _id: "merry-p9",
    slug: "cocoa-cardamom-body-cream",
    name: "Cocoa & Cardamom Body Cream",
    tagline: "Thick enough for elbows. Scented like a bakery worth visiting.",
    category: "skin-care",
    price: 1650,
    compareAtPrice: 1900,
    size: "200ml",
    stock: 27,
    rating: 4.9,
    numReviews: 73,
    badge: "Back in stock",
    images: [boxFur, oilLabel],
    sizes: [
      { label: "100ml", price: 980 },
      { label: "200ml", price: 1650 },
    ],
    shortDescription:
      "A whipped cocoa-butter body cream with cardamom and a coconut-oil base — heavy duty, never greasy.",
    description:
      "Whipped cocoa butter and our own cold-pressed coconut oil, warmed up with a whisper of cardamom. Thick enough to rescue winter elbows and post-shower shins, but it vanishes in under a minute — no slip-and-slide on your clothes.",
    benefits: ["Whipped texture", "72-hour moisture", "Warms on skin", "No greasy film"],
    ingredients: ["Cocoa butter", "Coconut oil", "Cardamom extract", "Vitamin E"],
    howToUse:
      "Smooth onto damp skin after bathing, concentrating on elbows, knees and shins. Use daily — the 200ml jar is built for it.",
  },
];

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

export const recommend = (answers = {}) => {
  const slug = GOAL_PRODUCTS[answers.goal] || "hair-care-oil";
  const product = MERRY_PRODUCTS.find((p) => p.slug === slug) || MERRY_PRODUCTS[0];
  const size = SIZE_BY_TYPE[answers.hairType] || SIZE_BY_TYPE.normal;
  return {
    product,
    headline:
      answers.goal === "dandruff"
        ? "Your scalp called. We answered."
        : product.tagline,
    sizeNote: size.note,
    ritual: [
      `Start with ${product.name} — ${product.size} of cold-pressed patience.`,
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
