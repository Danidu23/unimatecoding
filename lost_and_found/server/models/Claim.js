import mongoose from 'mongoose';

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'FoundItem', required: true },
  explanation: { type: String, required: true },
  identifier: { type: String, required: true },
  proofImage: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

export default mongoose.models.Claim || mongoose.model('Claim', claimSchema);
