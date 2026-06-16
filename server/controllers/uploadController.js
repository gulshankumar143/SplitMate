import fs from 'fs';
import Attachment from '../models/Attachment.js';
import User from '../models/User.js';
import { uploadFile } from '../services/uploadService.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const uploadAttachment = catchAsync(async (req, res) => {
  if (!req.file) return errorResponse(res, 'No file uploaded', 400);
  const result = await uploadFile(req.file.path);
  fs.unlinkSync(req.file.path);
  const attachment = await Attachment.create({ url: result.secure_url, filename: result.public_id, type: result.resource_type, uploadedBy: req.user._id });
  return successResponse(res, { attachment }, 'File uploaded');
});

export const uploadAvatar = catchAsync(async (req, res) => {
  if (!req.file) return errorResponse(res, 'No avatar file uploaded', 400);
  const result = await uploadFile(req.file.path);
  fs.unlinkSync(req.file.path);
  const user = await User.findByIdAndUpdate(req.user._id, { avatar: result.secure_url }, { new: true }).select('-password');
  return successResponse(res, { user, avatar: result.secure_url }, 'Avatar uploaded');
});
