const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');
// const { protect, authorize } = require('../middleware/auth'); // Uncomment if using auth

// Public routes
router.get('/', categoriesController.getAllCategories);
router.get('/slug/:slug', categoriesController.getCategoryBySlug);
router.get('/:id', categoriesController.getCategoryById);

// Admin routes (add auth middleware when ready)
router.post('/', categoriesController.createCategory); // Add: protect, authorize('admin')
router.put('/:id', categoriesController.updateCategory); // Add: protect, authorize('admin')
router.delete('/:id', categoriesController.deleteCategory); // Add: protect, authorize('admin')

// Utility routes
router.put('/:id/update-count', categoriesController.updateProductCount);
router.post('/update-all-counts', categoriesController.updateAllProductCounts);

module.exports = router;