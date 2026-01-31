const mongoose = require('mongoose');

const lookbookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  season: {
    type: String,
    trim: true,
    default: 'Spring/Summer 2026'
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    required: [true, 'Image is required'],
    default: 'assets/images/lookbook-placeholder.jpg'
  },
  products: [{
    name: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    link: {
      type: String,
      default: '/collections'
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }
  }],
  tags: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
lookbookSchema.index({ season: 1 });
lookbookSchema.index({ featured: 1 });
lookbookSchema.index({ displayOrder: 1 });

// Update timestamp on save
lookbookSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total look price
lookbookSchema.virtual('totalPrice').get(function() {
  return this.products.reduce((sum, product) => sum + product.price, 0);
});

// Ensure virtuals are included in JSON
lookbookSchema.set('toJSON', { virtuals: true });
lookbookSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Lookbook || mongoose.model('Lookbook', lookbookSchema);