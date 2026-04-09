const express = require('express');
const router = express.Router();
const newsletterController = require('../controllers/newsletterController');

// Public routes
router.post('/subscribe', newsletterController.subscribe);
router.get('/unsubscribe/:email', newsletterController.unsubscribe);

// Admin routes (add authentication middleware in production)
router.get('/', newsletterController.getAllSubscribers);
router.get('/stats', newsletterController.getStatistics);
router.get('/export', newsletterController.exportSubscribers);
router.get('/:email', newsletterController.getSubscriberByEmail);
router.put('/:email/preferences', newsletterController.updatePreferences);
router.delete('/:id', newsletterController.deleteSubscriber);

module.exports = router;