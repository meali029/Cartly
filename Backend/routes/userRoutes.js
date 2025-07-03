const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers,
  updateUserRole,
  getAdminStats
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Admin-only routes
router.get('/', protect, admin, getAllUsers);
router.put('/admin/users/:id', protect, admin, updateUserRole);
router.get('/admin/stats', protect, admin, getAdminStats);

module.exports = router;
