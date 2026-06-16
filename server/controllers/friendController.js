import FriendRequest from '../models/FriendRequest.js';
import User from '../models/User.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export const sendRequest = catchAsync(async (req, res) => {
  const { receiverId } = req.body;
  if (!receiverId) return errorResponse(res, 'Receiver ID is required', 400);
  if (receiverId === req.user._id.toString()) return errorResponse(res, 'Cannot send friend request to yourself', 400);

  const receiver = await User.findById(receiverId);
  if (!receiver) return errorResponse(res, 'Receiver not found', 404);

  const alreadyFriends = req.user.friends?.some((friendId) => friendId.toString() === receiverId);
  if (alreadyFriends) return errorResponse(res, 'You are already friends with this user', 400);

  const existing = await FriendRequest.findOne({
    $or: [
      { sender: req.user._id, receiver: receiverId },
      { sender: receiverId, receiver: req.user._id }
    ]
  });
  if (existing) {
    const message = existing.status === 'pending' ? 'A friend request is already pending' : 'A friend request already exists';
    return errorResponse(res, message, 400);
  }

  const request = await FriendRequest.create({ sender: req.user._id, receiver: receiverId });
  return successResponse(res, { request }, 'Friend request sent');
});

export const respondRequest = catchAsync(async (req, res) => {
  const { requestId, action } = req.body;
  const request = await FriendRequest.findById(requestId);
  if (!request || request.receiver.toString() !== req.user._id.toString()) return errorResponse(res, 'Request not found', 404);
  request.status = action === 'accept' ? 'accepted' : 'rejected';
  await request.save();
  if (action === 'accept') {
    await User.findByIdAndUpdate(req.user._id, { $addToSet: { friends: request.sender } });
    await User.findByIdAndUpdate(request.sender, { $addToSet: { friends: req.user._id } });
  }
  return successResponse(res, { request }, `Request ${request.status}`);
});

export const listFriends = catchAsync(async (req, res) => {
  const user = await User.findById(req.user._id).populate('friends', 'name email avatar role');
  return successResponse(res, { friends: user.friends }, 'Friends list loaded');
});

export const getFriendRequests = catchAsync(async (req, res) => {
  const requests = await FriendRequest.find({ receiver: req.user._id, status: 'pending' }).populate('sender', 'name email avatar');
  return successResponse(res, { requests }, 'Friend requests loaded');
});

export const searchFriends = catchAsync(async (req, res) => {
  const search = req.query.q || '';
  const users = await User.find({
    email: { $regex: search, $options: 'i' },
    _id: { $ne: req.user._id }
  }).select('name email avatar');

  const userIds = users.map((user) => user._id);
  const requests = await FriendRequest.find({
    $or: [
      { sender: req.user._id, receiver: { $in: userIds } },
      { sender: { $in: userIds }, receiver: req.user._id }
    ]
  });

  const requestMap = requests.reduce((map, request) => {
    const otherId = request.sender.toString() === req.user._id.toString() ? request.receiver.toString() : request.sender.toString();
    map[otherId] = request;
    return map;
  }, {});

  const usersWithStatus = users.map((user) => {
    const userObj = user.toObject();
    const friendId = userObj._id.toString();
    const isFriend = req.user.friends?.some((friend) => friend.toString() === friendId);
    const request = requestMap[friendId];
    const isPending = request?.status === 'pending';
    let requestStatus = null;

    if (isPending) {
      requestStatus = request.sender.toString() === req.user._id.toString() ? 'pendingOutgoing' : 'pendingIncoming';
    }

    return {
      ...userObj,
      requestId: request?._id,
      isFriend,
      requestStatus,
      hasPendingRequest: isPending
    };
  });

  return successResponse(res, { users: usersWithStatus }, 'Search results');
});

export const removeFriend = catchAsync(async (req, res) => {
  const friendId = req.params.id;
  await User.findByIdAndUpdate(req.user._id, { $pull: { friends: friendId } });
  await User.findByIdAndUpdate(friendId, { $pull: { friends: req.user._id } });
  await FriendRequest.deleteMany({
    $or: [
      { sender: req.user._id, receiver: friendId },
      { sender: friendId, receiver: req.user._id }
    ]
  });
  return successResponse(res, {}, 'Friend removed');
});
