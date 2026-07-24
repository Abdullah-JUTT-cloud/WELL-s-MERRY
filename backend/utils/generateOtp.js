import crypto from "crypto";

// Generates a 6-digit numeric OTP using a cryptographically secure random source
const generateOtp = () => {
  // crypto.randomInt is uniform and avoids the bias/predictability of Math.random()
  return crypto.randomInt(100000, 999999).toString();
};

export default generateOtp;