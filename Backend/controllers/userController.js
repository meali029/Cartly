const User = require('../models/userModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendPasswordResetEmail, sendEmailVerificationOTP } = require('../utils/emailSender');

// Store OTP codes temporarily (in production, use Redis or database)
const otpStore = new Map();

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @desc Register a new user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP for email verification
    const otpCode = generateOTP();
    
    // Store OTP with expiry (10 minutes)
    otpStore.set(email, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      userData: { name, email, password: hashedPassword }
    });

    // Try to send verification email
    try {
      await sendEmailVerificationOTP(email, otpCode, name);
      res.status(201).json({
        message: 'Registration initiated. Please check your email for verification code.',
        email: email,
        requiresVerification: true
      });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Check if this is an authentication error
      if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
        console.error('❌ Gmail authentication failed!');
        otpStore.delete(email); // Clean up the stored OTP
        res.status(500).json({ 
          message: 'Email service authentication failed. Please contact support.',
          error: 'Invalid email credentials'
        });
      } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured');
        // In development, create user without verification
        const user = await User.create({
          name,
          email,
          password: hashedPassword,
          isEmailVerified: false
        });
        
        console.log(`🔐 Development mode: OTP for ${email} is: ${otpCode}`);
        res.status(201).json({
          message: 'User created in development mode. Email verification skipped.',
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          isEmailVerified: user.isEmailVerified,
          token: generateToken(user._id),
          development: true,
          otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        });
      } else {
        console.error('Email sending failed:', emailError.message);
        otpStore.delete(email); // Clean up the stored OTP
        res.status(500).json({ 
          message: 'Failed to send verification email. Please try again.',
          error: emailError.message
        });
      }
    }
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ message: 'Server error while registering user' });
  }
};

// @desc Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // ✅ Hardcoded admin login
  if (email === 'a@c.com' && password === '123456') {
    return res.json({
      _id: 'admin_fake_id_123',
      name: 'Admin',
      email: 'a@c.com',
      isAdmin: true,
      token: generateToken('admin_fake_id_123')
    });
  }

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid email or password' });

  // Check if email is verified (skip for development mode)
  if (!user.isEmailVerified && process.env.NODE_ENV !== 'development') {
    return res.status(401).json({ 
      message: 'Please verify your email before logging in',
      requiresEmailVerification: true,
      email: user.email
    });
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    isAdmin: user.isAdmin,
    isEmailVerified: user.isEmailVerified,
    token: generateToken(user._id)
  });
};

// @desc Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// @desc Update user role (admin only)
const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isAdmin = req.body.isAdmin;
    await user.save();

    res.json({ message: 'User role updated' });
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ message: 'Error updating user role' });
  }
};

// @desc Get admin dashboard stats
const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalSales = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);
    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales: totalSales[0]?.total || 0
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Error fetching admin stats' });
  }
};

// @desc Send password reset OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found with this email' });
    }

    // Generate OTP
    const otpCode = generateOTP();
    
    // Store OTP with expiry (10 minutes)
    otpStore.set(email, {
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Try to send OTP via email
    try {
      await sendPasswordResetEmail(email, otpCode);
      res.json({ message: 'OTP sent to your email successfully' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      
      // Check if this is an authentication error (invalid credentials)
      if (emailError.code === 'EAUTH' || emailError.responseCode === 535) {
        console.error('❌ Gmail authentication failed!');
        console.error('📧 Email:', email);
        console.error('🔑 Please follow these steps to fix:');
        console.error('1. Enable 2-Factor Authentication on Gmail');
        console.error('2. Generate App Password from Google Account Settings');
        console.error('3. Use App Password (16 chars) in EMAIL_PASS, not regular password');
        console.error('4. Restart the server after updating .env');
        
        // Don't fall back to development mode - return error to force proper setup
        otpStore.delete(email); // Clean up the stored OTP
        res.status(500).json({ 
          message: 'Gmail authentication failed. Please set up App Password properly.',
          error: 'Invalid email credentials',
          instructions: [
            'Enable 2-Factor Authentication on your Gmail account',
            'Go to Google Account Settings → Security → App Passwords',
            'Generate an App Password for Mail',
            'Use the 16-character App Password in your .env file',
            'Restart the server'
          ]
        });
      } else if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email credentials not configured');
        console.log(`🔐 Development mode: OTP for ${email} is: ${otpCode}`);
        res.json({ 
          message: 'Email service not configured. OTP logged to console (development mode)',
          development: true,
          otp: process.env.NODE_ENV === 'development' ? otpCode : undefined
        });
      } else {
        // Other email errors
        console.error('Email sending failed:', emailError.message);
        otpStore.delete(email); // Clean up the stored OTP
        res.status(500).json({ 
          message: 'Failed to send email. Please check your email configuration.',
          error: emailError.message
        });
      }
    }
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ message: 'Error processing forgot password request' });
  }
};

// @desc Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Check if OTP exists
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (storedOTP.code !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ message: 'Error verifying OTP' });
  }
};

// @desc Reset password
const resetPassword = async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;

    // Check if OTP exists and is valid
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Verify OTP
    if (storedOTP.code !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Find user and update password
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Clear OTP from store
    otpStore.delete(email);

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Password reset error:', err);
    res.status(500).json({ message: 'Error resetting password' });
  }
};

// @desc Verify email OTP and complete registration
const verifyEmailOTP = async (req, res) => {
  try {
    const { email, otpCode } = req.body;

    // Check if OTP exists
    const storedOTP = otpStore.get(email);
    if (!storedOTP) {
      return res.status(400).json({ message: 'OTP not found or expired' });
    }

    // Check if OTP is expired
    if (Date.now() > storedOTP.expiresAt) {
      otpStore.delete(email);
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Check if OTP is correct
    if (storedOTP.code !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Check if this is registration OTP (has userData)
    if (!storedOTP.userData) {
      return res.status(400).json({ message: 'Invalid OTP type' });
    }

    // Create the user with verified email
    const { name, email: userEmail, password } = storedOTP.userData;
    const user = await User.create({
      name,
      email: userEmail,
      password,
      isEmailVerified: true
    });

    // Clean up OTP
    otpStore.delete(email);

    res.status(201).json({
      message: 'Email verified successfully! Account created.',
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error('Email verification error:', err);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

// @desc Resend email verification OTP
const resendEmailVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Check if user exists and is not already verified
    const user = await User.findOne({ email });
    if (user && user.isEmailVerified) {
      return res.status(400).json({ message: 'Email is already verified' });
    }

    // Check if there's a pending registration
    const existingOTP = otpStore.get(email);
    if (!existingOTP || !existingOTP.userData) {
      return res.status(400).json({ message: 'No pending registration found. Please register again.' });
    }

    // Generate new OTP
    const otpCode = generateOTP();
    
    // Update stored OTP with new code and expiry
    otpStore.set(email, {
      ...existingOTP,
      code: otpCode,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    // Try to send verification email
    try {
      await sendEmailVerificationOTP(email, otpCode, existingOTP.userData.name);
      res.json({ message: 'Verification email sent successfully' });
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      res.status(500).json({ 
        message: 'Failed to send verification email. Please try again.',
        error: emailError.message
      });
    }
  } catch (err) {
    console.error('Resend verification error:', err);
    res.status(500).json({ message: 'Error resending verification email' });
  }
};

module.exports = {
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
};
