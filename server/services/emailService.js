// import nodemailer from 'nodemailer';

// const EMAIL_HOST = process.env.EMAIL_HOST;
// const EMAIL_PORT = process.env.EMAIL_PORT;
// const EMAIL_USER = process.env.EMAIL_USER;
// const EMAIL_PASS = process.env.EMAIL_PASS;

// const isEmailConfigured =
//   EMAIL_HOST &&
//   EMAIL_PORT &&
//   EMAIL_USER &&
//   EMAIL_PASS;

// console.log('EMAIL_HOST:', EMAIL_HOST);
// console.log('EMAIL_PORT:', EMAIL_PORT);
// console.log('EMAIL_USER:', EMAIL_USER);
// console.log('Email Configured:', !!isEmailConfigured);

// const transporter = isEmailConfigured
//   ? nodemailer.createTransport({
//       host: EMAIL_HOST,
//       port: Number(EMAIL_PORT),
//       secure: Number(EMAIL_PORT) === 465,
//       auth: {
//         user: EMAIL_USER,
//         pass: EMAIL_PASS
//       }
//     })
//   : null;

// export const sendEmail = async (to, subject, text, html) => {
//   const message = {
//     from: EMAIL_USER,
//     to,
//     subject,
//     text,
//     html: html || `<p>${text}</p>`
//   };

//   try {
//     console.log('Attempting to send email...');
//     console.log('To:', to);
//     console.log('Subject:', subject);

//     if (!isEmailConfigured) {
//       throw new Error('Email service is not configured');
//     }

//     const info = await transporter.sendMail(message);

//     console.log('Email sent successfully!');
//     console.log('Message ID:', info.messageId);

//     return info;
//   } catch (error) {
//     console.error('EMAIL ERROR:');
//     console.error(error);

//     throw error;
//   }
// };

import { Resend } from 'resend';

console.log("RESEND KEY EXISTS:", !!process.env.RESEND_API_KEY);

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (to, subject, text, html) => {
  try {
    console.log("Sending email to:", to);

    const response = await resend.emails.send({
      from: 'SplitMate <onboarding@resend.dev>',
      to,
      subject,
      html: html || `<p>${text}</p>`
    });

    console.log("RESEND RESPONSE:", JSON.stringify(response, null, 2));

    return response;
  } catch (error) {
    console.error("RESEND ERROR:", error);
    throw error;
  }
};