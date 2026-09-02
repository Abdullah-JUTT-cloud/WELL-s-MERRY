import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import outletRoutes from "./routes/outletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import { legacyApiPrefix, API_SEGMENTS } from "./middleware/legacyApiPrefix.js";
import {
  secureHeaders,
  preventParamPollution,
  sanitizeRequest,
  enforceContentType,
} from "./middleware/securityMiddleware.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

/* =====================================================================
   Express application.

   Kept free of process-level side effects (no DB connect, no listen) so
   the whole route table can be booted in a test on an ephemeral port
   without a database. `server.js` is the entry point: it loads env,
   connects Mongo and calls listen().
   ===================================================================== */

const app = express();

// Behind a reverse proxy (Render, Railway, Nginx, Cloudflare…) the socket
// address is the proxy's, not the visitor's. Without this every request looks
// like it came from one IP and the rate limiters would throttle the entire
// user base as a single client. Off by default so a directly-exposed server
// can't be fooled by a spoofed X-Forwarded-For header.
if (process.env.TRUST_PROXY === "true") {
  app.set("trust proxy", 1);
}

// Don't advertise the stack we're running on.
app.disable("x-powered-by");

// --- Security middleware ---------------------------------------------------
// Order matters here. Headers first so even an early rejection carries them,
// then CORS, then body parsing, then sanitisation of the parsed result.
app.use(secureHeaders);

// Production checkout was failing because CLIENT_URL was unset/mismatched,
// so the API rejected every browser request from the Vercel frontend.
// Always allow the known shop origins, then merge any extra hosts from env
// (comma-separated) so preview deploys can be added without a code change.
const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://well-s-merry.vercel.app",
];

// Vercel gives every branch/push deploy its own host
// (well-s-merry-git-feature-username.vercel.app). An exact-match list can't
// keep up with that, so the project's deploy family is allowed by pattern —
// still scoped to *this* project, not every site on Vercel.
const defaultOriginPatterns = [/^https:\/\/well-s-merry(-[a-z0-9-]+)?\.vercel\.app$/];

const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

const originPattern =
  process.env.CLIENT_URL_PATTERN && process.env.CLIENT_URL_PATTERN.trim()
    ? new RegExp(process.env.CLIENT_URL_PATTERN.trim())
    : null;

app.use(
  cors({
    origin: originPattern
      ? [...allowedOrigins, ...defaultOriginPatterns, originPattern]
      : [...allowedOrigins, ...defaultOriginPatterns],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  })
);

// --- Body parsing ----------------------------------------------------------
// MUST sit above every route, otherwise req.body is undefined and controllers
// read `undefined` instead of failing loudly. Parsers first, then the
// sanitisation that operates on their output.
app.use(enforceContentType);

app.use(express.json({ limit: "100kb" })); // prevent oversized payloads (DoS protection)
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// Runs after the parsers because both need a populated req.body/req.query.
app.use(sanitizeRequest); // strips Mongo operators ($ne, $gt, dotted paths)
app.use(preventParamPollution); // collapses repeated query params to one value

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// --- Routing ---------------------------------------------------------------
// Compatibility shim: rewrites unprefixed paths (/orders, /products/…) onto
// their /api/… equivalents. A client configured with the bare origin
// (VITE_API_URL=https://well-s-merry.onrender.com) would otherwise POST to
// /orders and fall through to the 404 handler. Must run before the routers.
app.use(legacyApiPrefix(API_SEGMENTS));

// Health check sits above the limiter so uptime monitors polling every few
// seconds never eat into the API budget.
app.get(["/api/health", "/health"], (req, res) => {
  res.json({ status: "ok", message: "Well's Merry API is running" });
});

// Baseline ceiling for the whole API. Individual sensitive routes add their own
// much tighter limiters on top (see middleware/rateLimitMiddleware.js).
app.use("/api", generalLimiter);

// Canonical mounts. `legacyApiPrefix` above means the same routers are also
// reachable without the /api prefix, so a mis-configured client can never
// hard-404 the checkout again.
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
