import jwt from 'jsonwebtoken';

export const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const createTokens = (user) => ({
  accessToken: generateToken({ id: user._id, role: user.role }, process.env.JWT_SECRET, process.env.JWT_EXPIRES_IN || '15m'),
  refreshToken: generateToken({ id: user._id }, process.env.JWT_REFRESH_SECRET, process.env.REFRESH_TOKEN_EXPIRES_IN || '7d')
});
