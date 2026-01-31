const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// GET - Get all products (with filters)
router.get('/', productsController.getAllProducts);

// GET - Search products
router.get('/search', productsController.searchProducts);

// GET - Get products by category
router.get('/category/:category', productsController.getProductsByCategory);

// GET - Get product by ID
router.get('/:id', productsController.getProductById);

// POST - Create new product (admin)
router.post('/', productsController.createProduct);

// PUT - Update product (admin)
router.put('/:id', productsController.updateProduct);

// DELETE - Delete product (admin)
router.delete('/:id', productsController.deleteProduct);

module.exports = router;