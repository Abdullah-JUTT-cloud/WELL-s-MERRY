/* =====================================================================
   APOCALYPSE "FIND YOUR FORMULA" QUIZ CTA — MOCK CONFIG
   ---------------------------------------------------------------------
   Copy + floater shapes for the full-width quiz banner. When the real
   quiz route exists, set `ctaLink` to e.g. "/quiz" and clear `ctaToast`
   — the button switches from toast to navigation automatically.
   ===================================================================== */

export const APOC_QUIZ = {
  eyebrow: "FIND YOUR FORMULA",
  title: ["THREE QUESTIONS.", "SIXTY SECONDS.", "ONE LAST BOTTLE."],
  copy:
    "Dry scalp? Fried ends? Oily roots by noon? Answer three blunt questions and we'll point you at the exact bottle your hair has been screaming for.",
  cta: "TAKE THE HAIR QUIZ",
  ctaLink: null, // e.g. "/quiz" once the route exists
  ctaToast: "The Hair Quiz drops with the next batch — meanwhile, THE LAST HAIR OIL never misses.",
  note: "No email. No spam. Just the oil your scalp has been begging for.",
  /* Floating background shapes: icon key + position (% of section) */
  floaters: [
    { icon: "drop", x: 6, y: 12, size: 92, rot: -14, dur: 7 },
    { icon: "skull", x: 84, y: 8, size: 74, rot: 12, dur: 9 },
    { icon: "bolt", x: 14, y: 70, size: 66, rot: 20, dur: 8 },
    { icon: "drop", x: 74, y: 62, size: 120, rot: 8, dur: 10 },
    { icon: "bean", x: 46, y: 6, size: 58, rot: -24, dur: 6.5 },
    { icon: "bean", x: 32, y: 78, size: 46, rot: 30, dur: 7.5 },
    { icon: "skull", x: 58, y: 84, size: 54, rot: -10, dur: 8.5 },
    { icon: "drop", x: 92, y: 40, size: 60, rot: 0, dur: 6 },
  ],
};
