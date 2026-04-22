const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Club name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Technology', 'Leadership', 'Arts', 'Sports', 'Academic', 'Community', 'Media', 'Wellness'],
  },
  memberCount: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  about: {
    type: String,
    default: '',
  },
  tags: {
    type: [String],
    default: [],
  },
  logoUrl: {
    type: String,
    default: '',
  },
  gallery: {
    type: [String],
    default: [],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Club', clubSchema);
