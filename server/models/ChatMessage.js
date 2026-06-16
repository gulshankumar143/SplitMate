import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  roomId: { type: String, required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['text', 'image', 'file'], default: 'text' }
}, { timestamps: true });

export default mongoose.model('ChatMessage', chatMessageSchema);
