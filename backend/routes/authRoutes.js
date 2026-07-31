import express from "express";
import {
  registerUser,
  verifyOtp,
  resendOtp,
  loginUser,
  refreshAccessToken,
  logoutUser,
  forgotPassword,
  resetPassword,
  getMe,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import {
  authLimiter,
  otpVerifyLimiter,
  otpResendLimiter,
  refreshLimiter,
  passwordResetLimiter,
} from "../middleware/rateLimitMiddleware.js";

const router = express.Router();

router.post("/register", authLimiter, registerUser);
router.post("/verify-otp", otpVerifyLimiter, verifyOtp);
router.post("/resend-otp", otpResendLimiter, resendOtp);
router.post("/login", authLimiter, loginUser);
router.post("/refresh", refreshLimiter, refreshAccessToken);
router.post("/forgot-password", passwordResetLimiter, forgotPassword);
router.post("/reset-password", passwordResetLimiter, resetPassword);

router.get("/me", protect, getMe);
router.post("/logout", protect, logoutUser);

export default router;
