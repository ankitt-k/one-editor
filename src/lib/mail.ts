// src/lib/mail.ts (or just lib/mail.ts if not using /src)

import nodemailer from "nodemailer";

export const sendEmail = async (
  to: string,
  subject: string,
  html: string // Must be an HTML string
) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // Set to true if using port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: '"One Editor" <noreply@oneeditor.com>', // Customize sender
    to,
    subject,
    html,
  });
};
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
