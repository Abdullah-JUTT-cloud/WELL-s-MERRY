import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateOtp from "../utils/generateOtp.js";
import sendEmail from "../utils/sendEmail.js";
import otpEmailTemplate from "../utils/otpEmailTemplate.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "../utils/generateTokens.js";

const OTP_EXPIRES_MINUTES = Number(process.env.OTP_EXPIRES_MINUTES || 15);

// Helper: build a fresh OTP + expiry + save it (hashed fields via select:false stay hidden)
const issueOtp = async (user, purpose) => {
  const otp = generateOtp();
  user.otp = {
    code: otp,
    expiresAt: new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000),
    purpose,
  };
  await user.save();
  return otp;
};

// @desc    Register a new user, send verification OTP
// @route   POST /api/auth/register
// @access  Public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  let user = await User.findOne({ email });

  if (user && user.isVerified) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // If a user exists but never verified (e.g. the OTP email failed last time),
  // reuse that record instead of blocking re-registration forever.
  if (user && !user.isVerified) {
    user.name = name;
    user.password = password;
    user.phone = phone;
    await user.save();
  } else {
    user = await User.create({ name, email, password, phone });
  }

  const otp = await issueOtp(user, "verify-email");

  try {
    await sendEmail({
      to: user.email,
      subject: "Verify your Well's Merry account",
      html: otpEmailTemplate(user.name, otp, "verify-email"),
    });
  } catch (emailError) {
    console.error("Failed to send OTP email:", emailError.message);
    res.status(201).json({
      message:
        "Account created, but we couldn't send the verification email. Please use 'Resend OTP'.",
      userId: user._id,
    });
    return;
  }

  res.status(201).json({
    message: "Account created. Please check your email for the verification code.",
    userId: user._id,
  });
});

// @desc    Verify email using OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select("+otp.code +otp.expiresAt +otp.purpose");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account is already verified");
  }

  if (
    !user.otp?.code ||
    user.otp.purpose !== "verify-email" ||
    user.otp.code !== otp
  ) {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  if (user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Verification code has expired. Please request a new one.");
  }

  user.isVerified = true;
  user.otp = undefined;
  await user.save();

  res.json({ message: "Email verified successfully. You can now log in." });
});

// @desc    Resend OTP (verification or password reset)
// @route   POST /api/auth/resend-otp
// @access  Public
export const resendOtp = asyncHandler(async (req, res) => {
  const { userId, purpose } = req.body; // purpose: "verify-email" | "reset-password"

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = await issueOtp(user, purpose || "verify-email");

  await sendEmail({
    to: user.email,
    subject:
      purpose === "reset-password"
        ? "Reset your Well's Merry password"
        : "Verify your Well's Merry account",
    html: otpEmailTemplate(user.name, otp, purpose),
  });

  res.json({ message: "A new code has been sent to your email." });
});

// @desc    Log in
// @route   POST /api/auth/login
// @access  Public
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isVerified) {
    res.status(403);
    throw new Error("Please verify your email before logging in");
  }

  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  res.json({
    accessToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

// @desc    Get a new access token using the refresh token cookie
// @route   POST /api/auth/refresh
// @access  Public (relies on httpOnly cookie)
export const refreshAccessToken = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) {
    res.status(401);
    throw new Error("No refresh token provided");
  }

  const jwt = (await import("jsonwebtoken")).default;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }

  const user = await User.findById(decoded.id).select("+refreshToken");
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error("Refresh token is no longer valid");
  }

  const accessToken = generateAccessToken(user._id);
  res.json({ accessToken });
});

// @desc    Log out — clears refresh token cookie + invalidates it in DB
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (token) {
    await User.updateOne({ refreshToken: token }, { $unset: { refreshToken: 1 } });
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
}); 

// @desc    Request password reset OTP
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  // Respond the same way even if user isn't found — avoids leaking which emails are registered
  if (!user) {
    return res.json({
      message: "If an account exists for this email, a reset code has been sent.",
    });
  }

  const otp = await issueOtp(user, "reset-password");

  await sendEmail({
    to: user.email,
    subject: "Reset your Well's Merry password",
    html: otpEmailTemplate(user.name, otp, "reset-password"),
  });

  res.json({
    message: "If an account exists for this email, a reset code has been sent.",
    userId: user._id,
  });
});

// @desc    Reset password using OTP
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = asyncHandler(async (req, res) => {
  const { userId, otp, newPassword } = req.body;

  const user = await User.findById(userId).select("+otp.code +otp.expiresAt +otp.purpose");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (
    !user.otp?.code ||
    user.otp.purpose !== "reset-password" ||
    user.otp.code !== otp
  ) {
    res.status(400);
    throw new Error("Invalid reset code");
  }

  if (user.otp.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Reset code has expired. Please request a new one.");
  }

  user.password = newPassword;
  user.otp = undefined;
  await user.save();

  res.json({ message: "Password reset successfully. You can now log in." });
});
