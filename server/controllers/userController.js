import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getProfile = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  return successResponse(res, { user }, 'Profile loaded');
});

export const updateProfile = catchAsync(async (req, res) => {
  const updates = ['name', 'avatar', 'settings', 'role'].reduce((acc, key) => {
    if (req.body[key] !== undefined) acc[key] = req.body[key];
    return acc;
  }, {});
  if (updates.role && req.user.role !== 'admin') delete updates.role;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
  return successResponse(res, { user }, 'Profile updated');
});

export const getAllUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-password');
  return successResponse(res, { users }, 'Users retrieved');
});
