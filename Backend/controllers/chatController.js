const Chat = require('../models/chatModel');
const User = require('../models/userModel');

// @desc Get user's chat or create new one
const getUserChat = async (req, res) => {
  try {
    const userId = req.user._id;
    
    let chat = await Chat.findOne({ userId })
      .populate('userId', 'name email');
    
    // Only populate assignedAdmin if it's a valid ObjectId
    if (chat?.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
      await chat.populate('assignedAdmin', 'name email');
    }
      
    if (!chat) {
      // Create new chat for user
   
      chat = await Chat.create({
        userId,
        subject: 'Support Chat',
        messages: [],
        unreadCount: { user: 0, admin: 0 }
      });
      
      chat = await Chat.findById(chat._id)
        .populate('userId', 'name email');
        
      // Only populate assignedAdmin if it's a valid ObjectId
      if (chat?.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
        await chat.populate('assignedAdmin', 'name email');
      }
        
    }
    
    // Mark admin messages as read
    let hasUnreadMessages = false;
    chat.messages.forEach(message => {
      if (message.sender === 'admin' && !message.isRead) {
        message.isRead = true;
        hasUnreadMessages = true;
      }
    });
    
    if (hasUnreadMessages) {
      chat.unreadCount.user = 0;
      await chat.save();
    }
    
    
    res.json(chat);
  } catch (err) {
    
    res.status(500).json({ message: 'Failed to fetch chat', error: err.message });
  }
};

// @desc Send message in chat
const sendMessage = async (req, res) => {
  try {
    const { message, attachments = [] } = req.body;
    const userId = req.user._id;
    const isAdmin = req.user.isAdmin;
    
   
    
    if (!message || message.trim() === '') {
      return res.status(400).json({ message: 'Message content is required' });
    }
    
    // Find or create chat
    let chat = await Chat.findOne({ userId: isAdmin ? req.body.userId : userId });
    
  
    
    if (!chat) {
      if (isAdmin && req.body.userId) {
        // Admin creating chat for specific user
        
        chat = await Chat.create({
          userId: req.body.userId,
          subject: 'Admin Support Chat',
          messages: [],
          unreadCount: { user: 0, admin: 0 }
        });
      } else {
        // User creating their first chat
        
        chat = await Chat.create({
          userId,
          subject: 'Support Chat',
          messages: [],
          unreadCount: { user: 0, admin: 0 }
        });
      }
     
    }
    
    // Create new message
    const newMessage = {
      messageId: new Date().getTime().toString(),
      sender: isAdmin ? 'admin' : 'user',
      senderName: req.user.name,
      message: message.trim(),
      timestamp: new Date(),
      isRead: false,
      attachments
    };
    
    // Add message to chat
    chat.messages.push(newMessage);
    
    // Update unread counts
    if (isAdmin) {
      chat.unreadCount.user += 1;
      // Only set assignedAdmin if it's a real ObjectId, not the fake admin ID
      if (!chat.assignedAdmin && req.user._id !== 'admin_fake_id_123') {
        chat.assignedAdmin = req.user._id;
      }
    } else {
      chat.unreadCount.admin += 1;
    }
    
    // Update status
    if (chat.status === 'closed') {
      chat.status = 'active';
    }
    
    
    await chat.save();
    
    // Populate for response
    await chat.populate('userId', 'name email');
    // Only populate assignedAdmin if it's a valid ObjectId
    if (chat.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
      await chat.populate('assignedAdmin', 'name email');
    }
    
   
    // Emit real-time update to specific rooms
    const io = req.app.get('io');
    if (io) {
      const userRoomId = `user_${chat.userId._id}`;
      const adminRoom = 'admin_room';
      
      const messageData = {
        chatId: chat._id,
        message: newMessage,
        userId: chat.userId._id,
        unreadCount: chat.unreadCount
      };
      
      // Send to user's room
      io.to(userRoomId).emit('chat:message', messageData);
      // Send to admin room for real-time admin updates
      io.to(adminRoom).emit('chat:message', messageData);
      
      
    }
    
    res.status(201).json({
      message: 'Message sent successfully',
      chat,
      newMessage
    });
  } catch (err) {
   
    res.status(500).json({ message: 'Failed to send message', error: err.message });
  }
};

