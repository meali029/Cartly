const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  getAdminStats,
  forgotPassword,
  verifyOTP,
  resetPassword,
  verifyEmailOTP,
  resendEmailVerification
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Email verification route
router.post('/verify-email', verifyEmailOTP);
router.post('/resend-verification', resendEmailVerification);

// Forgot password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);

// Admin-only routes
router.get('/', protect, admin, getAllUsers);
router.put('/admin/users/:id', protect, admin, updateUserRole);
router.get('/admin/stats', protect, admin, getAdminStats);

module.exports = router;
