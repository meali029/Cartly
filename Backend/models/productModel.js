const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter product title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please enter price'],
    min: [0, 'Price must be at least 0']
  },
  category: {
    type: String,
    enum: ['men', 'women', 'kids'],
    required: [true, 'Please specify category']
  },
  size: {
    type: [String],
    default: []
  },
  image: {
    type: String,
    required: [true, 'Please add a product image URL']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
