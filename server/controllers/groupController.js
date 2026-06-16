import mongoose from 'mongoose';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const createGroup = catchAsync(async (req, res) => {
  const payload = { ...req.body, createdBy: req.user._id, members: [{ user: req.user._id, role: 'admin' }] };
  const group = await Group.create(payload);
  return successResponse(res, { group }, 'Group created');
});

export const addMember = catchAsync(async (req, res) => {
  const { groupId, memberId } = req.body;
  const group = await Group.findById(groupId);
  if (!group) return errorResponse(res, 'Group not found', 404);
  if (!group.members.some(m => m.user.toString() === req.user._id.toString())) return errorResponse(res, 'Access denied', 403);

  let user = null;
  if (mongoose.Types.ObjectId.isValid(memberId)) {
    user = await User.findById(memberId);
  }
  if (!user) {
    user = await User.findOne({ email: memberId });
  }
  if (!user) return errorResponse(res, 'User not found', 404);

  const userIdString = user._id.toString();
  if (group.members.some(m => m.user.toString() === userIdString)) return errorResponse(res, 'Member already added', 400);

  group.members.push({ user: user._id, role: 'member' });
  await group.save();
  await User.findByIdAndUpdate(user._id, { $addToSet: { friends: req.user._id } });
  return successResponse(res, { group }, 'Member added');
});

export const getGroups = catchAsync(async (req, res) => {
  const groups = await Group.find({ 'members.user': req.user._id }).populate('members.user', 'name email avatar');
  return successResponse(res, { groups }, 'Groups loaded');
});

export const updateGroup = catchAsync(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return errorResponse(res, 'Group not found', 404);
  if (!group.members.some((member) => member.user.toString() === req.user._id.toString())) return errorResponse(res, 'Access denied', 403);
  Object.assign(group, req.body);
  await group.save();
  return successResponse(res, { group }, 'Group updated');
});

export const removeMember = catchAsync(async (req, res) => {
  const { groupId, memberId } = req.params;
  const group = await Group.findById(groupId);
  if (!group) return errorResponse(res, 'Group not found', 404);
  if (!group.members.some((member) => member.user.toString() === req.user._id.toString())) return errorResponse(res, 'Access denied', 403);
  group.members = group.members.filter((member) => member.user.toString() !== memberId);
  await group.save();
  return successResponse(res, { group }, 'Member removed');
});

export const deleteGroup = catchAsync(async (req, res) => {
  const group = await Group.findById(req.params.id);
  if (!group) return errorResponse(res, 'Group not found', 404);
  if (group.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') return errorResponse(res, 'Permission denied', 403);
  await Group.findByIdAndDelete(req.params.id);
  return successResponse(res, {}, 'Group deleted');
});

export const getGroupById = catchAsync(async (req, res) => {
  const group = await Group.findById(req.params.id).populate('members.user', 'name email avatar');
  if (!group) return errorResponse(res, 'Group not found', 404);
  return successResponse(res, { group }, 'Group loaded');
});
