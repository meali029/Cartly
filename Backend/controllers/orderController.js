const Order = require('../models/orderModel');

const { sendOrderConfirmationEmail } = require('../utils/emailSender');

const placeOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingInfo, paymentStatus, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    const order = await Order.create({
      userId,
      items,
      shippingInfo,
      paymentStatus,
      paymentMethod,
      totalPrice
    });

    // Real-time: Notify all clients about new order
    const io = req.app.get('io');
    if (io) io.emit('order:new', order);

    // Send confirmation email (don't block response)
    const userEmail = req.user.email;  // make sure req.user exists (protect middleware)
    if(userEmail) {
      sendOrderConfirmationEmail(userEmail, order).catch(err => {
        console.error('Email sending failed:', err);
      });
    }

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};


// @desc Get orders of a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.productId', 'title price');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// @desc Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      req.body.status === 'cancelled'
        ? { status: req.body.status, cancelReason: req.body.cancelReason }
        : { status: req.body.status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Real-time: Notify all clients about order update
    const io = req.app.get('io');
    if (io) io.emit('order:update', order);

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
};
