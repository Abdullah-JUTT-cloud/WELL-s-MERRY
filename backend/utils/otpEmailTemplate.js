const otpEmailTemplate = (name, otp, purpose) => {
  const heading =
    purpose === "reset-password" ? "Reset your password" : "Verify your email";

  const message =
    purpose === "reset-password"
      ? "Use the code below to reset your Well's Merry account password."
      : "Use the code below to verify your email and activate your Well's Merry account.";

  return `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f7f2e7;">
      <h2 style="color: #0e0c08;">${heading}</h2>
      <p style="color: #333;">Hi ${name},</p>
      <p style="color: #333;">${message}</p>
      <div style="font-size: 32px; letter-spacing: 8px; font-weight: bold; color: #a9791c; margin: 24px 0; text-align: center;">
        ${otp}
      </div>
      <p style="color: #666; font-size: 13px;">This code expires in ${process.env.OTP_EXPIRES_MINUTES || 15} minutes. If you didn't request this, you can safely ignore this email.</p>
      <p style="color: #999; font-size: 12px; margin-top: 32px;">— Well's Merry</p>
    </div>
  `;
};

export default otpEmailTemplate;