const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// POST - Submit contact form
router.post('/', contactController.submitContactForm);

// GET - Get all contacts (admin)
router.get('/', contactController.getAllContacts);

// GET - Get contact by ID
router.get('/:id', contactController.getContactById);

// DELETE - Delete contact
router.delete('/:id', contactController.deleteContact);

module.exports = router;
