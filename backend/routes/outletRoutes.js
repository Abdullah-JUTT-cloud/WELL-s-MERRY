import express from "express";
import {
  getOutlets,
  getNearbyOutlets,
  createOutlet,
  updateOutlet,
  deleteOutlet,
} from "../controllers/outletController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getOutlets);
router.get("/nearby", getNearbyOutlets);

// Private/Admin
router.post("/", protect, adminOnly, createOutlet);
router.put("/:id", protect, adminOnly, updateOutlet);
router.delete("/:id", protect, adminOnly, deleteOutlet);

export default router;