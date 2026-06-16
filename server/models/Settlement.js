import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  expense: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense' },
  payer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  payee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  paymentDate: { type: Date },
  proof: { type: String },
  notes: { type: String }
}, { timestamps: true });

export default mongoose.model('Settlement', settlementSchema);
