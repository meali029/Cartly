const express = require('express')
const router = express.Router()
const { subscribeToNewsletter, unsubscribeFromNewsletter } = require('../controllers/newsletterController')

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post('/subscribe', subscribeToNewsletter)

// @route   POST /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.post('/unsubscribe', unsubscribeFromNewsletter)

module.exports = router
