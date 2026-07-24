import jwt from "jsonwebtoken";

// Short-lived token sent to the client, used to authorize API requests
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES || "15m",
  });
};

// Long-lived token stored as an httpOnly cookie, used only to get a new access token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || "30d",
  });
};

// Sets the refresh token as an httpOnly cookie on the response
export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true, // not readable by JS in the browser — protects against XSS token theft
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days, matches JWT_REFRESH_EXPIRES default
  });
};