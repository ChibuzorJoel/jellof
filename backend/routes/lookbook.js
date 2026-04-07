const express = require('express');
const router = express.Router();
const lookbookController = require('../controllers/lookbookController');

// Get all lookbook items
router.get('/', lookbookController.getAllLookbookItems);

// Get lookbook item by ID
router.get('/:id', lookbookController.getLookbookItemById);

// Create lookbook item (admin only)
router.post('/', lookbookController.createLookbookItem);

// Update lookbook item (admin only)
router.put('/:id', lookbookController.updateLookbookItem);

// Toggle featured status (admin only)
router.patch('/:id/featured', lookbookController.toggleFeatured);

// Delete lookbook item (admin only)
router.delete('/:id', lookbookController.deleteLookbookItem);

module.exports = router;