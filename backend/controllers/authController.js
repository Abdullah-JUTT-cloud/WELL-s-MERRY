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
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Name, email and password are required");
  }

  let user = await User.findOne({ email });

  if (user && user.isVerified) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  // Build default address if provided
  const defaultAddress =
    address && address.street && address.city
      ? {
          label: "Home",
          fullName: name,
          phone: phone || "",
          street: address.street,
          city: address.city,
          postalCode: address.postalCode || "",
          isDefault: true,
        }
      : null;

  // If a user exists but never verified (e.g. the OTP email failed last time),
  // reuse that record instead of blocking re-registration forever.
  if (user && !user.isVerified) {
    user.name = name;
    user.password = password;
    user.phone = phone;
    if (defaultAddress) user.addresses = [defaultAddress];
    await user.save();
  } else {
    user = await User.create({
      name,
      email,
      password,
      phone,
      addresses: defaultAddress ? [defaultAddress] : [],
    });
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
// @desc    Get the currently logged-in user's profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    phone: req.user.phone,
    role: req.user.role,
    addresses: req.user.addresses,
  });
});
// @desc    Verify email using OTP
// @route   POST /api/auth/verify-otp
// @access  Public
export const verifyOtp = asyncHandler(async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId).select("+otp.code +otp.expiresAt +otp.purpose +otp.attempts");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Account is already verified");
  }

  if (!user.otp?.code || user.otp.purpose !== "verify-email") {
    res.status(400);
    throw new Error("Invalid verification code");
  }

  if (user.otp.expiresAt < new Date()) {
    // Clear expired OTP so it can't be retried
    user.otp = undefined;
    await user.save();
    res.status(400);
    throw new Error("Verification code has expired. Please request a new one.");
  }

  if (user.otp.code !== otp) {
    // Increment failed attempt counter — lock out after 5 wrong tries
    user.otp.attempts = (user.otp.attempts || 0) + 1;
    if (user.otp.attempts >= 5) {
      user.otp = undefined; // invalidate OTP after too many failures
      await user.save();
      res.status(429);
      throw new Error("Too many failed attempts. Please request a new code.");
    }
    await user.save();
    res.status(400);
    throw new Error("Invalid verification code");
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

  // Validate purpose to prevent storing arbitrary strings in the DB
  const validPurposes = ["verify-email", "reset-password"];
  const safePurpose = validPurposes.includes(purpose) ? purpose : "verify-email";

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const otp = await issueOtp(user, safePurpose);

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

  const fullUser = await User.findById(user._id);
  res.json({
    accessToken,
    user: {
      id: fullUser._id,
      name: fullUser.name,
      email: fullUser.email,
      phone: fullUser.phone,
      role: fullUser.role,
      addresses: fullUser.addresses,
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
  // Respond the same way even if user isn't found — avoids leaking which emails are registered.
  // Also return a dummy userId so the response shape is identical in both branches.
  if (!user) {
    return res.json({
      message: "If an account exists for this email, a reset code has been sent.",
      userId: null,
    });
  }

  const otp = await issueOtp(user, "reset-password");

  await sendEmail({
    to: user.email,
    subject: "Reset your Well's Merry password",
    html: otpEmailTemplate(user.name, otp, "reset-password"),
  });

  // Return userId so the frontend can submit the reset form — but only in the
  // user-found branch (the not-found branch already returned above).
  // NOTE: this doesn't leak emails because both branches return the same message.
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

  const user = await User.findById(userId).select("+otp.code +otp.expiresAt +otp.purpose +otp.attempts");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (!user.otp?.code || user.otp.purpose !== "reset-password") {
    res.status(400);
    throw new Error("Invalid reset code");
  }

  if (user.otp.expiresAt < new Date()) {
    user.otp = undefined;
    await user.save();
    res.status(400);
    throw new Error("Reset code has expired. Please request a new one.");
  }

  if (user.otp.code !== otp) {
    // Increment failed attempt counter — lock out after 5 wrong tries
    user.otp.attempts = (user.otp.attempts || 0) + 1;
    if (user.otp.attempts >= 5) {
      user.otp = undefined;
      await user.save();
      res.status(429);
      throw new Error("Too many failed attempts. Please request a new code.");
    }
    await user.save();
    res.status(400);
    throw new Error("Invalid reset code");
  }

  if (!newPassword || newPassword.length < 6) {
    res.status(400);
    throw new Error("New password must be at least 6 characters");
  }

  user.password = newPassword;
  user.otp = undefined;
  await user.save();

  res.json({ message: "Password reset successfully. You can now log in." });
});
