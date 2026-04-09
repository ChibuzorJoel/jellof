const Newsletter = require('../models/Newsletter');
const emailService = require('../services/emailService');

// Subscribe to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email, name, source, preferences } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });

    if (existing) {
      if (existing.status === 'active') {
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          subscriber: existing
        });
      } else {
        // Reactivate subscription
        existing.status = 'active';
        existing.subscribedAt = new Date();
        existing.unsubscribedAt = undefined;
        if (name) existing.name = name;
        if (preferences) existing.preferences = { ...existing.preferences, ...preferences };
        await existing.save();

        return res.status(200).json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          subscriber: existing
        });
      }
    }

    // Create new subscriber
    const subscriber = new Newsletter({
      email: email.toLowerCase(),
      name,
      source: source || 'website',
      preferences: preferences || {},
      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent'),
        referrer: req.get('Referer')
      }
    });

    await subscriber.save();

    // Send welcome email (non-blocking)
    try {
      if (emailService && emailService.sendWelcomeEmail) {
        await emailService.sendWelcomeEmail({ email, name });
        console.log('✅ Welcome email sent to:', email);
      }
    } catch (emailError) {
      console.warn('⚠️ Welcome email failed:', emailError.message);
    }

    console.log('✅ New newsletter subscriber:', email);

    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Check your email for confirmation.',
      subscriber
    });

  } catch (error) {
    console.error('❌ Error subscribing to newsletter:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe. Please try again later.'
    });
  }
};

// Unsubscribe from newsletter
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.params;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our mailing list'
      });
    }

    if (subscriber.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed'
      });
    }

    subscriber.status = 'unsubscribed';
    subscriber.unsubscribedAt = new Date();
    await subscriber.save();

    console.log('✅ Newsletter unsubscribe:', email);

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed'
    });

  } catch (error) {
    console.error('❌ Error unsubscribing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe'
    });
  }
};

// Get all subscribers (admin)
exports.getAllSubscribers = async (req, res) => {
  try {
    const { status, source, limit = 100 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (source) query.source = source;

    const subscribers = await Newsletter.find(query)
      .sort({ subscribedAt: -1 })
      .limit(parseInt(limit));

    const stats = {
      total: await Newsletter.countDocuments(),
      active: await Newsletter.countDocuments({ status: 'active' }),
      unsubscribed: await Newsletter.countDocuments({ status: 'unsubscribed' }),
      bounced: await Newsletter.countDocuments({ status: 'bounced' })
    };

    console.log(`📧 Retrieved ${subscribers.length} subscribers`);

    res.status(200).json({
      success: true,
      count: subscribers.length,
      stats,
      subscribers
    });

  } catch (error) {
    console.error('❌ Error getting subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscribers'
    });
  }
};

// Get subscriber by email (admin)
exports.getSubscriberByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    res.status(200).json({
      success: true,
      subscriber
    });

  } catch (error) {
    console.error('❌ Error getting subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve subscriber'
    });
  }
};

// Update subscriber preferences
exports.updatePreferences = async (req, res) => {
  try {
    const { email } = req.params;
    const { preferences } = req.body;

    const subscriber = await Newsletter.findOne({ email: email.toLowerCase() });

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    subscriber.preferences = { ...subscriber.preferences, ...preferences };
    await subscriber.save();

    console.log('✅ Preferences updated for:', email);

    res.status(200).json({
      success: true,
      message: 'Preferences updated successfully',
      subscriber
    });

  } catch (error) {
    console.error('❌ Error updating preferences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update preferences'
    });
  }
};

// Delete subscriber (admin)
exports.deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const subscriber = await Newsletter.findByIdAndDelete(id);

    if (!subscriber) {
      return res.status(404).json({
        success: false,
        message: 'Subscriber not found'
      });
    }

    console.log('✅ Subscriber deleted:', subscriber.email);

    res.status(200).json({
      success: true,
      message: 'Subscriber deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting subscriber:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete subscriber'
    });
  }
};

// Export subscribers to CSV (admin)
exports.exportSubscribers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = {};
    if (status) query.status = status;

    const subscribers = await Newsletter.find(query).sort({ subscribedAt: -1 });

    // Create CSV content
    const csvRows = ['Email,Name,Status,Source,Subscribed At'];
    
    subscribers.forEach(sub => {
      const row = [
        sub.email,
        sub.name || '',
        sub.status,
        sub.source,
        new Date(sub.subscribedAt).toISOString()
      ].join(',');
      csvRows.push(row);
    });

    const csvContent = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=subscribers.csv');
    res.status(200).send(csvContent);

  } catch (error) {
    console.error('❌ Error exporting subscribers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export subscribers'
    });
  }
};

// Get newsletter statistics (admin)
exports.getStatistics = async (req, res) => {
  try {
    const stats = {
      total: await Newsletter.countDocuments(),
      active: await Newsletter.countDocuments({ status: 'active' }),
      unsubscribed: await Newsletter.countDocuments({ status: 'unsubscribed' }),
      bounced: await Newsletter.countDocuments({ status: 'bounced' }),
      bySource: await Newsletter.aggregate([
        { $group: { _id: '$source', count: { $sum: 1 } } }
      ]),
      recentSubscribers: await Newsletter.countDocuments({
        subscribedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      }),
      avgEmailsOpened: await Newsletter.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: null, avg: { $avg: '$emailsOpened' } } }
      ])
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error getting statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics'
    });
  }
};

module.exports = exports;