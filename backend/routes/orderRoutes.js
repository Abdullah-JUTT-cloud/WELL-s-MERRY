import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly, optionalAuth } from "../middleware/authMiddleware.js";
import { uploadReceipt } from "../utils/cloudinary.js";
import { orderCreateLimiter } from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

// Public-ish — guest checkout allowed, but attaches req.user if logged in.
// uploadReceipt.single("receipt") handles the optional file for online payments;
// for COD/WhatsApp orders the file field is simply absent and multer does nothing.
// Rate limited because this is the only write path an anonymous visitor can
// reach, and it both writes to the DB and can upload a receipt image.
router.post("/", orderCreateLimiter, optionalAuth, uploadReceipt.single("receipt"), createOrder);

// Private — logged-in customers only
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Private/Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;