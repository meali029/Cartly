const Order = require('../models/orderModel');
const Product = require('../models/productModel');

const { sendOrderConfirmationEmail } = require('../utils/emailSender');

const placeOrder = async (req, res) => {
  try {
    const { userId, items, totalPrice, shippingInfo, paymentStatus, paymentMethod } = req.body;

    console.log('📦 Placing order:', { userId, items: items?.length, totalPrice });

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No items in order' });
    }

    // Use authenticated user's ID if not provided
    const orderUserId = userId || req.user._id;

    const order = await Order.create({
      userId: orderUserId,
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
    const userEmail = req.user?.email;  // make sure req.user exists (protect middleware)
    if(userEmail) {
      sendOrderConfirmationEmail(userEmail, order).catch(err => {
        console.error('📧 Email sending failed:', err.message);
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('❌ Order placement error:', err);
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};


// @desc Get orders of a user
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('items.productId', 'title price image description category sizes colors');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders' });
  }
};

// @desc Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').populate('items.productId', 'title price image description category sizes colors');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
};

// @desc Update order status (admin)
const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status, cancelReason } = req.body;
    
    // First, get the current order to check previous status
    const currentOrder = await Order.findById(orderId);
    if (!currentOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    const previousStatus = currentOrder.status;
  
    
    // Update the order status
    const order = await Order.findByIdAndUpdate(
      orderId,
      status === 'cancelled'
        ? { status: status, cancelReason: cancelReason }
        : { status: status },
      { new: true }
    );

    // Handle stock updates when status changes to 'shipped'
    if (status === 'shipped' && previousStatus !== 'shipped') {
      
      // Update stock for each item in the order
      const stockUpdatePromises = order.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          if (!product) {
           
            return { success: false, productId: item.productId, reason: 'Product not found' };
          }
          
       
          
          const newStock = Math.max(0, product.stock - item.quantity);
          
          await Product.findByIdAndUpdate(
            item.productId,
            { stock: newStock },
            { new: true }
          );
          
          
          // Emit real-time stock update
          const io = req.app.get('io');
          if (io) {
            io.emit('stock:update', {
              productId: item.productId,
              newStock: newStock,
              orderId: orderId,
              itemsSold: item.quantity,
              productTitle: item.title
            });
          }
          
          return { success: true, productId: item.productId, newStock, oldStock: product.stock };
          
        } catch (error) {
         
          return { success: false, productId: item.productId, error: error.message };
        }
      });
      
      // Wait for all stock updates to complete and collect results
      const stockUpdateResults = await Promise.all(stockUpdatePromises);
      const successfulUpdates = stockUpdateResults.filter(result => result.success);
      const failedUpdates = stockUpdateResults.filter(result => !result.success);
      
    
    }
    
    // Handle stock restoration when order is cancelled (if it was previously shipped)
    if (status === 'cancelled' && previousStatus === 'shipped') {
     
      
      // Restore stock for each item in the order
      const stockRestorePromises = order.items.map(async (item) => {
        try {
          const product = await Product.findById(item.productId);
          if (!product) {
          
            return;
          }
          
          const newStock = product.stock + item.quantity;
          
          await Product.findByIdAndUpdate(
            item.productId,
            { stock: newStock },
            { new: true }
          );
          
          
          
          // Emit real-time stock update
          const io = req.app.get('io');
          if (io) {
            io.emit('stock:update', {
              productId: item.productId,
              newStock: newStock,
              orderId: orderId,
              itemsRestored: item.quantity
            });
          }
          
        } catch (error) {
         
        }
      });
      
      // Wait for all stock restorations to complete
      await Promise.all(stockRestorePromises);
     
    }

    // Real-time: Notify all clients about order update
    const io = req.app.get('io');
    if (io) io.emit('order:update', order);

    res.json({
      order: order,
      message: `Order status updated to ${status}${status === 'shipped' ? ' and product stocks updated' : ''}${status === 'cancelled' && previousStatus === 'shipped' ? ' and product stocks restored' : ''}`
    });
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
