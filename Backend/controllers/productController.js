const Product = require('../models/productModel');

// @desc    Get all products
const getAllProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, size, sort, page = 1, limit = 12 } = req.query
    
    const filter = {}
    
    if (category) filter.category = category
    if (minPrice && maxPrice) {
      filter.price = { $gte: Number(minPrice), $lte: Number(maxPrice) }
    }
    if (size) {
      filter.size = { $in: [size] } // Check if size is in the array
    }
    
    let sortBy = {}
    
    if (sort === 'priceAsc') sortBy.price = 1
    if (sort === 'priceDesc') sortBy.price = -1
    if (sort === 'newest') sortBy.createdAt = -1
    if (sort === 'az') sortBy.title = 1
    
    const skip = (Number(page) - 1) * Number(limit)
    
    const products = await Product.find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(Number(limit))
    
    const totalProducts = await Product.countDocuments(filter)
    const totalPages = Math.ceil(totalProducts / Number(limit))
    
    res.json({
      products,
      totalPages,
      currentPage: Number(page),
      totalProducts
    })
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products', error: err.message })
  }
};


// @desc    Get single product
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// @desc    Create a product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: 'Invalid product data', error: err.message });
  }
};

// @desc    Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: 'Failed to update product', error: err.message });
  }
};

// @desc    Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: '✅ Product deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
