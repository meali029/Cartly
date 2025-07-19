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
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    
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
      acc[date].sales += (order.totalPrice || 0)
      acc[date].orders += 1
      return acc
    }, {})
    
    res.json({
      period,
      data: Object.values(salesData),
      total: orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0),
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
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
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
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.productId',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
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

// Get detailed revenue analytics with debugging
router.get('/revenue', protect, admin, async (req, res) => {
  try {
    console.log('🔄 Fetching revenue analytics...')
    
    // Get all orders first to debug
    const allOrders = await Order.find({})
    console.log(`📊 Total orders found: ${allOrders.length}`)
    
    // Debug first few orders
    if (allOrders.length > 0) {
      console.log('📝 Sample orders:')
      allOrders.slice(0, 3).forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          id: order._id,
          totalPrice: order.totalPrice,
          status: order.status,
          date: order.createdAt
        })
      })
    }
    
    // Get non-cancelled orders only
    const validOrders = await Order.find({ status: { $ne: 'cancelled' } })
    console.log(`📊 Non-cancelled orders: ${validOrders.length}`)
    
    // Calculate total revenue with debugging
    let totalRevenue = 0
    let orderCount = 0
    
    validOrders.forEach(order => {
      const orderAmount = order.totalPrice || 0
      totalRevenue += orderAmount
      if (orderAmount > 0) {
        orderCount++
        console.log(`✅ Order ${order._id}: PKR ${orderAmount}`)
      } else {
        console.log(`⚠️ Order ${order._id}: No amount (${orderAmount})`)
      }
    })
    
    console.log(`💰 Final Total Revenue: PKR ${totalRevenue}`)
    console.log(`📊 Orders with revenue: ${orderCount}/${validOrders.length}`)
    
    // Get recent orders for growth calculation
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const recentOrders = await Order.find({
      createdAt: { $gte: thirtyDaysAgo },
      status: { $ne: 'cancelled' }
    })
    
    const recentRevenue = recentOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    
    res.json({
      total: totalRevenue,
      recent: recentRevenue,
      orderCount: validOrders.length,
      recentOrderCount: recentOrders.length,
      avgOrderValue: validOrders.length > 0 ? totalRevenue / validOrders.length : 0,
      debug: {
        totalOrdersInDB: allOrders.length,
        nonCancelledOrders: validOrders.length,
        ordersWithRevenue: orderCount,
        sampleOrder: allOrders.length > 0 ? {
          totalPrice: allOrders[0].totalPrice,
          status: allOrders[0].status
        } : null
      }
    })
    
  } catch (error) {
    console.error('❌ Revenue analytics error:', error)
    res.status(500).json({ 
      message: 'Server error', 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
})

// Debug endpoint to check order structure
router.get('/debug', protect, admin, async (req, res) => {
  try {
    console.log('🔍 Debug: Checking order structure...')
    
    // Get first few orders to check structure
    const sampleOrders = await Order.find({}).limit(3)
    
    console.log(`📊 Found ${sampleOrders.length} sample orders`)
    
    const debugInfo = {
      totalOrders: await Order.countDocuments(),
      sampleOrderStructure: sampleOrders.length > 0 ? {
        keys: Object.keys(sampleOrders[0].toObject()),
        firstOrder: {
          id: sampleOrders[0]._id,
          totalPrice: sampleOrders[0].totalPrice,
          status: sampleOrders[0].status,
          itemsCount: sampleOrders[0].items?.length || 0,
          createdAt: sampleOrders[0].createdAt
        }
      } : null,
      revenueCalculation: {
        allOrders: 0,
        nonCancelled: 0
      }
    }
    
    // Calculate revenue
    const allOrders = await Order.find({})
    const validOrders = allOrders.filter(order => order.status !== 'cancelled')
    
    debugInfo.revenueCalculation.allOrders = allOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    debugInfo.revenueCalculation.nonCancelled = validOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0)
    
    console.log('🔍 Debug Info:', debugInfo)
    
    res.json(debugInfo)
    
  } catch (error) {
    console.error('❌ Debug endpoint error:', error)
    res.status(500).json({ message: 'Debug error', error: error.message })
  }
})

// Get recent orders for dashboard
router.get('/recent-orders', protect, admin, async (req, res) => {
  try {
    const { limit = 5 } = req.query
    
    const recentOrders = await Order.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean()
    
    const formattedOrders = recentOrders.map(order => ({
      _id: order._id,
      orderNumber: `#${order._id.toString().slice(-6).toUpperCase()}`,
      customerName: order.userId?.name || 'Guest',
      customerEmail: order.userId?.email || 'No email',
      totalPrice: order.totalPrice || 0,
      status: order.status || 'pending',
      createdAt: order.createdAt,
      timeAgo: getTimeAgo(order.createdAt),
      itemCount: order.items?.length || 0
    }))
    
    res.json(formattedOrders)
  } catch (error) {
    console.error('❌ Recent orders error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Get dashboard top products
router.get('/dashboard-top-products', protect, admin, async (req, res) => {
  try {
    const { limit = 5 } = req.query
    
    const pipeline = [
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSales: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          productTitle: { $first: '$items.title' },
          productImage: { $first: '$items.image' }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: parseInt(limit) }
    ]
    
    const topProducts = await Order.aggregate(pipeline)
    
    const formattedProducts = topProducts.map((product, index) => ({
      _id: product._id,
      name: product.productTitle || `Product ${index + 1}`,
      image: product.productImage,
      sales: product.totalSales,
      revenue: product.totalRevenue,
      status: product.totalSales > 10 ? 'Hot' : 'In stock'
    }))
    
    res.json(formattedProducts)
  } catch (error) {
    console.error('❌ Dashboard top products error:', error)
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

// Helper function to calculate time ago
function getTimeAgo(date) {
  const now = new Date()
  const orderDate = new Date(date)
  const diffMs = now - orderDate
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffMins < 60) {
    return `${diffMins} ${diffMins === 1 ? 'minute' : 'minutes'} ago`
  } else if (diffHours < 24) {
    return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
  } else {
    return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
  }
}

module.exports = router
