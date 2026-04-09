const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
  },
  name: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'unsubscribed', 'bounced'],
    default: 'active'
  },
  source: {
    type: String,
    enum: ['website', 'checkout', 'popup', 'footer', 'manual'],
    default: 'website'
  },
  preferences: {
    newArrivals: { type: Boolean, default: true },
    sales: { type: Boolean, default: true },
    styling: { type: Boolean, default: true },
    weeklyDigest: { type: Boolean, default: false }
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    referrer: String
  },
  subscribedAt: {
    type: Date,
    default: Date.now
  },
  unsubscribedAt: {
    type: Date
  },
  lastEmailSent: {
    type: Date
  },
  emailsSent: {
    type: Number,
    default: 0
  },
  emailsOpened: {
    type: Number,
    default: 0
  },
  emailsClicked: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for faster queries
NewsletterSchema.index({ email: 1 });
NewsletterSchema.index({ status: 1 });
NewsletterSchema.index({ subscribedAt: -1 });

module.exports = mongoose.model('Newsletter', NewsletterSchema);