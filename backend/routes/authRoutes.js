const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes
router.get('/profile', protect, authController.getProfile);
router.put('/profile', protect, authController.updateProfile);

// Address management
router.post('/addresses', protect, authController.addAddress);
router.put('/addresses/:addressId', protect, authController.updateAddress);
router.delete('/addresses/:addressId', protect, authController.deleteAddress);

// Password management
router.post('/change-password', protect, authController.changePassword);

module.exports = router;