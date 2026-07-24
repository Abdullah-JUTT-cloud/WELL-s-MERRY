// Escape HTML special chars to prevent XSS injection via user-controlled values
const escapeHtml = (str) =>
  String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const otpEmailTemplate = (name, otp, purpose) => {
  name = escapeHtml(name);
  otp = escapeHtml(otp);

  const heading =
    purpose === "reset-password" ? "Reset your password" : "Verify your email";

  const message =
    purpose === "reset-password"
      ? "Use the code below to reset your Well's Merry account password."
      : "Use the code below to verify your email and activate your Well's Merry account.";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #ffffff; border: 1px solid #e5e0d3;">
      <h2 style="color: #1a1a1a; font-size: 20px;">${heading}</h2>
      <p style="color: #333; font-size: 14px;">Hi ${name},</p>
      <p style="color: #333; font-size: 14px;">${message}</p>
      <p style="font-size: 28px; letter-spacing: 6px; font-weight: bold; color: #1a1a1a; margin: 24px 0; text-align: center; border: 1px solid #e5e0d3; padding: 16px; background: #faf8f2;">
        ${otp}
      </p>
      <p style="color: #666; font-size: 12px;">This code expires in ${process.env.OTP_EXPIRES_MINUTES || 15} minutes. If you didn't request this, you can ignore this email.</p>
      <p style="color: #999; font-size: 12px; margin-top: 32px;">Well's Merry · This is an automated message.</p>
    </div>
  `;
};

export default otpEmailTemplate;