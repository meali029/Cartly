const express = require('express')
const router = express.Router()
const { protect, admin } = require('../middleware/authMiddleware')
const User = require('../models/userModel')
const Product = require('../models/productModel')
const Order = require('../models/orderModel')

// Get analytics summary
router.get('/summary', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalProducts = await Product.countDocuments()
    const totalOrders = await Order.countDocuments()
    
    const orders = await Order.find({})
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    
    const completedOrders = await Order.countDocuments({ status: 'delivered' })
    const pendingOrders = await Order.countDocuments({ status: { $in: ['pending', 'processing'] } })
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' })
    
    const inStockProducts = await Product.countDocuments({ stock: { $gt: 0 } })
    const outOfStockProducts = await Product.countDocuments({ stock: 0 })
    const lowStockProducts = await Product.countDocuments({ stock: { $gt: 0, $lte: 10 } })
    
    // Get new users in last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const newUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    
    // Get active users (users who placed orders in last 30 days)
    const activeUserIds = await Order.distinct('userId', { createdAt: { $gte: thirtyDaysAgo } })
    const activeUsers = activeUserIds.length
    
    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        new: newUsers,
        growth: totalUsers > 0 ? ((newUsers / totalUsers) * 100).toFixed(1) : 0
      },
      products: {
        total: totalProducts,
        inStock: inStockProducts,
        outOfStock: outOfStockProducts,
        lowStock: lowStockProducts
      },
      orders: {
        total: totalOrders,
        completed: completedOrders,
        pending: pendingOrders,
        cancelled: cancelledOrders,
        growth: 15.2 // Mock growth percentage
      },
      revenue: {
        total: totalRevenue,
        growth: 8.3 // Mock growth percentage
      }
    })
  } catch (error) {
    console.error('Analytics summary error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get sales analytics
router.get('/sales', protect, admin, async (req, res) => {
  try {
    const { period = '7days' } = req.query
    
    let startDate = new Date()
    switch (period) {
      case '7days':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30days':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90days':
        startDate.setDate(startDate.getDate() - 90)
        break
      case '1year':
        startDate.setFullYear(startDate.getFullYear() - 1)
        break
      default:
        startDate.setDate(startDate.getDate() - 7)
    }
    
    const orders = await Order.find({
      createdAt: { $gte: startDate },
      status: { $ne: 'cancelled' }
    }).sort({ createdAt: 1 })
    
    const salesData = orders.reduce((acc, order) => {
      const date = order.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { date, sales: 0, orders: 0 }
      }
      acc[date].sales += order.totalAmount
      acc[date].orders += 1
      return acc
    }, {})
    
    res.json({
      period,
      data: Object.values(salesData),
      total: orders.reduce((sum, order) => sum + order.totalAmount, 0),
      growth: 12.5 // Mock growth percentage
    })
  } catch (error) {
    console.error('Sales analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get top products
router.get('/top-products', protect, admin, async (req, res) => {
  try {
    const { limit = 10 } = req.query
    
    const pipeline = [
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products.productId',
          totalSales: { $sum: '$products.quantity' },
          totalRevenue: { $sum: { $multiply: ['$products.quantity', '$products.price'] } }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          _id: 1,
          name: '$product.title',
          sales: '$totalSales',
          revenue: '$totalRevenue'
        }
      }
    ]
    
    const topProducts = await Order.aggregate(pipeline)
    
    res.json(topProducts)
  } catch (error) {
    console.error('Top products error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

// Get category performance
router.get('/categories', protect, admin, async (req, res) => {
  try {
    const pipeline = [
      { $unwind: '$products' },
      {
        $lookup: {
          from: 'products',
          localField: 'products.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSales: { $sum: { $multiply: ['$products.quantity', '$products.price'] } },
          totalOrders: { $sum: 1 }
        }
      },
      { $sort: { totalSales: -1 } }
    ]
    
    const categories = await Order.aggregate(pipeline)
    const totalSales = categories.reduce((sum, cat) => sum + cat.totalSales, 0)
    
    const formattedCategories = categories.map(cat => ({
      name: cat._id.charAt(0).toUpperCase() + cat._id.slice(1),
      sales: cat.totalSales,
      percentage: totalSales > 0 ? ((cat.totalSales / totalSales) * 100).toFixed(1) : 0
    }))
    
    res.json(formattedCategories)
  } catch (error) {
    console.error('Categories analytics error:', error)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
