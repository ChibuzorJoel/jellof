const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Note: In production, add authentication middleware to protect these routes
// const { protect, adminOnly } = require('../middleware/auth');

/* =========================
   CUSTOMER ROUTES
========================= */

// Get all customers
// GET /api/customers
router.get('/', customerController.getAllCustomers);

// Get customer statistics
// GET /api/customers/stats
router.get('/stats', customerController.getCustomerStats);

// Get customer by ID
// GET /api/customers/:id
router.get('/:id', customerController.getCustomerById);

// Update customer status (block/unblock)
// PUT /api/customers/:id
// Body: { status: 'active' | 'blocked' }
router.put('/:id', customerController.updateCustomerStatus);

// Delete customer
// DELETE /api/customers/:id
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;