# Checkout 404 — root cause & fix

**Symptom:** placing an order failed with `Route not found` (HTTP 404).

## Root cause

The frontend builds its request URL from a base URL plus a path:

```
baseURL (VITE_API_URL)        +  path ("/orders")  ->  final URL
```

The backend only ever mounted the order router under the `/api` prefix:

```js
app.use("/api/orders", orderRoutes);   // POST /api/orders
```

So the two must agree. They didn't:

| `VITE_API_URL` set to | checkout POSTs to | result |
| --- | --- | --- |
| `https://well-s-merry.onrender.com/api` | `/api/orders` | ✅ 201 Created |
| `https://well-s-merry.onrender.com` (bare origin) | `/orders` | ❌ **404 Route not found** |
| `https://well-s-merry.onrender.com/api/orders` | `/api/orders/orders` | ❌ 404 Route not found |
| unset, in a production build | `http://localhost:5000/api/orders` | ❌ the shopper's own machine |

The old frontend had **no production fallback at all** — `VITE_API_URL || "http://localhost:5000/api"`
— so a missing or mis-typed env var was invisible until a customer hit Place Order.

Reproduced against the real Express app before the fix:

```
POST /orders  ->  HTTP 404 {"message":"Route not found - /orders"}
POST /orders  ->  HTTP 400 {"message":"No order items provided"}   (after)
```

## Fix

### Task 1 — backend (`backend/`)

1. **`middleware/legacyApiPrefix.js` (new)** — rewrites an unprefixed request whose
   first segment is a real resource (`orders`, `products`, `auth`, `outlets`, `admin`,
   `health`) onto its `/api/…` equivalent, preserving the query string and
   canonicalising casing. Non-API paths (`/shop`, `/about`) still 404 normally.
   The server now absorbs a mis-typed env var instead of the customer.
2. **`app.js` (new)** — all Express wiring extracted out of `server.js`, so the route
   table boots in tests without Mongo or a port. `server.js` is now just
   *connect → listen*.
3. **CORS** — Vercel branch/preview deploys get a new host every push
   (`well-s-merry-git-<branch>-….vercel.app`). An exact-match origin list can't keep
   up, so this project's deploy family is allowed by pattern
   (`/^https:\/\/well-s-merry(-[a-z0-9-]+)?\.vercel\.app$/`), plus an optional
   `CLIENT_URL_PATTERN` override.
4. **Error handler** — a malformed JSON body returned **500** (server error) instead of
   400, because `res.statusCode` is untouched when `express.json()` throws. It now
   honours `err.status`/`err.statusCode`, and maps `MulterError` (e.g. a receipt over
   5 MB) to 400 with a readable message.
5. Body parsers (`express.json()`, `urlencoded`, `cookie-parser`) sit above every
   router — verified by test, not by eye.

### Task 2 — frontend (`frontend/src/api/`)

1. **`baseUrl.js` (new)** — one source of truth for the base URL, shared by both
   clients (`axios.js` for shoppers, `admin.js` for the dashboard, which used to
   re-resolve the env var independently). `resolveApiBaseUrl()` normalises every
   spelling: adds a missing `/api`, trims an over-specific `/api/orders` back to
   `/api`, strips trailing slashes/queries/hashes, assumes `https://` when the scheme
   is missing, and supports a relative `/api` for same-origin proxying.
2. **Production fallback** — with `VITE_API_URL` unset, a production build now points
   at `https://well-s-merry.onrender.com/api` instead of `localhost:5000`, and logs a
   console warning if a production build ever resolves to localhost.
3. **`.env.example`** — documents the one correct value and the two common mistakes.
4. **404 diagnostics** — a response of `Route not found` now logs the resolved
   `baseURL + url` so the next mismatch is obvious from the browser console.

## Verification

```bash
cd backend  && npm test            # 14 passed, 5 skipped (route table + shim)
cd backend  && npm run test:order  # 5 passed (real checkout flow, stubbed models)
cd frontend && npm test            # 34 passed (incl. 10 base-URL cases)
cd frontend && npm run build       # clean
```

`npm run test:order` boots the real app with the Mongoose models stubbed and asserts
that a guest checkout returns **201** with DB-derived pricing on **both** `/api/orders`
and `/orders`.

## Deploy checklist

- **Vercel → Settings → Environment Variables** (Production *and* Preview):
  `VITE_API_URL = https://well-s-merry.onrender.com/api`.
  Redeploy afterwards — Vite inlines `VITE_*` at **build** time, so changing the
  variable without a rebuild has no effect.
- **Render → Environment**: `CLIENT_URL` = the Vercel origin(s), comma-separated.
  Preview deploy hosts are covered by the pattern above, so this is only needed for a
  custom domain.
- Sanity check after deploy: `https://well-s-merry.onrender.com/api/health` returns
  `{"status":"ok",...}`.
