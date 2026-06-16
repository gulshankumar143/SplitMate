import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  icon: { type: String },
  color: { type: String, default: '#0EA5E9' }
});

export default mongoose.model('Category', categorySchema);
