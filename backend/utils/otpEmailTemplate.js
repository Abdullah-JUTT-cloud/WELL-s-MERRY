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

  const expiryMinutes = process.env.OTP_EXPIRES_MINUTES || 15;

  const heading =
    purpose === "reset-password" ? "Reset your password" : "Verify your email";

  const message =
    purpose === "reset-password"
      ? "Use the code below to reset your Well's Merry account password."
      : "Use the code below to verify your email and activate your Well's Merry account.";

  return `
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin: 0; padding: 0; background: #f7f2e9;">
      <tr>
        <td align="center" style="padding: 42px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width: 100%; max-width: 560px; overflow: hidden; background: #ffffff; border: 1px solid #eadfc9; border-radius: 22px; box-shadow: 0 18px 45px rgba(89, 69, 36, 0.12); font-family: Arial, Helvetica, sans-serif;">
            <tr>
              <td style="padding: 0; background: #163829;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="padding: 26px 34px;">
                      <p style="margin: 0; color: #d7a63f; font-size: 12px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase;">Well's Merry</p>
                      <h1 style="margin: 10px 0 0; color: #fffaf0; font-size: 26px; line-height: 1.25; font-weight: 700;">${heading}</h1>
                    </td>
                    <td align="right" style="padding: 26px 34px 26px 10px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="width: 54px; height: 54px; background: #fffaf0; border-radius: 27px;">
                        <tr>
                          <td align="center" valign="middle" style="width: 54px; height: 54px; padding: 7px;">
                            <img src="cid:wells-merry-logo" width="40" height="40" alt="Well's Merry" style="display: block; width: 40px; height: 40px; border: 0; border-radius: 20px; object-fit: cover;" />
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 34px 34px 12px;">
                <p style="margin: 0 0 14px; color: #2a2a24; font-size: 16px; line-height: 1.65;">Hi ${name},</p>
                <p style="margin: 0; color: #4b463b; font-size: 15px; line-height: 1.7;">${message}</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 20px 34px 12px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background: #fff8e9; border: 1px solid #eadfc9; border-radius: 16px;">
                  <tr>
                    <td align="center" style="padding: 24px 16px;">
                      <p style="margin: 0 0 8px; color: #7b6a48; font-size: 12px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase;">Your secure code</p>
                      <p style="margin: 0; color: #171711; font-size: 34px; line-height: 1.2; font-weight: 700; letter-spacing: 10px;">${otp}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding: 14px 34px 34px;">
                <p style="margin: 0; color: #6e675b; font-size: 13px; line-height: 1.65;">This code expires in <strong style="color: #2a2a24;">${expiryMinutes} minutes</strong>. If you didn't request this, you can safely ignore this email.</p>
              </td>
            </tr>
            <tr>
              <td style="padding: 22px 34px; background: #fbf7ef; border-top: 1px solid #eadfc9;">
                <p style="margin: 0; color: #8a806f; font-size: 12px; line-height: 1.6;">Well's Merry sent this automated message to help keep your account secure.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
};

export default otpEmailTemplate;
