const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// POST - Subscribe to newsletter
router.post('/subscribe', newsletterController.subscribe);

// POST - Unsubscribe from newsletter
router.post('/unsubscribe', newsletterController.unsubscribe);

// GET - Get all subscribers (admin)
router.get('/subscribers', newsletterController.getAllSubscribers);

// DELETE - Delete subscriber
router.delete('/subscribers/:id', newsletterController.deleteSubscriber);

module.exports = router;