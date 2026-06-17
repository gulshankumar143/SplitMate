import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"SplitMate" <${process.env.EMAIL_USER}>`,
      replyTo: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`
    });

    console.log('Email sent successfully');
    console.log('Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    console.log('Rejected:', info.rejected);
    console.log('Response:', info.response);

    return info;
  } catch (error) {
    console.error('EMAIL ERROR:', error);
    throw error;
  }
};