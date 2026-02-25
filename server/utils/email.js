import nodemailer from 'nodemailer';
import crypto from 'crypto';

export const generateVerificationToken = () => crypto.randomBytes(32).toString('hex');

const createTransporter = async () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  try {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    });
  } catch {
    return null;
  }
};

export const sendVerificationEmail = async (email, token) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const verifyUrl = `${baseUrl}/verify-email?token=${token}`;

  const transporter = await createTransporter();
  if (!transporter) {
    console.log('[Dev] No email configured. Verification link:', verifyUrl);
    return { devLink: verifyUrl };
  }

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM || '"Jengo" <noreply@jengo.org>',
    to: email,
    subject: 'Verify your Jengo account',
    html: `
      <p>Thanks for signing up for Jengo!</p>
      <p>Please click the link below to verify your email address:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link expires in 24 hours.</p>
      <p>If you didn't create an account, you can ignore this email.</p>
    `,
    text: `Verify your Jengo account: ${verifyUrl}`
  });

  if (!process.env.SMTP_HOST) {
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) console.log('[Dev] Email preview:', previewUrl);
  }
  return info;
};
