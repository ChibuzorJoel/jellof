const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController');

// POST - Create new order (from WhatsApp)
router.post('/', ordersController.createOrder);

// GET - Get all orders
router.get('/', ordersController.getAllOrders);

// GET - Get orders by status
router.get('/status/:status', ordersController.getOrdersByStatus);

// GET - Get order by ID
router.get('/:id', ordersController.getOrderById);

// PUT - Update order status
router.put('/:id/status', ordersController.updateOrderStatus);

// DELETE - Delete order
router.delete('/:id', ordersController.deleteOrder);

module.exports = router;