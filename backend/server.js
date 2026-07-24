import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();

// Allow one or more frontend origins (comma-separated in .env)
const allowedOrigins = (process.env.CLIENT_URL || "").split(",").map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true, // needed so the refresh-token httpOnly cookie can be sent
}));

app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Well's Merry API is running" });
});

// Routes will be mounted here as we build them:
// app.use("/api/auth", authRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/outlets", outletRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});