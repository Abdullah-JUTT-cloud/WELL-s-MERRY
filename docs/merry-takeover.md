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
| `/shop` | `src/pages/merry/ShopMerry.jsx` | merry | Banner + quiz CTA, filter tabs, live `GET /api/products` |
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
  data/merry/mock.js          ← CONTENT seam only (timeline, quiz steps +
                                goal map, marquees, MAP_STYLE theme).
                                Products are NOT here any more — see below.
  api/products.js             ← getProducts/getProductBySlug. Live only:
                                no mock fallback (it is what broke checkout)
  hooks/useProducts.js        ← the one way a page reads inventory
                                ({ products, loading, error, refetch })
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
  it renders the cart drawer and applies `.theme-merry` (slab headings).
  `/cart` and `/account/orders` now sit inside this branch, so they
  inherit the organic Navbar + Footer instead of the legacy shell.
- **Cart drawer open state lives in `CartContext`** (`isCartOpen` /
  `setIsCartOpen`), not in MerryLayout. The Navbar sets it to `true`;
  `CartDrawer`'s "X", its backdrop, Escape and the
  "View full cart" / "Checkout" links set it to `false` — the links close
  the drawer *before* navigating, so the panel is never left on top of
  the page it just routed to.
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
  images[], badge?, sizes? }` — i.e. a `Product` document from the API.
  `_id` must be the real MongoDB ObjectId: the card's quick-add puts it
  straight into the cart, and checkout looks it up verbatim.
- **MAP_STYLE** (`data/merry/mock.js`) is the map's single source of
  truth: valid Mapbox-GL style JSON for a tokened embed, plus
  `tiles.cssFilter` which grades free OSM rasters to the same palette
  without a token (what MerryMap does today).

## Mock → live API: done

The swap shipped — see [`docs/inventory-sync-fix.md`](inventory-sync-fix.md)
for the post-mortem. The short version:

1. `src/api/products.js` no longer `catch`es its way to a mock catalog;
   it either returns live products or rejects.
2. Every product surface — `ShopMerry`, the `HomeMerry` lineup, the PDP's
   "Pairs well with" strip, the quiz result, and the apocalypse
   `ProductSlider`/`HeroApocalypse` — reads `useProducts()`, which wraps
   that call with `{ loading, error, refetch }`.
3. Empty and failed states are explicit: "New batches coming soon…" and a
   retryable "The shelf didn't load" panel. No page falls back to
   placeholder products any more — a placeholder product is an
   unorderable cart line.
4. `data/merry/mock.js` keeps only content (timeline, quiz, marquees,
   map theme). `data/productFallback.js` and
   `data/apocalypse/products.js` are deleted.

Still static (content, not catalog): the `/story` timeline, the quiz
questions and the `MERRY_OUTLETS` list on `/outlets`.

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
- PDP deep-links from live slugs (`/product/hair-care-oil` etc.).
- Mobile: stacked hero, overlay menu with numbered links, outlets grid.

## Known limitations

- Google Fonts (Alfa Slab One / Archivo) must load from the visitor's
  network; offline previews fall back to system serif.
- Map tiles come from `tile.openstreetmap.org` — behind some corporate
  firewalls the forest base shows instead of tiles (graceful).
- `/products/:slug` (plural, legacy gold layout) still serves the old
  PDP for the utility pages' links; the merry flow uses
  `/product/:slug`. Consolidate when the remaining pages migrate.
