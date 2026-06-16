import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const isEmailConfigured = EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS;

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === '465',
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
  : null;

export const sendEmail = async (to, subject, text, html) => {
  const message = {
    from: EMAIL_USER || 'no-reply@splitmate.local',
    to,
    subject,
    text,
    html: html || `<p>${text}</p>`
  };

  if (!isEmailConfigured) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Email not configured. Skipping sendMail. Message content:', message);
      return;
    }
    throw new Error('Email service is not configured');
  }

  await transporter.sendMail(message);
};
