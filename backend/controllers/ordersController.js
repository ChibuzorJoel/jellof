const Order = require('../models/Order');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    console.log('📦 Creating order with data:', req.body);

    // Validate required fields
    if (!req.body.customer) {
      return res.status(400).json({
        success: false,
        message: 'Customer information is required'
      });
    }

    if (!req.body.items || req.body.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item'
      });
    }

    if (!req.body.total || req.body.total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order total'
      });
    }

    // Create order data
    const orderData = {
      userId: req.body.userId || null,
      customer: req.body.customer,
      items: req.body.items,
      subtotal: req.body.subtotal || 0,
      shipping: req.body.shipping || 0,
      tax: req.body.tax || 0,
      total: req.body.total,
      status: req.body.status || 'pending',
      paymentMethod: req.body.paymentMethod || 'whatsapp',
      paymentStatus: 'pending',
      paymentDetails: req.body.paymentDetails || {},
      shippingMethod: req.body.shippingMethod || 'standard',
      notes: req.body.notes || ''
    };

    // Create order
    const order = new Order(orderData);
    await order.save();

    console.log('✅ Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: order
    });

  } catch (error) {
    console.error('❌ Error creating order:', error);

    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create order. Please try again.'
    });
  }
};

// Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const { status, userId, limit = 50 } = req.query;

    let query = {};

    if (status) query.status = status;
    if (userId) query.userId = userId;

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .populate('userId', 'firstName lastName email');

    console.log(`📦 Retrieved ${orders.length} orders`);

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('❌ Error getting orders:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error('❌ Error getting order:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order'
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        status,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`✅ Order ${order._id} status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      order
    });

  } catch (error) {
    console.error('❌ Error updating order:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update order status'
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        paymentStatus,
        updatedAt: new Date()
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`✅ Order ${order._id} payment status updated to: ${paymentStatus}`);

    res.status(200).json({
      success: true,
      message: 'Payment status updated',
      order
    });

  } catch (error) {
    console.error('❌ Error updating payment status:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    console.log(`✅ Order ${order._id} deleted`);

    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting order:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to delete order'
    });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  try {
    const { status } = req.params;

    const orders = await Order.find({ status })
      .sort({ createdAt: -1 })
      .populate('userId', 'firstName lastName email');

    res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error('❌ Error getting orders by status:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve orders'
    });
  }
};

// Get order statistics
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const processingOrders = await Order.countDocuments({ status: 'processing' });
    const shippedOrders = await Order.countDocuments({ status: 'shipped' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });

    const totalRevenue = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        processingOrders,
        shippedOrders,
        deliveredOrders,
        totalRevenue: totalRevenue[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('❌ Error getting order stats:', error);

    res.status(500).json({
      success: false,
      message: 'Failed to retrieve order statistics'
    });
  }
};

module.exports = exports;