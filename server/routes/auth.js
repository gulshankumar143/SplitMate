import express from 'express';
import {
  register,
  verifyOtp,
  login,
  googleLogin,
  refreshToken,
  forgotPassword,
  resetPassword
} from '../controllers/authController.js';

import { validateBody } from '../middleware/validate.js';
import {
  registerSchema,
  loginSchema,
  otpSchema,
  forgotSchema,
  resetSchema,
  googleSchema
} from '../utils/validationSchemas.js';

import { sendEmail } from '../services/emailService.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), register);
router.post('/verify-otp', validateBody(otpSchema), verifyOtp);
router.post('/login', validateBody(loginSchema), login);
router.post('/google', validateBody(googleSchema), googleLogin);
router.post('/refresh-token', refreshToken);
router.post('/forgot-password', validateBody(forgotSchema), forgotPassword);
router.post('/reset-password', validateBody(resetSchema), resetPassword);

router.get('/test-email', async (req, res) => {
  try {
    await sendEmail(
      'your-email@gmail.com', // replace with your email
      'Brevo Test',
      'Brevo SMTP is working!'
    );

    res.json({
      success: true,
      message: 'Email sent'
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;