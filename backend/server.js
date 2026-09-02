import "./config/env.js"; // must be the very first import — loads .env before other modules read process.env

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import outletRoutes from "./routes/outletRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import {
  secureHeaders,
  preventParamPollution,
  sanitizeRequest,
  enforceContentType,
} from "./middleware/securityMiddleware.js";
import { generalLimiter } from "./middleware/rateLimitMiddleware.js";

connectDB();

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
const envOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);
const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

app.use(enforceContentType);

app.use(express.json({ limit: "100kb" })); // prevent oversized payloads (DoS protection)
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

// Runs after the parsers because both need a populated req.body/req.query.
app.use(sanitizeRequest);      // strips Mongo operators ($ne, $gt, dotted paths)
app.use(preventParamPollution); // collapses repeated query params to one value

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check sits above the limiter so uptime monitors polling every few
// seconds never eat into the API budget.
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Well's Merry API is running" });
});

// Baseline ceiling for the whole API. Individual sensitive routes add their own
// much tighter limiters on top (see middleware/rateLimitMiddleware.js).
app.use("/api", generalLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/admin", adminRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
