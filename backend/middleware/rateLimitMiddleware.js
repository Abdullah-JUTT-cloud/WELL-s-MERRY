import rateLimit from "express-rate-limit";

/**
 * Rate limiting policy for the Well's Merry API.
 *
 * Two tiers:
 *   1. A loose `generalLimiter` mounted on all of /api — high enough that no
 *      real shopper will ever see it, low enough to blunt scraping and
 *      accidental request floods.
 *   2. Tight, purpose-built limiters on the endpoints that are worth attacking:
 *      login, register, OTP verify/resend, forgot/reset password, admin login.
 *      Those are the ones where a few thousand attempts buys an attacker
 *      something (a password, a valid OTP, a free flood of outbound email).
 *
 * All limiters key on IP (the library default). Behind a proxy/CDN that means
 * server.js must set `trust proxy` so the client IP is read from
 * X-Forwarded-For rather than every request looking like it came from the
 * load balancer — see TRUST_PROXY there.
 */

// Rate-limit rejections are shaped like every other API error ({ message })
// so the frontend's existing axios error handling picks them up unchanged.
const jsonRejection = (message) => (req, res) => {
  res.status(429).json({ message });
};

// In development the limits are relaxed heavily — hot reloading, repeated
// manual testing and seed scripts would otherwise lock you out of your own
// dev server. Production keeps the real numbers.
const isDev = process.env.NODE_ENV === "development";
const scale = (n) => (isDev ? n * 20 : n);

const baseOptions = {
  standardHeaders: "draft-7", // RateLimit / RateLimit-Policy response headers
  legacyHeaders: false, // drop the deprecated X-RateLimit-* set
};

/**
 * Broad protection for the whole API surface. Deliberately generous: a single
 * product page can fire several requests, and a shopper browsing quickly is
 * not an attacker.
 */
export const generalLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: scale(300),
  message: { message: "Too many requests. Please slow down and try again shortly." },
  handler: jsonRejection("Too many requests. Please slow down and try again shortly."),
});

/**
 * Credential endpoints: login and register.
 *
 * `skipSuccessfulRequests` means a legitimate user who signs in correctly
 * doesn't burn through their allowance — the budget is spent on *failed*
 * attempts, which is exactly what brute-forcing looks like.
 */
export const authLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: scale(8),
  skipSuccessfulRequests: true,
  handler: jsonRejection(
    "Too many attempts from this device. Please wait 15 minutes before trying again."
  ),
});

/**
 * Admin login. Stricter than the customer-facing one and counts successes too:
 * there is exactly one admin, so there's no legitimate reason for a burst of
 * admin logins from one IP.
 */
export const adminLoginLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: scale(5),
  handler: jsonRejection(
    "Too many login attempts. This device is temporarily blocked from admin sign-in."
  ),
});

/**
 * OTP verification. Codes are short, so guessing is cheap without a cap.
 * Successful verifications are skipped so a user who fat-fingers a digit or
 * two still gets through.
 */
export const otpVerifyLimiter = rateLimit({
  ...baseOptions,
  windowMs: 10 * 60 * 1000,
  limit: scale(10),
  skipSuccessfulRequests: true,
  handler: jsonRejection(
    "Too many incorrect codes. Please request a new code in a few minutes."
  ),
});

/**
 * OTP resend and forgot-password. Each of these sends a real email on our
 * dime and lands in someone's inbox, so this is abuse prevention (mail-bombing
 * a third party, burning the SMTP quota) as much as security. A long window
 * with a small budget fits how these are actually used.
 */
export const otpResendLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000, // 1 hour
  limit: scale(5),
  handler: jsonRejection(
    "You've requested too many codes. Please wait a while before requesting another."
  ),
});

export const passwordResetLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: scale(5),
  handler: jsonRejection(
    "Too many password reset requests. Please try again later."
  ),
});

/**
 * Token refresh. Called automatically by the axios interceptor, so it needs
 * more headroom than a login, but an unbounded refresh endpoint is a free
 * oracle for testing stolen cookies.
 */
export const refreshLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: scale(60),
  handler: jsonRejection("Too many session refreshes. Please sign in again."),
});

/**
 * Order placement. Guests can check out, so this is the one write endpoint an
 * unauthenticated visitor can hit — worth a cap so it can't be used to spam
 * the orders collection.
 */
export const orderCreateLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: scale(15),
  handler: jsonRejection(
    "Too many orders placed from this device. Please contact us if you need help."
  ),
});

/**
 * Review submission — public-ish write path, capped to keep it from being
 * used as a spam channel.
 */
export const reviewLimiter = rateLimit({
  ...baseOptions,
  windowMs: 60 * 60 * 1000,
  limit: scale(10),
  handler: jsonRejection("Too many reviews submitted. Please try again later."),
});

/**
 * Image upload. Admin-only and already behind adminProtect, but uploads are
 * the most expensive request we serve (Cloudinary bandwidth), so it gets its
 * own ceiling regardless.
 */
export const uploadLimiter = rateLimit({
  ...baseOptions,
  windowMs: 15 * 60 * 1000,
  limit: scale(30),
  handler: jsonRejection("Upload limit reached. Please wait a few minutes."),
});
