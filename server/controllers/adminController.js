import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const listUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  return successResponse(res, { users }, 'Users loaded');
});

export const toggleBanUser = catchAsync(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return errorResponse(res, 'User not found', 404);
  if (user.role === 'admin') return errorResponse(res, 'Cannot alter admin access', 403);
  user.active = !user.active;
  await user.save();
  return successResponse(res, { user }, `User ${user.active ? 'unblocked' : 'blocked'}`);
});
