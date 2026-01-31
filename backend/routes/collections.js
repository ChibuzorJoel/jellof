const express = require('express');
const router = express.Router();
const collectionsController = require('../controllers/collectionsController');

// GET - Get all collections
router.get('/', collectionsController.getAllCollections);

// GET - Get collection by ID
router.get('/:id', collectionsController.getCollectionById);

// POST - Create collection (admin)
router.post('/', collectionsController.createCollection);

// PUT - Update collection (admin)
router.put('/:id', collectionsController.updateCollection);

// DELETE - Delete collection (admin)
router.delete('/:id', collectionsController.deleteCollection);

module.exports = router;