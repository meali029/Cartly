const express = require('express');
const router = express.Router();
const {
  getUserChat,
  sendMessage,
  getAllChats,
  getChatById,
  updateChatStatus,
  deleteChat,
  getChatStats
} = require('../controllers/chatController');

const { protect, admin } = require('../middleware/authMiddleware');

// User routes
router.get('/my-chat', protect, getUserChat);
router.post('/message', protect, sendMessage);

// Admin routes
router.get('/admin/all', protect, admin, getAllChats);
router.get('/admin/stats', protect, admin, getChatStats);
router.get('/admin/:id', protect, admin, getChatById);
router.put('/admin/:id', protect, admin, updateChatStatus);
router.delete('/admin/:id', protect, admin, deleteChat);

module.exports = router;
