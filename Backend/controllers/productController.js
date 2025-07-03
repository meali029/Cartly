const Product = require('../models/productModel');

// @desc    Get all products
const getAllProducts = async (req, res) => {
  const { category, minPrice, maxPrice } = req.query
const { size } = req.query

if (size) {
  filter.size = size // Assumes product.size is an array like ['M', 'L']
}

const filter = {}

if (category) filter.category = category
if (minPrice && maxPrice) {
  filter.price = { $gte: minPrice, $lte: maxPrice }
}
let sortBy = {}

if (req.query.sort === 'priceAsc') sortBy.price = 1
if (req.query.sort === 'priceDesc') sortBy.price = -1
if (req.query.sort === 'newest') sortBy.createdAt = -1
if (req.query.sort === 'az') sortBy.title = 1

const products = await Product.find(filter).sort(sortBy)

  res.json(products);
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
