const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key-change-in-production',
    { expiresIn: '30d' }
  );
};

// @desc    Admin Login
// @route   POST /api/admin/login
// @access  Public
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // ✅ ONLY ADMIN USERS
    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: 'admin',
      isActive: true
    }).select('+password');

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // ✅ Correct bcrypt comparison
    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = generateToken(admin._id);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      admin: {
        id: admin._id,
        email: admin.email,
        role: admin.role
      },
      token
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};