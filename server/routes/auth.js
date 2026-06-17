import express from 'express';
import { register, verifyOtp, login, googleLogin, refreshToken, forgotPassword, resetPassword } from '../controllers/authController.js';
import { validateBody } from '../middleware/validate.js';
import { registerSchema, loginSchema, otpSchema, forgotSchema, resetSchema, googleSchema } from '../utils/validationSchemas.js';
import { sendEmail } from '../services/emailService.js';

const router = express.Router();
router.post('/register', validateBody(registerSchema), register);
router.post('/verify-otp', validateBody(otpSchema), verifyOtp);
router.post('/login', validateBody(loginSchema), login);
router.post('/google', validateBody(googleSchema), googleLogin);
router.post('/refresh-token', refreshToken);
// router.post('/forgot-password', validateBody(forgotSchema), forgotPassword);
// router.post('/reset-password', validateBody(resetSchema), resetPassword);
// export default router;

router.post('/forgot-password', validateBody(forgotSchema), forgotPassword);
router.post('/reset-password', validateBody(resetSchema), resetPassword);

router.get('/test-email', async (req, res) => {
  try {
    const result = await sendEmail(
      'pravinkumar9281@gmail.com',
      'SplitMate Render Test',
      'This is a test email from SplitMate Render deployment.'
    );

    res.json({
      success: true,
      result
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

export default router;