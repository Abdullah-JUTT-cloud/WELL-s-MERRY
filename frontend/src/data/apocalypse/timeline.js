/* =====================================================================
   APOCALYPSE "OUR STORY" COLLAGE — MOCK TIMELINE
   ---------------------------------------------------------------------
   Chaotic newspaper-board data. `x`, `y`, `w` are percentages of the
   collage canvas (desktop). `kind` picks the card skin:
     article  — torn newspaper clipping, two-column body
     polaroid — printed photo with tape + handwritten caption
     note     — conspiracy-board sticky note
     stamp    — rubber-stamped manifesto block
   APOC_STRINGS lists red-string connections between item ids.
   Swap this array for the MongoDB fetch later; nothing else changes.
   ===================================================================== */
import polaroidPour from "../../assets/oil-flatlay-diagonal.jpg";
import polaroidLabel from "../../assets/oil-ingredients-label.jpg";
import polaroidBox from "../../assets/box.jpg";

export const APOC_TIMELINE = [
  {
    id: "formulation",
    year: "2023",
    kind: "article",
    headline: "THE FORMULATION",
    deck: "Fifteen oils. One kitchen. Zero sulfates.",
    body:
      "It began with a stovetop, a cracked notebook and a refusal to buy another bottle of mineral-oil 'hair oil' ever again. Forty-seven blends failed — too greasy, too thin, too strange. Batch forty-eight came out gold and never changed. The recipe is still taped inside the factory door, coffee-stained and non-negotiable.",
    x: 1,
    y: 4,
    w: 35,
    rot: -2.5,
    z: 3,
    draggable: true,
  },
  {
    id: "first-batch",
    year: "2024",
    kind: "polaroid",
    caption: "BATCH №001 — 50 BOTTLES, FILLED BY HAND",
    image: polaroidPour,
    x: 31,
    y: 0,
    w: 25,
    rot: 4,
    z: 4,
  },
  {
    id: "living-room-factory",
    year: "2024",
    kind: "article",
    headline: "THE LIVING-ROOM FACTORY",
    deck: "Two people, one funnel, endless labels.",
    body:
      "Every label was stamped by hand at the dining table while dinner waited on the stove. The first 'quality control' was the family comb test: if it didn't glide, the batch didn't ship. Nothing has shipped since that failed a comb.",
    x: 60,
    y: 8,
    w: 36,
    rot: 2,
    z: 2,
    draggable: true,
  },
  {
    id: "lahore-notice",
    year: "2025",
    kind: "note",
    headline: "LAHORE TAKES NOTICE",
    body:
      "500 bottles listed on a Monday. Gone in 11 days. The comment section said one word over and over: 'again'.",
    x: 6,
    y: 55,
    w: 29,
    rot: -4,
    z: 5,
    draggable: true,
  },
  {
    id: "outlet-one",
    year: "2025",
    kind: "polaroid",
    caption: "OUTLET №1 — MAIN BOULEVARD, LAHORE",
    image: polaroidBox,
    x: 39,
    y: 47,
    w: 25,
    rot: -2,
    z: 4,
  },
  {
    id: "label-ingredients",
    year: "2026",
    kind: "polaroid",
    caption: "THE LABEL: 15 OILS, NOTHING TO HIDE",
    image: polaroidLabel,
    x: 66,
    y: 40,
    w: 22,
    rot: 5,
    z: 3,
  },
  {
    id: "movement",
    year: "2026",
    kind: "stamp",
    headline: "THE MOVEMENT",
    body:
      "Not a brand drop — a stand-down. Every bottle sold is one chemical cocktail retired from someone's shelf. The end is the point.",
    x: 66,
    y: 74,
    w: 30,
    rot: -3,
    z: 6,
    draggable: true,
  },
];

/* Red-string connections: [fromId, toId] */
export const APOC_STRINGS = [
  ["formulation", "first-batch"],
  ["first-batch", "living-room-factory"],
  ["living-room-factory", "label-ingredients"],
  ["lahore-notice", "outlet-one"],
  ["outlet-one", "movement"],
  ["formulation", "lahore-notice"],
];
