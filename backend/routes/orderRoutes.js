import express from "express";
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";
import { protect, adminOnly, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public-ish — guest checkout allowed, but attaches req.user if logged in
router.post("/", optionalAuth, createOrder);

// Private — logged-in customers only
router.get("/my", protect, getMyOrders);
router.get("/:id", protect, getOrderById);

// Private/Admin
router.get("/", protect, adminOnly, getAllOrders);
router.put("/:id/status", protect, adminOnly, updateOrderStatus);

export default router;