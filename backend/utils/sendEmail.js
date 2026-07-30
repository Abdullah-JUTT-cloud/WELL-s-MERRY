import nodemailer from "nodemailer";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const brandLogoPath = path.resolve(__dirname, "../../frontend/src/assets/logo.jpg");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_FROM || `Well's Merry <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: [
      ...(existsSync(brandLogoPath)
        ? [
            {
              filename: "logo.jpg",
              path: brandLogoPath,
              cid: "wells-merry-logo",
            },
          ]
        : []),
      ...(options.attachments || []),
    ],
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
