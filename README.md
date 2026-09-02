# WELL-s-MERRY

Organic hair & beauty care — Vite/React storefront with a Node/Express + MongoDB API.

| | |
| --- | --- |
| Frontend | `frontend/` — Vite + React (deployed on Vercel) |
| Backend | `backend/` — Express API (deployed on Render) |

## Configuration

The only variable the frontend needs is the **API root** (it must end in `/api`):

```bash
cp frontend/.env.example frontend/.env
# VITE_API_URL=https://well-s-merry.onrender.com/api
```

`VITE_*` values are inlined at **build** time, so a change on Vercel needs a redeploy.
`src/api/baseUrl.js` normalises whatever it is given — a bare origin gets `/api`
appended, an over-specific `/api/orders` is trimmed back — and falls back to the live
Render backend in a production build rather than to `localhost`.

The backend reads `CLIENT_URL` (comma-separated origins) for CORS; Vercel preview
deploy hosts for this project are allowed automatically.

## Running locally

```bash
cd backend  && npm install && npm run dev   # http://localhost:5000/api/health
cd frontend && npm install && npm run dev   # http://localhost:5173
```

## Tests

```bash
cd backend  && npm test            # route table + API-prefix compatibility
cd backend  && npm run test:order  # full checkout flow (stubbed models)
cd frontend && npm test            # unit + component specs
```

## Notes

- Checkout 404 post-mortem (order route / base-URL mismatch): [`docs/checkout-404-fix.md`](docs/checkout-404-fix.md)
- Inventory-sync post-mortem (mock catalogue vs. MongoDB — shop sold ids that
  didn't exist): [`docs/inventory-sync-fix.md`](docs/inventory-sync-fix.md)
