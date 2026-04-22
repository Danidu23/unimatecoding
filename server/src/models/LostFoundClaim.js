const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFoundFoundItem', required: true },
  explanation: { type: String, required: true },
  identifier: { type: String, required: true },
  proofImage: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  reviewNote: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.models.LostFoundClaim || mongoose.model('LostFoundClaim', claimSchema);
