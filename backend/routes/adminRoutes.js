import express from "express";
import {
  adminLogin, adminRefresh, adminLogout,
  adminGetProducts, adminCreateProduct, adminUpdateProduct, adminDeleteProduct,
  adminGetOrders, adminGetOrder, adminUpdateOrderStatus, adminAdjustCharges,
  adminUploadImages,
} from "../controllers/adminController.js";
import { adminProtect } from "../middleware/adminAuthMiddleware.js";
import { upload } from "../utils/cloudinary.js";

const router = express.Router();

// Auth (public)
router.post("/login", adminLogin);
router.post("/refresh", adminRefresh);
router.post("/logout", adminLogout);

// Image upload (protected)
router.post("/upload", adminProtect, upload.array("images", 10), adminUploadImages);

// Products (protected)
router.get("/products", adminProtect, adminGetProducts);
router.post("/products", adminProtect, adminCreateProduct);
router.put("/products/:id", adminProtect, adminUpdateProduct);
router.delete("/products/:id", adminProtect, adminDeleteProduct);

// Orders (protected)
router.get("/orders", adminProtect, adminGetOrders);
router.get("/orders/:id", adminProtect, adminGetOrder);
router.put("/orders/:id/status", adminProtect, adminUpdateOrderStatus);
router.put("/orders/:id/charges", adminProtect, adminAdjustCharges);

export default router;
