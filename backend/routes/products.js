
const express = require('express');
const router = express.Router();
const productsController = require('../controllers/productsController');

// ================= PUBLIC ROUTES =================

// Get all products (with pagination support)
// Query params: page, limit, category, search, sort, minPrice, maxPrice, inStock
// Example: /api/products?page=1&limit=12&category=Dresses&sort=price-low
router.get('/', productsController.getAllProducts);

// Get recommended products (You May Also Like)
// Query params: productId, category, limit
// Example: /api/products/recommended?category=Dresses&limit=8
router.get('/recommended', productsController.getRecommendedProducts);

// Search products
// Query params: q (search query)
// Example: /api/products/search?q=summer
router.get('/search', productsController.searchProducts);

// Get products by category (with pagination)
// Query params: page, limit
// Example: /api/products/category/Dresses?page=1&limit=12
router.get('/category/:category', productsController.getProductsByCategory);

// Get product by ID
// Example: /api/products/507f1f77bcf86cd799439011
router.get('/:id', productsController.getProductById);

// ================= ADMIN ROUTES =================
// Note: In production, add authentication middleware

// Create product (admin only)
router.post('/', productsController.createProduct);

// Update product (admin only)
router.put('/:id', productsController.updateProduct);

// Update stock (admin only)
router.put('/:id/stock', productsController.updateStock);

// Delete product (admin only)
router.delete('/:id', productsController.deleteProduct);

module.exports = router;