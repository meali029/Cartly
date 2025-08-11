const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      title: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      size: {
        type: String
      },
      color: {
        type: String
      },
      image: {
        type: String
      }
    }
  ],
  // Optional customer info provided at checkout (e.g., phone numbers, notes)
  customerInfo: {
    phone: { type: String },
    alternatePhone: { type: String },
    instructions: { type: String }
  },
  shippingInfo: {
    // Address for delivery
    address: { type: String, required: true },
    city: { type: String, required: true },
    // Some UIs capture area/sector separately
    area: { type: String },
    postalCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid'
  },
  paymentMethod: {
    type: String,
    enum: ['COD', 'Card'],
    default: 'COD',
  },
  totalPrice: {
    type: Number,
    required: true
  },
  deliveryCharges: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  cancelReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
