const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

// Submit contact form
exports.submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

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

    // Save to database (if MongoDB is connected)
    let contactId = null;
    if (Contact) {
      const contact = new Contact({
        name,
        email,
        phone,
        subject,
        message,
        status: 'new',
        createdAt: new Date()
      });
      const saved = await contact.save();
      contactId = saved._id;
    }

    // Send emails
    await emailService.sendContactNotification({ name, email, phone, subject, message });
    await emailService.sendContactAutoReply({ name, email });

    // Log to console (fallback if no database)
    console.log('Contact form submission:', {
      id: contactId,
      name,
      email,
      phone,
      subject,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({
      success: true,
      message: 'Message sent successfully! We\'ll get back to you soon.',
      contactId
    });

  } catch (error) {
    console.error('Error submitting contact form:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message. Please try again later.'
    });
  }
};

// Get all contacts (admin)
exports.getAllContacts = async (req, res) => {
  try {
    if (!Contact) {
      return res.status(200).json({
        success: true,
        message: 'Database not configured. Check server logs.',
        contacts: []
      });
    }

    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error getting contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contacts'
    });
  }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    if (!Contact) {
      return res.status(404).json({
        success: false,
        message: 'Database not configured'
      });
    }

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
    console.error('Error getting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve contact'
    });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    if (!Contact) {
      return res.status(404).json({
        success: false,
        message: 'Database not configured'
      });
    }

    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Contact deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact'
    });
  }
};