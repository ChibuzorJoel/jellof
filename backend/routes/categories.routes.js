const express = require('express');
const router = express.Router();
const categoriesController = require('../controllers/categoriesController');

// Get all categories
router.get('/', categoriesController.getAllCategories);

// Get category by ID
router.get('/:id', categoriesController.getCategoryById);

// Get category by slug
router.get('/slug/:slug', categoriesController.getCategoryBySlug);

// Create category
router.post('/', categoriesController.createCategory);

// Update category
router.put('/:id', categoriesController.updateCategory);

// Delete category
router.delete('/:id', categoriesController.deleteCategory);

// Update product count for a category
router.put('/:id/update-count', categoriesController.updateProductCount);

// Update all categories product counts
router.put('/update-all-counts', categoriesController.updateAllProductCounts);

module.exports = router;