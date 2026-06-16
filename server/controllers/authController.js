import User from '../models/User.js';
import FriendRequest from '../models/FriendRequest.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import jwt from 'jsonwebtoken';
import { createTokens } from '../utils/generateToken.js';
import { generateOTP } from '../services/otpService.js';
import { sendEmail } from '../services/emailService.js';
import { OAuth2Client } from 'google-auth-library';
import { otpTemplate } from '../templates/otpTemplate.js';
import { resetPasswordTemplate } from '../templates/resetPasswordTemplate.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return errorResponse(res, 'Email already in use', 409);

  const otp = generateOTP();
  const user = await User.create({ name, email, password, otp, emailVerified: false });
  await sendEmail(email, 'Your SplitMate OTP', `Your verification code is ${otp.code}. It expires in 10 minutes.`, otpTemplate({ name, code: otp.code, expiryMinutes: otp.expiresIn || 10 }));

  const responseData = { userId: user._id, email };
  if (process.env.NODE_ENV !== 'production') responseData.otp = otp.code;
  return successResponse(res, responseData, 'Registration started. Verify your email.');
});

export const verifyOtp = catchAsync(async (req, res) => {
  const { email, code } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp?.code) return errorResponse(res, 'Invalid request', 400);
  if (user.otp.code !== code || user.otp.expiresAt < new Date()) return errorResponse(res, 'OTP invalid or expired', 400);

  user.emailVerified = true;
  user.otp = undefined;
  await user.save();

  const tokens = createTokens(user);
  const userData = user.toObject();
  delete userData.password;
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return successResponse(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userData }, 'Email verified successfully.');
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return errorResponse(res, 'User not found', 404);
  if (!user.password || !(await user.matchPassword(password))) return errorResponse(res, 'Wrong password', 401);

  const tokens = createTokens(user);
  const userData = user.toObject();
  delete userData.password;
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return successResponse(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userData }, 'Login successful.');
});

export const googleLogin = catchAsync(async (req, res) => {
  const { token } = req.body;
  const ticket = await googleClient.verifyIdToken({ idToken: token, audience: process.env.GOOGLE_CLIENT_ID });
  const payload = ticket.getPayload();
  const user = await User.findOneAndUpdate({ email: payload.email }, {
    name: payload.name,
    avatar: payload.picture,
    provider: 'google',
    emailVerified: true
  }, { new: true, upsert: true, setDefaultsOnInsert: true });

  const tokens = createTokens(user);
  const userData = user.toObject();
  delete userData.password;
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'none',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });
  return successResponse(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken, user: userData }, 'Google login successful.');
});

export const refreshToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken || req.body.refreshToken;
  if (!refreshToken) return errorResponse(res, 'Refresh token missing', 401);

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user) return errorResponse(res, 'User not found', 401);
    const tokens = createTokens(user);
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'none',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });
    return successResponse(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken }, 'Token refreshed');
  } catch (err) {
    return errorResponse(res, 'Refresh token invalid or expired', 401);
  }
});

export const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return errorResponse(res, 'Email not registered', 404);
  const otp = generateOTP();
  user.otp = otp;
  await user.save();
  await sendEmail(email, 'SplitMate password reset code', `Reset code: ${otp.code}`, resetPasswordTemplate({ name: user.name || 'Friend', code: otp.code, expiryMinutes: otp.expiresIn || 10 }));
  const responseData = {};
  if (process.env.NODE_ENV !== 'production') responseData.otp = otp.code;
  return successResponse(res, responseData, 'Password reset OTP sent');
});

export const resetPassword = catchAsync(async (req, res) => {
  const { email, code, newPassword } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.otp?.code) return errorResponse(res, 'Invalid request', 400);
  if (user.otp.code !== code || user.otp.expiresAt < new Date()) return errorResponse(res, 'OTP invalid or expired', 400);
  user.password = newPassword;
  user.otp = undefined;
  await user.save();
  return successResponse(res, {}, 'Password has been reset');
});
