import express from "express";
import {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  addProductReview,
  canReviewProduct,
} from "../controllers/productController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { uploadReviewImages } from "../utils/cloudinary.js";
import { reviewLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);

// Private — logged-in customers only
router.get("/:id/can-review", protect, canReviewProduct);
// Reviews accept text plus up to five images, so they're capped separately from
// the general API limit to keep them from being used as a spam/upload channel.
router.post("/:id/reviews", reviewLimiter, protect, uploadReviewImages.array("images", 5), addProductReview);

// Private/Admin — product management
router.post("/", protect, adminOnly, createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
