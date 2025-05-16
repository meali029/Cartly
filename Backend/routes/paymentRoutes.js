const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/payment/create-checkout-session
// @desc    Create a Stripe session
// @access  Private
router.post('/create-checkout-session', protect, createCheckoutSession);

module.exports = router;
