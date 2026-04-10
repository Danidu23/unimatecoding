const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFoundConversation', required: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  seen: { type: Boolean, default: false },
  seenAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.models.LostFoundMessage || mongoose.model('LostFoundMessage', messageSchema);
