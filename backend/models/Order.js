const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Customer Information
  customerName: {
    type: String,
    trim: true
  },
  customerEmail: {
    type: String,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  customerPhone: {
    type: String,
    required: [true, 'Customer phone is required'],
    trim: true
  },
  
  // Product Information
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  productPrice: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  
  // Order Details
  quantity: {
    type: Number,
    default: 1,
    min: [1, 'Quantity must be at least 1']
  },
  size: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  totalPrice: {
    type: Number
  },
  
  // Order Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  
  // Shipping Information
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  
  // Payment Information
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'mobile_money', 'cash_on_delivery', 'card', 'other'],
    default: 'bank_transfer'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  
  // Additional Information
  notes: {
    type: String,
    trim: true
  },
  trackingNumber: {
    type: String,
    trim: true
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  confirmedAt: {
    type: Date
  },
  shippedAt: {
    type: Date
  },
  deliveredAt: {
    type: Date
  }
});

// Calculate total price before saving
orderSchema.pre('save', function(next) {
  this.totalPrice = this.productPrice * this.quantity;
  this.updatedAt = Date.now();
  next();
});

// Update status timestamps
orderSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'confirmed':
        this.confirmedAt = Date.now();
        break;
      case 'shipped':
        this.shippedAt = Date.now();
        break;
      case 'delivered':
        this.deliveredAt = Date.now();
        break;
    }
  }
  next();
});

// Index for faster queries
orderSchema.index({ status: 1 });
orderSchema.index({ customerPhone: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ paymentStatus: 1 });

// Generate order number
orderSchema.virtual('orderNumber').get(function() {
  return `JLF${this._id.toString().slice(-8).toUpperCase()}`;
});

// Ensure virtuals are included in JSON
orderSchema.set('toJSON', { virtuals: true });
orderSchema.set('toObject', { virtuals: true });

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);