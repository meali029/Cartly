const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 🔐 Middleware: Protect routes by verifying JWT
const protect = async (req, res, next) => {
  let token;
  
  console.log('🔐 Auth middleware - Headers:', req.headers.authorization);
  
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      console.log('🔑 Token received:', token ? 'Present' : 'Missing');
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log('✅ Token decoded:', { id: decoded.id });

      // Allow hardcoded admin
      if (decoded.id === 'admin_fake_id_123') {
        req.user = { 
          _id: 'admin_fake_id_123', 
          isAdmin: true,
          email: 'a@c.com',
          name: 'Admin'
        };
        console.log('👑 Admin user authenticated');
        return next();
      }

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        console.error('❌ User not found in database:', decoded.id);
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }
      console.log('✅ User authenticated:', { id: req.user._id, email: req.user.email });
      next();
    } catch (error) {
      console.error('❌ Auth middleware error:', error.message);
      return res.status(401).json({ message: 'Not authorized, token failed', error: error.message });
    }
  } else {
    console.error('❌ No authorization header found');
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 👑 Middleware: Allow only admins
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }
};

module.exports = { protect, admin };
