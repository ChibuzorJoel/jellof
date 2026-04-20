const Contact = require('../models/Contact');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    console.log('═══════════════════════════════════════');
    console.log('📧 NEW CONTACT FORM SUBMISSION');
    console.log('═══════════════════════════════════════');
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Subject:', subject);
    console.log('═══════════════════════════════════════');

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and message'
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // Save to database
    const contact = new Contact({
      name,
      email,
      phone,
      subject: subject || 'No subject',
      message,
      status: 'new',
      ipAddress: req.ip,
      userAgent: req.headers['user-agent']
    });

    await contact.save();

    console.log('✅ Contact form saved to MongoDB');
    console.log('📝 Contact ID:', contact._id);
    console.log('');

    // Send notification email to admin (optional)
    try {
      // You can add email service here
      // await sendAdminNotification(contact);
    } catch (emailError) {
      console.warn('⚠️ Email notification failed (non-critical):', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      contactId: contact._id
    });

  } catch (error) {
    console.error('❌ Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.',
      error: error.message
    });
  }
};

// Get all contacts (Admin)
exports.getAllContacts = async (req, res) => {
  try {
    const { status, limit = 100, page = 1 } = req.query;
    
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Contact.countDocuments(query);

    console.log(`✅ Retrieved ${contacts.length} contact messages`);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      contacts
    });

  } catch (error) {
    console.error('❌ Error getting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts',
      error: error.message
    });
  }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      contact
    });

  } catch (error) {
    console.error('❌ Error getting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact',
      error: error.message
    });
  }
};

// Update contact status
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    console.log(`✅ Contact ${contact._id} status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Contact status updated',
      contact
    });

  } catch (error) {
    console.error('❌ Error updating contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact',
      error: error.message
    });
  }
};

// Send reply to contact
exports.sendReply = async (req, res) => {
  try {
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({
        success: false,
        message: 'Reply message is required'
      });
    }

    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    // Update contact with reply
    contact.reply = replyMessage;
    contact.status = 'replied';
    contact.repliedAt = new Date();
    contact.updatedAt = new Date();
    await contact.save();

    console.log('✅ Reply sent to:', contact.email);

    // Send email to customer (optional)
    try {
      // You can add email service here
      // await sendReplyEmail(contact, replyMessage);
      console.log('📧 Email would be sent to:', contact.email);
      console.log('📝 Reply message:', replyMessage);
    } catch (emailError) {
      console.warn('⚠️ Email sending failed (non-critical):', emailError.message);
    }

    res.status(200).json({
      success: true,
      message: 'Reply sent successfully',
      contact
    });

  } catch (error) {
    console.error('❌ Error sending reply:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send reply',
      error: error.message
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    console.log(`✅ Contact ${contact._id} deleted`);

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact',
      error: error.message
    });
  }
};

// Get contact statistics
exports.getContactStats = async (req, res) => {
  try {
    const stats = {
      total: await Contact.countDocuments(),
      new: await Contact.countDocuments({ status: 'new' }),
      read: await Contact.countDocuments({ status: 'read' }),
      replied: await Contact.countDocuments({ status: 'replied' }),
      
      // Today's contacts
      today: await Contact.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }),
      
      // This week's contacts
      thisWeek: await Contact.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(new Date().getDate() - 7))
        }
      }),
      
      // This month's contacts
      thisMonth: await Contact.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(1))
        }
      })
    };

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error getting contact statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve statistics',
      error: error.message
    });
  }
};

// Bulk delete contacts
exports.bulkDeleteContacts = async (req, res) => {
  try {
    const { contactIds } = req.body;

    if (!contactIds || !Array.isArray(contactIds) || contactIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Contact IDs array is required'
      });
    }

    const result = await Contact.deleteMany({
      _id: { $in: contactIds }
    });

    console.log(`✅ Bulk deleted ${result.deletedCount} contacts`);

    res.status(200).json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} contacts`,
      deletedCount: result.deletedCount
    });

  } catch (error) {
    console.error('❌ Error bulk deleting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contacts',
      error: error.message
    });
  }
};

module.exports = exports;