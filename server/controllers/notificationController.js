import Notification from '../models/Notification.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const getNotifications = catchAsync(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 });
  return successResponse(res, { notifications }, 'Notifications loaded');
});

export const markAsRead = catchAsync(async (req, res) => {
  const notification = await Notification.findOneAndUpdate({ _id: req.params.id, user: req.user._id }, { seen: true }, { new: true });
  if (!notification) return errorResponse(res, 'Notification not found', 404);
  return successResponse(res, { notification }, 'Notification marked read');
});

export const createNotification = catchAsync(async (req, res) => {
  const { userId, type, title, message, meta } = req.body;
  if (!userId || !type || !title) return errorResponse(res, 'Missing required fields', 400);
  const notification = await Notification.create({ user: userId, type, title, message, meta });
  return successResponse(res, { notification }, 'Notification created');
});
