const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  getAllUsers
} = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', protect, admin, getAllUsers); // Only admin should access this

module.exports = router;
