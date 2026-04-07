const mongoose = require('mongoose');

const LookbookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  season: {
    type: String,
    required: true,
    default: 'Spring/Summer 2026'
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  products: [{
    name: { type: String, required: true },
    price: { type: Number, required: true },
    link: { type: String, default: '/collections' },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  }],
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster queries
LookbookSchema.index({ season: 1 });
LookbookSchema.index({ featured: 1 });
LookbookSchema.index({ active: 1 });
LookbookSchema.index({ displayOrder: 1 });

module.exports = mongoose.model('Lookbook', LookbookSchema);