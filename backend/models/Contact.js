const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number cannot exceed 20 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot exceed 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied'],
    default: 'new'
  },
  reply: {
    type: String,
    trim: true,
    maxlength: [2000, 'Reply cannot exceed 2000 characters']
  },
  repliedAt: {
    type: Date
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  },
  tags: [{
    type: String,
    trim: true
  }],
  priority: {
    type: String,
    enum: ['low', 'normal', 'high'],
    default: 'normal'
  },
  category: {
    type: String,
    enum: ['general', 'support', 'sales', 'feedback', 'complaint', 'other'],
    default: 'general'
  }
}, {
  timestamps: true
});

// Indexes for faster queries
contactSchema.index({ status: 1 });
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ priority: 1, status: 1 });

// Virtual for response time
contactSchema.virtual('responseTime').get(function() {
  if (this.repliedAt && this.createdAt) {
    return this.repliedAt - this.createdAt;
  }
  return null;
});

// Method to mark as read
contactSchema.methods.markAsRead = async function() {
  if (this.status === 'new') {
    this.status = 'read';
    this.updatedAt = new Date();
    await this.save();
  }
  return this;
};

// Method to mark as replied
contactSchema.methods.markAsReplied = async function(replyMessage) {
  this.status = 'replied';
  this.reply = replyMessage;
  this.repliedAt = new Date();
  this.updatedAt = new Date();
  await this.save();
  return this;
};

// Static method to get statistics
contactSchema.statics.getStats = async function() {
  const stats = {
    total: await this.countDocuments(),
    new: await this.countDocuments({ status: 'new' }),
    read: await this.countDocuments({ status: 'read' }),
    replied: await this.countDocuments({ status: 'replied' }),
    today: await this.countDocuments({
      createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
    }),
    thisWeek: await this.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 7)) }
    }),
    thisMonth: await this.countDocuments({
      createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
    })
  };

  return stats;
};

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;