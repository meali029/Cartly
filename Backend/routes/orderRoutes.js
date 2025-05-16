const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus
} = require('../controllers/orderController');

const { protect, admin } = require('../middleware/authMiddleware');

// Public (user) routes
router.post('/', protect, placeOrder);
router.get('/user/:userId', protect, getUserOrders);

// Admin routes
router.get('/', protect, admin, getAllOrders);
router.put('/:id', protect, admin, updateOrderStatus);

module.exports = router;
