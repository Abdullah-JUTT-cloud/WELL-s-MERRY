# The "Merry" Takeover — Page Routes & Design System

Status: **live on the primary routes** (`/`, `/shop`, `/story`, `/quiz`,
`/outlets`, `/product/:slug`) **plus the cart, track-order and auth
flows**. The legacy gold/ivory experience now only backs the remaining
utility pages (checkout, blog, about, contact, shipping) and will be
migrated (or retired) separately.

## Route map

| Route | Page file | Theme | Notes |
|---|---|---|---|
| `/` | `src/pages/merry/HomeMerry.jsx` | merry | Split hero → marquee → magnetic grid → pinned features |
| `/shop` | `src/pages/merry/ShopMerry.jsx` | merry | Banner + quiz CTA, filter tabs, 9 mock products |
| `/story` | `src/pages/merry/StoryMerry.jsx` | merry | Overlay hero + collage timeline + pledge band |
| `/quiz` | `src/pages/merry/QuizMerry.jsx` | merry | 4-step full-screen form → personalized match → add to cart |
| `/outlets` | `src/pages/merry/OutletsMerry.jsx` | merry | Asymmetric cards + Leaflet map (Forest & Cream) |
| `/product/:slug` | `src/pages/merry/ProductDetailMerry.jsx` | merry | Full merry PDP: gallery, size/qty, accordions, reviews, related |
| `/cart` | `src/pages/Cart.jsx` | merry | Forest banner, blocky lines, sticky summary, COD nudge |
| `/account/orders` (alias `/orders`) | `src/pages/Orders.jsx` | merry | Track Order: clay step tracker, blocky order cards |
| `/login`, `/register`, `/verify-otp`, `/forgot-password` | `src/pages/*` | merry | Full-screen 50/50 `AuthLayout` split |
| `/checkout`, `/about`, `/blog`, … | `src/pages/*` | gold | Untouched legacy routes |

Router precedence: the merry `<Route element={<MerryLayout />}>` branch
is declared **before** the legacy `<Route element={<Layout />}>` branch
in `src/App.jsx`, so the shared paths (`/`, `/shop`, `/outlets`) resolve
to the merry pages. Delete the duplicates from the legacy branch to make
a takeover permanent.

## Architecture

```
src/
  data/merry/mock.js          ← single mock-data seam (products, timeline,
                                quiz, outlets, MAP_STYLE theme)
  api/products.js             ← getProducts/getProductBySlug fall back to
                                the mock catalog when the API is down
  components/merry/           ← design system (Layout, AuthLayout,
                                AuthForm primitives, Navbar, Footer,
                                CartDrawer, MagneticProductCard,
                                InfiniteMarquee, PinnedFeatures,
                                CollageTimeline, WavyDivider, MerryMap,
                                RealResultsBanner, IngredientSpotlight)
  pages/merry/                ← the five route files
scripts/ssr-check.mjs         ← SSR smoke harness (node scripts/ssr-check.mjs)
```

Key contracts:

- **MerryLayout** wraps every merry route (router `<Outlet />` mode);
  it owns the cart drawer and applies `.theme-merry` (slab headings).
  `/cart` and `/account/orders` now sit inside this branch, so they
  inherit the organic Navbar + Footer instead of the legacy shell.
- **AuthLayout** is the auth shell and deliberately sits *outside* both
  site layouts — it is full-screen by design: `w-1/2` edge-to-edge
  visual (hidden below `lg`) + `w-1/2` cream form column. Pair it with
  the `AuthForm.jsx` primitives (`AuthField`, `AuthSubmit`, `AuthAlert`,
  `AuthDivider`, `AuthGhostLink`, `AuthSwitch`) — 4px forest borders,
  flat fills, chunky slab CTAs.
- **Palette rule**: use the semantic Tailwind tokens, never raw hex.
  `merry-forest` = `#1A2E24`, `merry-cream` = `#F9F6F0`,
  `merry-clay` = `#C17754`, `merry-oat` = `#EFE8DB`. A raw
  `bg-[#C17754]` in a diff is a bug, not a style choice.
- **Homepage grid** is `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` with
  `auto-rows-fr`; MagneticProductCard is `h-full w-full` and its image
  stage is `flex-1` with an absolutely-positioned `object-cover` image,
  so cards fill their cells with no dead space.
- **MagneticProductCard** expects `{ _id, slug, name, price, size,
  images[], badge?, sizes? }` — exactly the mock product shape.
- **MAP_STYLE** (`data/merry/mock.js`) is the map's single source of
  truth: valid Mapbox-GL style JSON for a tokened embed, plus
  `tiles.cssFilter` which grades free OSM rasters to the same palette
  without a token (what MerryMap does today).

## Swapping mock → live API

The mock catalog doubles as the offline fallback, so the swap is
removing the fallback, not rewriting pages:

1. In `src/api/products.js`, drop the `catch` fallbacks (or keep them
   behind an env flag).
2. In the five page files, replace the `MERRY_*` imports with
   `getProducts()` / `getOutlets()` calls + loading skeletons
   (`components/Skeleton.jsx` has legacy examples).
3. `/story` timeline and `/quiz` are content, not catalog — keep them
   static or move to a CMS later.

## Verified (headless Chromium, desktop + mobile)

- All five routes render (SSR harness 7/7 + screenshot passes).
- SSR harness extended to 14/14: it now also renders `/cart`,
  `/account/orders` and the four auth screens (asserting the 50/50
  split survives in the markup).
- Card quick-add → navbar badge → cart drawer (qty stepper, subtotal,
  COD band) → Escape close.
- Quiz: auto-advance, back, restart, personalized result (size note and
  ritual lines change with answers), add-to-cart toast.
- Shop filter tabs re-flow the grid with layout animation.
- Outlets: card ⇄ map sync (fly-to + popup + active pin), legend strip.
- PDP deep-links from mock slugs (`/product/hair-care-oil` etc.).
- Mobile: stacked hero, overlay menu with numbered links, outlets grid.

## Known limitations

- Google Fonts (Alfa Slab One / Archivo) must load from the visitor's
  network; offline previews fall back to system serif.
- Map tiles come from `tile.openstreetmap.org` — behind some corporate
  firewalls the forest base shows instead of tiles (graceful).
- `/products/:slug` (plural, legacy gold layout) still serves the old
  PDP for the utility pages' links; the merry flow uses
  `/product/:slug`. Consolidate when the remaining pages migrate.