// @desc Get all chats (Admin only)
const getAllChats = async (req, res) => {
  try {
    const { status = 'all', page = 1, limit = 20 } = req.query;
    
    const filter = {};
    if (status !== 'all') {
      filter.status = status;
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const chats = await Chat.find(filter)
      .populate('userId', 'name email')
      .sort({ lastActivity: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Manually populate assignedAdmin for valid ObjectIds only
    for (let chat of chats) {
      if (chat.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
        await chat.populate('assignedAdmin', 'name email');
      }
    }
    
    const totalChats = await Chat.countDocuments(filter);
    const totalPages = Math.ceil(totalChats / parseInt(limit));
    
    // Get summary stats
    const stats = await Chat.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalUnreadAdmin: { $sum: '$unreadCount.admin' }
        }
      }
    ]);
    
    res.json({
      chats,
      currentPage: parseInt(page),
      totalPages,
      totalChats,
      stats
    });
  } catch (err) {
   res.status(500).json({ message: 'Failed to fetch chats', error: err.message });
  }
};

// @desc Get specific chat (Admin only)
const getChatById = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id)
      .populate('userId', 'name email');
    
    // Only populate assignedAdmin if it's a valid ObjectId
    if (chat?.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
      await chat.populate('assignedAdmin', 'name email');
    }
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Mark user messages as read
    let hasUnreadMessages = false;
    chat.messages.forEach(message => {
      if (message.sender === 'user' && !message.isRead) {
        message.isRead = true;
        hasUnreadMessages = true;
      }
    });
    
    if (hasUnreadMessages) {
      chat.unreadCount.admin = 0;
      await chat.save();
    }
    
    res.json(chat);
  } catch (err) {
   
    res.status(500).json({ message: 'Failed to fetch chat', error: err.message });
  }
};

// @desc Update chat status (Admin only)
const updateChatStatus = async (req, res) => {
  try {
    const { status, assignedAdmin, priority } = req.body;
    
    const updateData = {};
    if (status) updateData.status = status;
    if (assignedAdmin) updateData.assignedAdmin = assignedAdmin;
    if (priority) updateData.priority = priority;
    
    const chat = await Chat.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).populate('userId', 'name email');
    
    // Only populate assignedAdmin if it's a valid ObjectId
    if (chat?.assignedAdmin && chat.assignedAdmin !== 'admin_fake_id_123') {
      await chat.populate('assignedAdmin', 'name email');
    }
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Emit real-time update to specific rooms
    const io = req.app.get('io');
    if (io) {
      const userRoomId = `user_${chat.userId._id}`;
      const adminRoom = 'admin_room';
      
      const updateData = {
        chatId: chat._id,
        userId: chat.userId._id,
        status: chat.status,
        assignedAdmin: chat.assignedAdmin
      };
      
      // Send to user's room
      io.to(userRoomId).emit('chat:update', updateData);
      // Send to admin room
      io.to(adminRoom).emit('chat:update', updateData);
    }
    
    res.json({ message: 'Chat updated successfully', chat });
  } catch (err) {
   
    res.status(500).json({ message: 'Failed to update chat', error: err.message });
  }
};

// @desc Delete chat (Admin only)
const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findByIdAndDelete(req.params.id);
    
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }
    
    // Emit real-time update to specific rooms
    const io = req.app.get('io');
    if (io) {
      const userRoomId = `user_${chat.userId}`;
      const adminRoom = 'admin_room';
      
      const deleteData = {
        chatId: req.params.id,
        userId: chat.userId
      };
      
      // Send to user's room
      io.to(userRoomId).emit('chat:delete', deleteData);
      // Send to admin room
      io.to(adminRoom).emit('chat:delete', deleteData);
    }
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (err) {
   
    res.status(500).json({ message: 'Failed to delete chat', error: err.message });
  }
};

// @desc Get chat statistics (Admin only)
const getChatStats = async (req, res) => {
  try {
    const totalChats = await Chat.countDocuments();
    const activeChats = await Chat.countDocuments({ status: 'active' });
    const closedChats = await Chat.countDocuments({ status: 'closed' });
    const pendingChats = await Chat.countDocuments({ status: 'pending' });
    
    // Get total unread messages for admin
    const unreadStats = await Chat.aggregate([
      {
        $group: {
          _id: null,
          totalUnreadAdmin: { $sum: '$unreadCount.admin' },
          totalUnreadUser: { $sum: '$unreadCount.user' }
        }
      }
    ]);
    
    // Get recent activity
    const recentChats = await Chat.find({ status: { $ne: 'closed' } })
      .populate('userId', 'name email')
      .sort({ lastActivity: -1 })
      .limit(5);
    
    res.json({
      totalChats,
      activeChats,
      closedChats,
      pendingChats,
      unreadCount: unreadStats[0] || { totalUnreadAdmin: 0, totalUnreadUser: 0 },
      recentChats
    });
  } catch (err) {
    
    res.status(500).json({ message: 'Failed to fetch chat statistics', error: err.message });
  }
};

module.exports = {
  getUserChat,
  sendMessage,
  getAllChats,
  getChatById,
  updateChatStatus,
  deleteChat,
  getChatStats
};
