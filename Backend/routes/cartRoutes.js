const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  removeFromCart,
  clearCart
} = require('../controllers/cartController');

// @route GET /api/cart
router.get('/', protect, getCart);

// @route POST /api/cart
router.post('/', protect, addToCart);

// @route DELETE /api/cart/item
router.delete('/item', protect, removeFromCart);

// @route DELETE /api/cart
router.delete('/', protect, clearCart);

module.exports = router;
