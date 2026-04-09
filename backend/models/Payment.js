const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  // Order Reference
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },

  // Transaction Info
  transactionId: {
    type: String,
    unique: true,
    default: function() {
      return 'TXN-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
  },

  // Customer Info
  customerName: {
    type: String,
    required: true
  },
  customerEmail: {
    type: String,
    required: true
  },

  // Payment Details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'transfer', 'whatsapp', 'cash', 'paypal', 'bank'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },

  // Additional Details
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },

  // Gateway Response (if using payment gateway)
  gatewayResponse: {
    type: mongoose.Schema.Types.Mixed
  },

  // Timestamps
  date: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Index for faster queries
PaymentSchema.index({ orderId: 1 });
PaymentSchema.index({ transactionId: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ customerEmail: 1 });
PaymentSchema.index({ date: -1 });

module.exports = mongoose.model('Payment', PaymentSchema);