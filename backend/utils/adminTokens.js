import jwt from "jsonwebtoken";

// Mirrors generateTokens.js's structure but issues tokens signed with the
// ADMIN_-prefixed secrets, and includes a `type: "admin"` claim inside the
// payload itself. That claim means even if someone somehow mixed up which
// secret to verify against, the payload shape alone still won't satisfy
// adminAuthMiddleware's checks — a small extra layer on top of using
// separate secrets entirely.

export const generateAdminAccessToken = () => {
  return jwt.sign({ type: "admin" }, process.env.ADMIN_JWT_ACCESS_SECRET, {
    expiresIn: process.env.ADMIN_JWT_ACCESS_EXPIRES || "30m",
  });
};

export const generateAdminRefreshToken = () => {
  return jwt.sign({ type: "admin" }, process.env.ADMIN_JWT_REFRESH_SECRET, {
    expiresIn: process.env.ADMIN_JWT_REFRESH_EXPIRES || "7d",
  });
};

export const setAdminRefreshTokenCookie = (res, token) => {
  // Distinct cookie name ("adminRefreshToken") from the customer session's
  // "refreshToken" cookie — critical detail: without this, logging into
  // the admin dashboard in one browser tab would silently overwrite the
  // customer session cookie (and vice versa), since cookies are scoped
  // per-domain, not per-app-section. Two different cookie names let both
  // sessions coexist in the same browser without stomping on each other.
  res.cookie("adminRefreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};