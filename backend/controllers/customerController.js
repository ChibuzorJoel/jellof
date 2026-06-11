const User = require('../models/User');
const Order = require('../models/Order'); // If you have Order model
const mongoose = require('mongoose');

/* =========================
   GET ALL CUSTOMERS
========================= */
exports.getAllCustomers = async (req, res) => {
  try {
    // Get all users with role 'customer'
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Transform users to customer format with order statistics
    const customers = await Promise.all(
      users.map(async (user) => {
        // Get order statistics for this user
        let numberOfOrders = 0;
        let totalSpent = 0;
        let lastOrderDate = null;

        try {
          // Try to get order stats (if Order model exists)
          if (mongoose.models.Order) {
            const orders = await Order.find({ 
              user: user._id,
              status: { $ne: 'cancelled' }
            });

            numberOfOrders = orders.length;
            totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
            
            if (orders.length > 0) {
              const sortedOrders = orders.sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
              );
              lastOrderDate = sortedOrders[0].createdAt;
            }
          }
        } catch (orderError) {
          console.log('No orders found or Order model not available');
        }

        // Get primary address
        const primaryAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
        const addressString = primaryAddress 
          ? `${primaryAddress.address}, ${primaryAddress.city}, ${primaryAddress.state || ''} ${primaryAddress.zipCode || ''}`
          : 'No address provided';

        return {
          _id: user._id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          phone: user.phone || 'N/A',
          numberOfOrders: numberOfOrders,
          totalSpent: totalSpent,
          status: user.isActive ? 'active' : 'blocked',
          joinDate: user.createdAt,
          lastOrderDate: lastOrderDate,
          address: addressString,
          firstName: user.firstName,
          lastName: user.lastName,
          addresses: user.addresses
        };
      })
    );

    res.status(200).json({
      success: true,
      count: customers.length,
      customers: customers
    });

  } catch (error) {
    console.error('Error getting customers:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers',
      error: error.message
    });
  }
};

/* =========================
   GET CUSTOMER BY ID
========================= */
exports.getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    const user = await User.findById(id).select('-password');

    if (!user || user.role !== 'customer') {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Get order statistics
    let numberOfOrders = 0;
    let totalSpent = 0;
    let lastOrderDate = null;

    try {
      if (mongoose.models.Order) {
        const orders = await Order.find({ 
          user: user._id,
          status: { $ne: 'cancelled' }
        });

        numberOfOrders = orders.length;
        totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
        
        if (orders.length > 0) {
          const sortedOrders = orders.sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
          );
          lastOrderDate = sortedOrders[0].createdAt;
        }
      }
    } catch (orderError) {
      console.log('No orders found');
    }

    const primaryAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
    const addressString = primaryAddress 
      ? `${primaryAddress.address}, ${primaryAddress.city}, ${primaryAddress.state || ''} ${primaryAddress.zipCode || ''}`
      : 'No address provided';

    const customer = {
      _id: user._id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      phone: user.phone || 'N/A',
      numberOfOrders: numberOfOrders,
      totalSpent: totalSpent,
      status: user.isActive ? 'active' : 'blocked',
      joinDate: user.createdAt,
      lastOrderDate: lastOrderDate,
      address: addressString,
      firstName: user.firstName,
      lastName: user.lastName,
      addresses: user.addresses
    };

    res.status(200).json({
      success: true,
      customer: customer
    });

  } catch (error) {
    console.error('Error getting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer',
      error: error.message
    });
  }
};

/* =========================
   UPDATE CUSTOMER STATUS
========================= */
exports.updateCustomerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    // Validate status
    if (!['active', 'blocked'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status. Must be "active" or "blocked"'
      });
    }

    // Update user isActive based on status
    const isActive = status === 'active';

    const user = await User.findOneAndUpdate(
      { _id: id, role: 'customer' },
      { isActive: isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `Customer ${status === 'active' ? 'activated' : 'blocked'} successfully`,
      customer: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.isActive ? 'active' : 'blocked'
      }
    });

  } catch (error) {
    console.error('Error updating customer status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update customer status',
      error: error.message
    });
  }
};

/* =========================
   DELETE CUSTOMER
========================= */
exports.deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid customer ID'
      });
    }

    const user = await User.findOneAndDelete({ 
      _id: id, 
      role: 'customer' 
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Optionally: Also delete user's orders
    try {
      if (mongoose.models.Order) {
        await Order.deleteMany({ user: id });
      }
    } catch (orderError) {
      console.log('No orders to delete');
    }

    res.status(200).json({
      success: true,
      message: 'Customer deleted successfully',
      customer: {
        _id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Error deleting customer:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer',
      error: error.message
    });
  }
};

/* =========================
   GET CUSTOMER STATISTICS
========================= */
exports.getCustomerStats = async (req, res) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', isActive: true });
    const blockedCustomers = await User.countDocuments({ role: 'customer', isActive: false });

    // Get customers registered this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const newThisMonth = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: startOfMonth }
    });

    res.status(200).json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        blockedCustomers,
        newThisMonth
      }
    });

  } catch (error) {
    console.error('Error getting customer stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer statistics',
      error: error.message
    });
  }
};