const mongoose = require('mongoose');

const foundItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  locationFound: { type: String, required: true },
  dateFound: { type: Date, required: true },
  description: { type: String, required: true },
  image: { type: String },
  finderContact: { type: String },
  status: { type: String, enum: ['Pending', 'Claimed', 'Verified'], default: 'Pending' }
}, { timestamps: true });

module.exports = mongoose.models.FoundItem || mongoose.model('FoundItem', foundItemSchema);
