const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// Public routes (accessible to anyone)
router.post('/', contactController.submitContactForm);

// Admin routes (should be protected with auth middleware in production)
router.get('/', contactController.getAllContacts);
router.get('/stats', contactController.getContactStats);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContactStatus);
router.post('/:id/reply', contactController.sendReply);
router.delete('/:id', contactController.deleteContact);
router.post('/bulk-delete', contactController.bulkDeleteContacts);

module.exports = router;