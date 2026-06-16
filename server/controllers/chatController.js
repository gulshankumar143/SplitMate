import ChatMessage from '../models/ChatMessage.js';
import { catchAsync } from '../utils/catchAsync.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';
import { getSocket } from '../sockets/socketServer.js';

export const getRoomMessages = catchAsync(async (req, res) => {
  const messages = await ChatMessage.find({ roomId: req.params.roomId }).populate('sender', 'name avatar');
  return successResponse(res, { messages }, 'Chat loaded');
});

export const sendMessage = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const { content, type } = req.body;
  if (!content) return errorResponse(res, 'Message content is required', 400);
  const message = await ChatMessage.create({ roomId, sender: req.user._id, content, type: type || 'text' });
  const populated = await message.populate('sender', 'name avatar');
  const io = getSocket();
  if (io) io.to(roomId).emit('newMessage', populated);
  return successResponse(res, { message: populated }, 'Message sent');
});
