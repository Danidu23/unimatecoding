import mongoose from 'mongoose';

const lostItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  lastSeenLocation: { type: String, required: true },
  dateLost: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String },
  contact: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Matched', 'Closed'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.LostItem || mongoose.model('LostItem', lostItemSchema);
