import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  role: { type: String, enum: ['member', 'admin'], default: 'member' }
});

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  avatar: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [memberSchema],
  active: { type: Boolean, default: true },
  settings: {
    currency: { type: String, default: 'INR' },
    defaultSplit: { type: String, enum: ['equal', 'exact', 'percentage', 'shares'], default: 'equal' }
  }
}, { timestamps: true });

export default mongoose.model('Group', groupSchema);
