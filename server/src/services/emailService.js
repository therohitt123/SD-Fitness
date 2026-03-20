import nodemailer from 'nodemailer';
import { ENV } from '../config/env.js';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: ENV.SMTP_HOST,
    port: ENV.SMTP_PORT,
    secure: ENV.SMTP_PORT === 465,
    auth: ENV.SMTP_USER
      ? {
          user: ENV.SMTP_USER,
          pass: ENV.SMTP_PASS,
        }
      : undefined,
  });

  return transporter;
}

export async function sendEmail({ to, subject, text, html }) {
  if (!ENV.SMTP_HOST) {
    throw new Error('SMTP is not configured');
  }

  const mailOptions = {
    from: ENV.SMTP_FROM,
    to,
    subject,
    text,
    html: html || `<p>${text || ''}</p>`,
  };

  const tx = getTransporter();
  await tx.sendMail(mailOptions);
}
