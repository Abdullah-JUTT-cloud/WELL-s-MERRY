/* =====================================================================
   APOCALYPSE PRODUCT MOCK DATA
   ---------------------------------------------------------------------
   Plain JSON-shaped array. When the MongoDB fetch is ready, replace
   imports of APOC_PRODUCTS with the API result — the slider only reads
   these fields:
     _id, slug, name, subtitle, blurb, tag, accent, tilt, image,
     sizes[{ label, price }], stock
   ===================================================================== */
import amberBottle from "../../assets/apoc/bottle-amber.jpg";
import blackPump from "../../assets/apoc/bottle-black-pump.jpg";
import rustBottle from "../../assets/apoc/bottle-rust.jpg";
import dropperBottle from "../../assets/apoc/bottle-dropper.jpg";
import boxStanding from "../../assets/oil-box-bottle-standing.jpg";
import lyingPump from "../../assets/oil-lying-pump.jpg";

export const APOC_PRODUCTS = [
  {
    _id: "wm-last-hair-oil",
    slug: "hair-care-oil",
    name: "THE LAST HAIR OIL",
    subtitle: "Signature Organic Hair Care Oil",
    blurb:
      "Fifteen cold-pressed oils. Zero chemistry lab. The bottle that started the end of bad haircare.",
    tag: "BEST SELLER",
    accent: "ember",
    tilt: -2,
    image: amberBottle,
    sizes: [
      { label: "200ML", price: 1880 },
      { label: "100ML", price: 1050 },
    ],
    stock: 42,
  },
  {
    _id: "wm-midnight-scalp-oil",
    slug: "midnight-scalp-oil",
    name: "MIDNIGHT SCALP OIL",
    subtitle: "Overnight Repair Pump",
    blurb:
      "Applied at night, forgiven by morning. A heavy-hit pump serum for scalps that have been through things.",
    tag: "NIGHT SHIFT",
    accent: "rust",
    tilt: 2,
    image: blackPump,
    sizes: [
      { label: "100ML", price: 1650 },
      { label: "200ML", price: 2600 },
    ],
    stock: 18,
  },
  {
    _id: "wm-ember-elixir",
    slug: "ember-elixir",
    name: "EMBER ELIXIR",
    subtitle: "Rosemary & Amla Growth Boost",
    blurb:
      "Rosemary, amla and fenugreek in a rust-coated shell. For hairlines holding the front line.",
    tag: "SMALL BATCH",
    accent: "flame",
    tilt: -3,
    image: rustBottle,
    sizes: [
      { label: "100ML", price: 1450 },
      { label: "200ML", price: 2350 },
    ],
    stock: 27,
  },
  {
    _id: "wm-scalp-serum-9",
    slug: "scalp-serum-no-9",
    name: "SCALP SERUM №9",
    subtitle: "Dropper-Strength Follicle Fuel",
    blurb:
      "Batch recipe nine never changed because batch recipe nine works. Pipette-dosed, scalp-first, residue-free.",
    tag: "NEW DROP",
    accent: "volt",
    tilt: 3,
    image: dropperBottle,
    sizes: [
      { label: "50ML", price: 1250 },
      { label: "100ML", price: 2100 },
    ],
    stock: 33,
  },
  {
    _id: "wm-doomsday-duo",
    slug: "doomsday-duo",
    name: "THE DOOMSDAY DUO",
    subtitle: "Oil + Gift Box Set",
    blurb:
      "The 200ml flagship plus the stamped collector box. Gift-ready, apocalypse-rated, weirdly emotional to unwrap.",
    tag: "BUNDLE",
    accent: "ember",
    tilt: -1,
    image: boxStanding,
    sizes: [{ label: "SET", price: 3200 }],
    stock: 12,
  },
  {
    _id: "wm-pocket-apocalypse",
    slug: "pocket-apocalypse",
    name: "POCKET APOCALYPSE",
    subtitle: "Travel Pump — Gym Bag Rated",
    blurb:
      "Sixty millilitres of the good stuff for bags, buses and bailouts. TSA-sized, leak-sealed, no excuses.",
    tag: "TRAVEL",
    accent: "rust",
    tilt: 2,
    image: lyingPump,
    sizes: [{ label: "60ML", price: 750 }],
    stock: 51,
  },
];

/* Hero composition — which bottles get stamped onto the hero and where.
   Positions are percentages of the hero visual canvas. */
export const HERO_BOTTLES = [
  { id: "wm-last-hair-oil", x: 6, y: 4, w: 47, rot: -6, z: 2, delay: 0.15 },
  { id: "wm-midnight-scalp-oil", x: 48, y: 0, w: 42, rot: 5, z: 1, delay: 0.3 },
  { id: "wm-ember-elixir", x: 0, y: 46, w: 40, rot: 4, z: 3, delay: 0.45 },
  { id: "wm-scalp-serum-9", x: 42, y: 40, w: 46, rot: -4, z: 4, delay: 0.6 },
];
