const Order = require('../models/Order');
exports.createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body, status: 'pending', createdAt: new Date() };
    let order;
    if (Order) {
      order = new Order(orderData);
      await order.save();
    }
    console.log('New WhatsApp order:', orderData);
    res.status(201).json({ success: true, message: 'Order created', order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};
exports.getAllOrders = async (req, res) => {
  try {
    const orders = Order ? await Order.find().sort({ createdAt: -1 }) : [];
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};
exports.getOrderById = async (req, res) => {
  try {
    const order = Order ? await Order.findById(req.params.id) : null;
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve order' });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = Order ? await Order.findByIdAndUpdate(req.params.id, { status }, { new: true }) : null;
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update order' });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete order' });
  }
};
exports.getOrdersByStatus = async (req, res) => {
  try {
    const orders = Order ? await Order.find({ status: req.params.status }) : [];
    res.status(200).json({ success: true, count: orders.length, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to retrieve orders' });
  }
};