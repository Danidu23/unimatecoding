const mongoose = require('mongoose');

const lostItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  lastSeenLocation: { type: String, required: true },
  dateLost: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String },
  contact: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Matched', 'Closed'], default: 'Pending' },
  reviewNote: { type: String },
  reviewedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.models.LostFoundLostItem || mongoose.model('LostFoundLostItem', lostItemSchema);
