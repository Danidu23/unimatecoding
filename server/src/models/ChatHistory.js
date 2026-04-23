const mongoose = require('mongoose');

const chatHistorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  messages: [{
    id: { type: Number, required: true },
    type: { type: String, enum: ['user', 'bot'], required: true },
    text: { type: String, required: true },
    time: { type: String, required: true }
  }],
  summary: { type: String, default: '' },
  summaryUpdatedAt: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('ChatHistory', chatHistorySchema);
