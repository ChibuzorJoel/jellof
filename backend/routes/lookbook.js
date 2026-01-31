const express = require('express');
const router = express.Router();
const lookbookController = require('../controllers/lookbookController');

// GET - Get all lookbook items
router.get('/', lookbookController.getAllLookbookItems);

// GET - Get lookbook item by ID
router.get('/:id', lookbookController.getLookbookItemById);

// POST - Create lookbook item (admin)
router.post('/', lookbookController.createLookbookItem);

// PUT - Update lookbook item (admin)
router.put('/:id', lookbookController.updateLookbookItem);

// DELETE - Delete lookbook item (admin)
router.delete('/:id', lookbookController.deleteLookbookItem);

module.exports = router;