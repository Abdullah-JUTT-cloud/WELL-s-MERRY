# Inventory sync — mock catalogue vs. MongoDB (post-mortem)

**Symptom:** checkout failed with *"Resource not found"* on orders placed from
the shop, even though the admin panel had products in MongoDB.

## Root cause

Two catalogues existed:

| Surface | Where its products came from | `_id` values |
| --- | --- | --- |
| Admin panel | MongoDB (`POST /api/admin/products`) | real ObjectIds (`64f1…`) |
| Storefront | hardcoded arrays in the frontend | invented strings (`merry-p1`, `wm-last-hair-oil`) |

A shopper added a hardcoded product to the cart, and the cart faithfully
stored that invented `_id`. `POST /api/orders` then did:

```js
const product = await Product.findById(item.product); // "merry-p1" exists nowhere
```

…so it answered **404 "Product not found"**. The items a customer was shown
were not the items the database knew about. Nothing was wrong with the order
route — the shop was selling ids that had never been minted.

Two mechanisms made it worse:

1. **`getProducts()` swallowed errors and answered with the mock catalogue.**
   A network blip, a bad `VITE_API_URL`, an offline preview — all of them
   silently produced the same unorderable shelf instead of showing a failure.
2. **`ProductSlider` minted composite ids.** Quick-add built
   `` `${product._id}-${size.label}` `` ("`wm-last-hair-oil-200ML`") so a size
   variant would be its own cart line. That string is not an ObjectId either,
   so `findById` threw a **CastError → HTTP 500**.

## Fix

### Task 1 — every catalogue surface reads the API

| File | Before | After |
| --- | --- | --- |
| `src/api/products.js` | `catch` → return `MERRY_PRODUCTS` | no fallback; rejects like any failed request |
| `src/hooks/useProducts.js` *(new)* | — | one hook: `{ products, loading, error, refetch }`, race-safe |
| `pages/merry/ShopMerry.jsx` | `MERRY_PRODUCTS` | `useProducts()` + skeleton / empty / error states |
| `pages/merry/HomeMerry.jsx` | `MERRY_PRODUCTS.slice(0, 8)` | first 8 live products + skeleton |
| `pages/merry/ProductDetailMerry.jsx` | related strip from the mock list | related strip from the live catalogue |
| `pages/merry/QuizMerry.jsx` | `recommend(answers)` → mock bottle | `recommend(answers, products)` → live bottle |
| `components/apocalypse/ProductSlider.jsx` | `APOC_PRODUCTS`, composite ids | live products; `_id` passed through untouched |
| `components/apocalypse/HeroApocalypse.jsx` | looked bottles up by invented ids | stamps the first products the API returns |
| `data/merry/mock.js` | products + content | content only (timeline, quiz, marquees, map theme) |
| `data/productFallback.js`, `data/apocalypse/products.js` | hardcoded products | **deleted** |

Empty and failed are first-class states, not something to paper over:

- API returns `[]` → **"New batches coming soon…"**
- request fails → **"The shelf didn't load"** with a *Try again* button

A page that falls back to placeholder products is a page that sells things
the database has never heard of — which is the bug.

### Task 2 — the cart and the order payload agree

**Frontend**

- `CartContext.addItem()` stores `productId: product._id` verbatim, and
  **refuses** a product whose `_id` isn't a 24-char ObjectId (toast, not a
  silent cart line).
- `loadInitialCart()` and the cross-tab `storage` handler **drop** saved lines
  with non-ObjectId ids — carts persisted by the old build can never be
  ordered, so they are purged rather than carried to a failing checkout.
- `Checkout.validate()` flags stale lines before the address form is filled in.

**Backend (`controllers/orderController.js`)**

- A line's product id is read as `product ?? productId ?? _id ?? id`, so a
  rename on either side of the wire is a no-op.
- Ids are checked with `mongoose.isValidObjectId` **before** `findById`: a
  stale id is now a **400** with a recovery message, not a CastError 500.
  This is a shape check, not an allow-list — every id MongoDB mints passes,
  including everything an admin creates.
- `orderItems` must be an array (`{ orderItems: 5 }` used to TypeError → 500).
- Stored line items keep `product._id` (the document's ObjectId, not the
  client's string) and fall back to `""` when a product has no image, so an
  imageless admin product doesn't fail `Order` validation and 500 the order.

## Verification

```bash
cd backend  && npm test            # 25 passed (route table + prefix shim + payload guards)
cd backend  && npm run test:order  # 10 passed (checkout flow, ObjectId + stale-id cases)
cd frontend && npm test            # 45 passed (incl. 6 cart-identity + 5 shop-inventory specs)
cd frontend && npm run build       # clean
cd frontend && node scripts/ssr-check.mjs   # 13/14 (pre-existing MerryLayout harness gap)
```

New specs worth knowing about:

- `frontend/src/context/CartContext.test.jsx` — the cart stores the real `_id`,
  never a composite; stale ids in `localStorage` are dropped; a product with
  no `_id` can't be added at all.
- `frontend/src/pages/merry/ShopMerry.test.jsx` — live products render, the
  empty shelf shows "New batches coming soon…", a failed request shows a
  retry panel and **no** invented products.
- `backend/tests/orderCreate.test.js` — a `productId`-keyed line is accepted,
  the stored line keeps the ObjectId, a stale mock id 400s without writing an
  order, and a non-array payload 400s.

## Notes

- `/outlets` still renders `MERRY_OUTLETS` from `data/merry/mock.js`. Outlets
  are content (they never appear in an order), so they were left alone; the
  same treatment applies if they start coming from `/api/outlets`.
- Out-of-stock and inactive products are still rejected at checkout by design.
