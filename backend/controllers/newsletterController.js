const Newsletter = require('../models/Newsletter');
const emailService = require('../services/emailService');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    if (Newsletter) {
      const existing = await Newsletter.findOne({ email });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'This email is already subscribed'
        });
      }
    }

    // Save to database
    let subscriberId = null;
    if (Newsletter) {
      const subscriber = new Newsletter({
        email,
        status: 'active',
        subscribedAt: new Date()
      });
      const saved = await subscriber.save();
      subscriberId = saved._id;
    }

    // Send welcome email
    await emailService.sendNewsletterWelcome({ email });

    // Log subscription
    console.log('Newsletter subscription:', {
      id: subscriberId,
      email,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed to newsletter!',
      subscriberId
    });

  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!Newsletter) {
      return res.status(200).json({
        success: true,
        message: 'Unsubscribed successfully'
      });
    }

    const subscriber = await Newsletter.findOne({ email });
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our subscriber list'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    });

  } catch (error) {
    console.error('Error unsubscribing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
};

// Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    if (!Newsletter) {
      return res.status(200).json({
        success: true,
        message: 'Database not configured',
        subscribers: []
      });
    }

    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });
    
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers
    });
  } catch (error) {
    console.error('Error getting subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscribers'
    });
  }
};

// Delete subscriber
exports.deleteSubscriber = async (req, res) => {
  try {
    if (!Newsletter) {
      return res.status(404).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const subscriber = await Newsletter.findByIdAndDelete(req.params.id);
    
    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber'
    });
  }
};