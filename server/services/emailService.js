import nodemailer from 'nodemailer';

const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

const isEmailConfigured =
  EMAIL_HOST &&
  EMAIL_PORT &&
  EMAIL_USER &&
  EMAIL_PASS;

console.log('EMAIL_HOST:', EMAIL_HOST);
console.log('EMAIL_PORT:', EMAIL_PORT);
console.log('EMAIL_USER:', EMAIL_USER);
console.log('Email Configured:', !!isEmailConfigured);

const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
  : null;

export const sendEmail = async (to, subject, text, html) => {
  const message = {
    from: `"SplitMate" <${EMAIL_USER}>`,
    replyTo: EMAIL_USER,
    to,
    subject,
    text,
    html: html || `<p>${text}</p>`
  };

  if (!isEmailConfigured) {
    throw new Error('Email service is not configured');
  }

  try {
    console.log('Attempting to send email...');
    console.log('To:', to);
    console.log('Subject:', subject);

    await transporter.verify();
    console.log('SMTP verified successfully');

    const info = await transporter.sendMail(message);

    console.log('Email sent successfully!');
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