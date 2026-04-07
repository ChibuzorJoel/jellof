const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// Create new order
router.post('/', ordersController.createOrder);

// Get all orders
router.get('/', ordersController.getAllOrders);

// Get order statistics
router.get('/stats', ordersController.getOrderStats);

// Get orders by status
router.get('/status/:status', ordersController.getOrdersByStatus);

// Get order by ID
router.get('/:id', ordersController.getOrderById);

// Update order status
router.put('/:id/status', ordersController.updateOrderStatus);

// Update payment status
router.put('/:id/payment', ordersController.updatePaymentStatus);

// Delete order
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;