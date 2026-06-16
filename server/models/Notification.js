import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  message: { type: String },
  seen: { type: Boolean, default: false },
  meta: { type: Object }
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
