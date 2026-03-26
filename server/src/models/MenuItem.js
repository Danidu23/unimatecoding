const mongoose = require('mongoose');

const MENU_CATEGORIES = [
  'rice_curry',
  'kottu',
  'fried_rice',
  'additional_curries',
  'meats',
  'chopsuey_sides',
  'beverages',
];

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: MENU_CATEGORIES,
    },
    tags: {
      type: [String],
      default: [],
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    canteen: {
      type: String,
      default: 'main',
      enum: ['main'],
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = {
  MenuItem,
  MENU_CATEGORIES,
};