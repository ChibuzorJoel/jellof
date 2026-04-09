const Payment = require('../models/Payment');
const Order = require('../models/Order');

// Get all payments
exports.getAllPayments = async (req, res) => {
  try {
    const { status, method, limit = 100 } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (method && method !== 'all') {
      query.paymentMethod = method;
    }

    const payments = await Payment.find(query)
      .populate('orderId', 'orderId items customer')
      .sort({ date: -1 })
      .limit(parseInt(limit));

    console.log(`💳 Retrieved ${payments.length} payments`);

    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });

  } catch (error) {
    console.error('❌ Error getting payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments'
    });
  }
};

// Get payment by ID
exports.getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findById(id)
      .populate('orderId');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.status(200).json({
      success: true,
      payment
    });

  } catch (error) {
    console.error('❌ Error getting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment'
    });
  }
};

// Create payment (usually auto-created with order)
exports.createPayment = async (req, res) => {
  try {
    const paymentData = {
      orderId: req.body.orderId,
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      amount: req.body.amount,
      paymentMethod: req.body.paymentMethod,
      status: req.body.status || 'pending',
      paymentDetails: req.body.paymentDetails || {}
    };

    const payment = new Payment(paymentData);
    await payment.save();

    console.log('✅ Payment created:', payment.transactionId);

    res.status(201).json({
      success: true,
      message: 'Payment record created successfully',
      payment
    });

  } catch (error) {
    console.error('❌ Error creating payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment record'
    });
  }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const updateData = { status };

    // Add timestamp based on status
    if (status === 'approved') {
      updateData.approvedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
    }

    const payment = await Payment.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // Update corresponding order payment status
    if (payment.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, {
        paymentStatus: status === 'completed' ? 'paid' : status
      });
    }

    console.log(`✅ Payment ${payment.transactionId} status updated to: ${status}`);

    res.status(200).json({
      success: true,
      message: 'Payment status updated successfully',
      payment
    });

  } catch (error) {
    console.error('❌ Error updating payment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update payment status'
    });
  }
};

// Delete payment
exports.deletePayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findByIdAndDelete(id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    console.log(`✅ Payment ${payment.transactionId} deleted`);

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete payment'
    });
  }
};

// Get payment statistics
exports.getPaymentStats = async (req, res) => {
  try {
    const stats = {
      total: await Payment.countDocuments(),
      pending: await Payment.countDocuments({ status: 'pending' }),
      approved: await Payment.countDocuments({ status: 'approved' }),
      completed: await Payment.countDocuments({ status: 'completed' }),
      rejected: await Payment.countDocuments({ status: 'rejected' }),
      totalRevenue: await Payment.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ])
    };

    stats.totalRevenue = stats.totalRevenue[0]?.total || 0;

    res.status(200).json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('❌ Error getting payment statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve payment statistics'
    });
  }
};

module.exports = exports;