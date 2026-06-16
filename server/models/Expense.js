import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  paidShare: { type: Number, default: 0 },
  percent: { type: Number, default: 0 }
});

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, default: 'Others' },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  date: { type: Date, required: true, default: Date.now },
  location: { type: String },
  notes: { type: String },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  splitType: { type: String, enum: ['equal', 'exact', 'percentage', 'shares'], default: 'equal' },
  splitDetails: [splitSchema],
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  recurring: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly', 'none'], default: 'none' },
    nextDate: Date
  },
  attachments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attachment' }],
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, enum: ['pending', 'completed', 'partial'], default: 'pending' },
  tags: [{ type: String }]
}, { timestamps: true });

export default mongoose.model('Expense', expenseSchema);
