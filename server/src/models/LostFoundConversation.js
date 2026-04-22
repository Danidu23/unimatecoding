const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  participantIds: [{ type: String }],
  participantNames: [String],
  participantAvatars: [String],
  itemId: { type: String },
  itemTitle: String,
  lastMessage: String,
  lastMessageTime: { type: Date, default: Date.now },
  unreadCount: { type: Map, of: Number, default: new Map() }
}, { timestamps: true });

module.exports = mongoose.models.LostFoundConversation || mongoose.model('LostFoundConversation', conversationSchema);
