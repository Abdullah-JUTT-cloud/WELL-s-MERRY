// Editorial content for the Well's Merry journal.
//
// Kept as a local data module rather than a CMS/backend collection: these
// articles change rarely (a few times a year), they need to render instantly
// for SEO, and there's no admin UI requirement for them yet. When the brand
// wants to publish on a weekly cadence, this file's shape maps cleanly onto
// a `Post` mongoose model — `slug` is already the lookup key the route uses.
//
// `body` is an array of blocks so the detail page can render structure
// (headings, lists, pull quotes) without shipping a markdown parser.

import imgFlatlay from "../assets/oil-flatlay-diagonal.jpg";
import imgIngredients from "../assets/oil-ingredients-label.jpg";
import imgPump from "../assets/oil-lying-pump.jpg";
import imgBoxBottle from "../assets/oil-box-bottle-standing.jpg";
import imgBox from "../assets/box.jpg";

export const BLOG_CATEGORIES = ["All", "Hair Care", "Ingredients", "Routines", "Brand"];

export const blogPosts = [
  {
    slug: "why-organic-hair-oil-outperforms-mineral-oil",
    title: "Why Organic Hair Oil Outperforms Mineral Oil",
    excerpt:
      "Mineral oil sits on the surface and mimics shine. Cold-pressed botanical oils actually travel into the hair shaft. Here's the difference you can feel in three weeks.",
    category: "Ingredients",
    readTime: 6,
    date: "2025-02-18",
    author: "Well's Merry Formulation Team",
    image: imgIngredients,
    featured: true,
    tags: ["cold-pressed", "chemical-free", "shine"],
    body: [
      {
        type: "p",
        text: "Walk down any haircare aisle and you'll find bottles that promise shine for a fraction of the price of a botanical oil. Flip them over and the first ingredient is usually the same: mineral oil, sometimes listed as paraffinum liquidum. It's cheap, it's shelf-stable, and it does produce shine. What it doesn't do is nourish.",
      },
      { type: "h2", text: "Surface gloss vs. actual absorption" },
      {
        type: "p",
        text: "Mineral oil molecules are large and non-polar. They coat the outside of the hair shaft and stay there, which is why hair looks glossy immediately but feels heavier by day two. Cold-pressed plant oils behave differently. Their fatty acid profiles are small enough and similar enough to the lipids your scalp already produces that they penetrate the cuticle rather than sit on it.",
      },
      {
        type: "quote",
        text: "Shine that washes out is a coating. Shine that persists is a repaired cuticle.",
      },
      { type: "h2", text: "What penetration actually changes" },
      {
        type: "list",
        items: [
          "Less protein loss during washing, which is where most breakage starts",
          "Reduced hygral fatigue — the swell-and-shrink cycle that weakens strands over time",
          "A calmer scalp, because botanical oils carry antioxidants and not just occlusion",
          "Slower colour fade, since a sealed cuticle holds pigment longer",
        ],
      },
      { type: "h2", text: "Give it three weeks" },
      {
        type: "p",
        text: "This is the honest part: an organic oil will not out-shine mineral oil on day one. It works on a slower clock. Most people notice reduced shedding around week two and a real change in texture by week three, once the cuticle has had a few cycles to smooth down. If you're switching over from a silicone-heavy routine, expect a short adjustment period as the old coating clarifies out.",
      },
      {
        type: "p",
        text: "Our own oil is cold-pressed rather than heat-extracted for exactly this reason. Heat is faster and cheaper, but it degrades the very fatty acids and vitamin E content you're paying for.",
      },
    ],
  },
  {
    slug: "how-to-oil-your-hair-the-right-way",
    title: "How to Oil Your Hair the Right Way",
    excerpt:
      "Most people use too much oil, in the wrong place, for the wrong amount of time. A five-step method that takes ten minutes and actually works.",
    category: "Routines",
    readTime: 5,
    date: "2025-02-04",
    author: "Well's Merry Studio",
    image: imgPump,
    featured: true,
    tags: ["how-to", "scalp massage", "routine"],
    body: [
      {
        type: "p",
        text: "Hair oiling is one of the oldest care rituals in South Asia, and also one of the most commonly done wrong. The two usual mistakes: drenching the hair and skipping the scalp, or leaving oil in for days assuming longer is better. Neither helps.",
      },
      { type: "h2", text: "The five-step method" },
      {
        type: "list",
        ordered: true,
        items: [
          "Section dry hair into four parts. Oil applied over wet hair mostly slides off.",
          "Dispense 3–5 pumps into your palm — less than you think. Warm it between your hands for a few seconds.",
          "Apply to the scalp first, using fingertips in small circles. Five minutes of massage matters more than the volume of oil.",
          "Work whatever remains through the mid-lengths and ends, which are the oldest and most damaged part of the strand.",
          "Leave for 45 minutes to 2 hours, then shampoo. Overnight is fine occasionally, not as a default.",
        ],
      },
      { type: "h2", text: "Why not overnight, every time?" },
      {
        type: "p",
        text: "An oiled scalp under a pillowcase for eight hours traps sebum and dead skin against the follicle. For some people that's harmless. For anyone prone to dandruff or clogged follicles, it's a reliable way to make both worse. A 45-minute soak with real massage delivers most of the benefit without that risk.",
      },
      {
        type: "quote",
        text: "The massage is the treatment. The oil is what makes the massage possible without friction damage.",
      },
      { type: "h2", text: "How often" },
      {
        type: "p",
        text: "Twice a week for dry or chemically treated hair. Once a week for normal hair. If your scalp is oily, once a week on the scalp and twice on the ends only. Consistency beats intensity here — a small routine you keep for two months will outperform a heavy treatment you do twice.",
      },
    ],
  },
  {
    slug: "reading-an-ingredient-label-without-a-chemistry-degree",
    title: "Reading an Ingredient Label Without a Chemistry Degree",
    excerpt:
      "Four rules that let you judge any haircare bottle in about fifteen seconds, plus the specific names worth walking away from.",
    category: "Ingredients",
    readTime: 7,
    date: "2025-01-21",
    author: "Well's Merry Formulation Team",
    image: imgFlatlay,
    tags: ["labels", "sulphates", "parabens"],
    body: [
      {
        type: "p",
        text: "Ingredient lists are legally required to be ordered by concentration, highest first. That single fact is most of what you need. Everything in the first five entries makes up the bulk of the product; everything after the fragrance line is usually present in fractions of a percent.",
      },
      { type: "h2", text: "Rule one: the first five decide the product" },
      {
        type: "p",
        text: "If a bottle markets itself on argan oil but argan appears fourteenth, after the preservative, you're buying water and surfactant with a marketing claim attached. Look for the hero ingredient in the top third of the list.",
      },
      { type: "h2", text: "Rule two: know the aliases" },
      {
        type: "list",
        items: [
          "Sulphates — sodium lauryl sulfate, sodium laureth sulfate. Effective cleansers that also strip colour and lipids.",
          "Parabens — anything ending in -paraben. Preservatives with a contested safety record; easily replaced.",
          "Silicones — dimethicone, cyclopentasiloxane. Instant smoothness, cumulative buildup.",
          "Mineral oil — paraffinum liquidum, petrolatum. Occlusive, not nourishing.",
          "Denatured alcohol — alcohol denat., isopropyl alcohol high in the list means drying.",
        ],
      },
      { type: "h2", text: "Rule three: 'natural' is not a regulated word" },
      {
        type: "p",
        text: "Neither is 'clean', 'botanical', or 'derived from'. A product can be 95% synthetic and still legally carry all three on the front label. 'Organic' is regulated in some markets and not others. The list on the back is the only claim that has to be true.",
      },
      {
        type: "quote",
        text: "Front of bottle is marketing. Back of bottle is the formula. Only one of them is bound by law.",
      },
      { type: "h2", text: "Rule four: shorter is usually better" },
      {
        type: "p",
        text: "A forty-ingredient list isn't automatically bad, but it does mean more opportunities for irritation and more places to hide filler. When a formula is built around a handful of cold-pressed oils, the list stays short because it doesn't need emulsifiers, thickeners, and synthetic conditioning agents to hold it together.",
      },
    ],
  },
  {
    slug: "hair-fall-in-humid-climates-what-actually-helps",
    title: "Hair Fall in Humid Climates: What Actually Helps",
    excerpt:
      "Karachi summers, hard water, and daily washing are a difficult combination. A practical protocol for shedding that spikes with the weather.",
    category: "Hair Care",
    readTime: 6,
    date: "2025-01-09",
    author: "Well's Merry Studio",
    image: imgBoxBottle,
    tags: ["hair fall", "humidity", "hard water"],
    body: [
      {
        type: "p",
        text: "Losing 50 to 100 strands a day is normal. What isn't normal is the seasonal spike many people see when humidity climbs — visibly more hair in the drain, more scalp showing at the parting, and a texture that goes limp within hours of washing.",
      },
      { type: "h2", text: "Three causes worth separating" },
      {
        type: "list",
        items: [
          "Sweat and sebum sitting on the scalp, which inflames follicles and loosens the anchoring.",
          "Hard water depositing calcium and magnesium on the shaft, making hair rough and prone to snapping.",
          "Over-washing in response to the first two, which strips the lipid barrier and restarts the cycle.",
        ],
      },
      { type: "h2", text: "A protocol that breaks the loop" },
      {
        type: "p",
        text: "Reduce washing to every other day, but rinse with plain water on off days to clear sweat without stripping. Oil the scalp twice weekly, 45 minutes before washing — the oil forms a barrier that reduces how much mineral deposit binds during the wash itself. Use lukewarm rather than hot water; heat opens the cuticle and increases both mineral uptake and protein loss.",
      },
      {
        type: "quote",
        text: "Most humidity-driven hair fall is a scalp inflammation problem wearing a hair problem's costume.",
      },
      { type: "h2", text: "When to see someone" },
      {
        type: "p",
        text: "If shedding stays elevated for more than three months, if you see distinct bald patches rather than diffuse thinning, or if it comes with scalp pain or scaling, that's a dermatologist conversation, not a product one. Topical care manages the scalp environment; it doesn't treat thyroid issues, iron deficiency, or androgenic patterns.",
      },
    ],
  },
  {
    slug: "the-story-behind-wells-merry",
    title: "The Story Behind Well's Merry",
    excerpt:
      "Why we started with a single 200ml bottle instead of a twelve-product line, and what 'chemical free' means to us in practice.",
    category: "Brand",
    readTime: 4,
    date: "2024-12-15",
    author: "Well's Merry",
    image: imgBox,
    tags: ["brand", "our story"],
    body: [
      {
        type: "p",
        text: "Well's Merry began with a frustration that's probably familiar: a bathroom shelf full of products that each promised transformation and collectively delivered buildup. We wanted one thing that worked, made from ingredients we could name out loud.",
      },
      { type: "h2", text: "One product, done properly" },
      {
        type: "p",
        text: "Launching with a single 200ml oil was a deliberate constraint. A wide range would have meant compromising on sourcing to hit price points across a dozen SKUs. Instead we put the entire budget into cold-pressed extraction and into oils we could trace to their growers.",
      },
      { type: "h2", text: "What 'chemical free' means here" },
      {
        type: "p",
        text: "Strictly speaking, everything is a chemical — water included. When we say chemical free, we mean specific and checkable things: no sulphates, no parabens, no synthetic fragrance, no mineral oil, no silicones, no artificial colour. That's a list you can verify against our label rather than a mood we're describing.",
      },
      {
        type: "quote",
        text: "Rooted in nature, crowned in gold — the tagline is about restraint, not luxury for its own sake.",
      },
      { type: "h2", text: "What's next" },
      {
        type: "p",
        text: "We're expanding carefully. Every addition has to earn its place by solving a problem the oil alone doesn't, and it has to hold the same sourcing standard. If that means launching one product a year, that's the pace we'll keep.",
      },
    ],
  },
  {
    slug: "building-a-weekly-hair-care-routine-around-one-oil",
    title: "Building a Weekly Hair Care Routine Around One Oil",
    excerpt:
      "A seven-day schedule for dry, oily, and colour-treated hair — no extra products required, just better timing.",
    category: "Routines",
    readTime: 5,
    date: "2024-11-28",
    author: "Well's Merry Studio",
    image: imgFlatlay,
    tags: ["routine", "weekly plan", "colour-treated"],
    body: [
      {
        type: "p",
        text: "You don't need a shelf of products to have a routine. You need a schedule. Below are three weekly patterns built around one oil, a gentle shampoo, and nothing else.",
      },
      { type: "h2", text: "Dry or damaged hair" },
      {
        type: "list",
        items: [
          "Sunday: full scalp and length oiling, 2 hours, then wash.",
          "Wednesday: mid-length and ends only, 45 minutes, then wash.",
          "Friday: two pumps on dry ends as a leave-in, no wash.",
          "Other days: water rinse only if needed.",
        ],
      },
      { type: "h2", text: "Oily scalp" },
      {
        type: "list",
        items: [
          "Monday: scalp massage with 2–3 pumps, 45 minutes maximum, then wash.",
          "Thursday: ends only — keep oil off the scalp entirely.",
          "Wash every other day with lukewarm water.",
        ],
      },
      { type: "h2", text: "Colour-treated hair" },
      {
        type: "list",
        items: [
          "Oil the day before you wash, always — the pre-wash barrier is what slows pigment loss.",
          "Twice weekly, ends-heavy, since colour damage concentrates there.",
          "Never oil within 72 hours of a fresh colour service.",
        ],
      },
      {
        type: "quote",
        text: "A routine you actually follow for eight weeks beats a perfect one you abandon in ten days.",
      },
      {
        type: "p",
        text: "Pick the pattern closest to your hair, run it for two months without changing anything, and judge it then. Hair grows roughly a centimetre a month — any honest assessment needs that much runway.",
      },
    ],
  },
];

export const getPostBySlug = (slug) => blogPosts.find((p) => p.slug === slug);

/** Posts sharing a category with the given post, excluding itself. */
export const getRelatedPosts = (post, limit = 3) => {
  if (!post) return [];
  const sameCategory = blogPosts.filter(
    (p) => p.slug !== post.slug && p.category === post.category
  );
  // Top up with any other posts so the "keep reading" row is never half-empty
  const others = blogPosts.filter(
    (p) => p.slug !== post.slug && p.category !== post.category
  );
  return [...sameCategory, ...others].slice(0, limit);
};

export const formatPostDate = (iso) =>
  new Date(iso).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
