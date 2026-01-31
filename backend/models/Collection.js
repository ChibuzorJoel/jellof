const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Collection name is required'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    default: 'assets/images/collection-placeholder.jpg'
  },
  season: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  products: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
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
collectionSchema.index({ name: 1 });
collectionSchema.index({ isActive: 1 });
collectionSchema.index({ displayOrder: 1 });

// Update timestamp on save
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Populate products when querying
collectionSchema.pre(/^find/, function(next) {
  this.populate('products');
  next();
});

module.exports = mongoose.models.Collection || mongoose.model('Collection', collectionSchema);