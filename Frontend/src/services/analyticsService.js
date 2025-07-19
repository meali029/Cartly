import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Set up axios defaults
axios.defaults.timeout = 15000 // 15 second timeout

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  if (!token) {
    throw new Error('Authentication required')
  }
  
  return {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }
}

// Add request interceptor for debugging
axios.interceptors.request.use(
  (config) => {
   
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging and error handling
axios.interceptors.response.use(
  (response) => {
    
    return response
  },
  (error) => {
   
    
    return Promise.reject(error)
  }
)

// 📊 Get comprehensive dashboard summary
export const getDashboardSummary = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/summary`, config)
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch dashboard summary: ${error.message}`)
  }
}

// 🔝 Get top performing products
export const getTopProducts = async (limit = 10) => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/top-products?limit=${limit}`, config)
    
    return response.data || []
  } catch (error) {
    throw new Error(`Failed to fetch top products: ${error.message}`)
  }
}

// 📈 Get sales analytics data
export const getSalesAnalytics = async (period = '7days') => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/sales?period=${period}`, config)
    
    const salesData = response.data || { data: [], total: 0, period }
    return salesData
  } catch (error) {
    throw new Error(`Failed to fetch sales analytics: ${error.message}`)
  }
}

// 🎯 Get category performance analytics
export const getCategoryAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/categories`, config)
    
    const categories = response.data || []
   
    return categories
  } catch (error) {
    throw new Error(`Failed to fetch category analytics: ${error.message}`)
  }
}

// 📦 Get product analytics
export const getProductAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/products`, config)
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch product analytics: ${error.message}`)
  }
}

// 👥 Get user analytics
export const getUserAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/users`, config)
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch user analytics: ${error.message}`)
  }
}

// 📋 Get order analytics
export const getOrderAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/orders`, config)
    
    return response.data
  } catch (error) {
          throw new Error(`Failed to fetch order analytics: ${error.message}`)
  }
}

// 💰 Get revenue analytics
export const getRevenueAnalytics = async (period = '30days') => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/revenue?period=${period}`, config)
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to fetch revenue analytics: ${error.message}`)
  }
}

// 💵 Get detailed revenue data
export const getDetailedRevenue = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/revenue`, config)

    
    // Validate revenue data
    if (response.data && typeof response.data.total === 'number') {
      return response.data
    } else {
      
      return { total: 0, recent: 0, orderCount: 0, avgOrderValue: 0 }
    }
  } catch (error) {
   
    throw new Error(`Failed to fetch detailed revenue: ${error.message}`)
  }
}

// 📊 Get all analytics data in one call (optimization)
export const getAllAnalytics = async (period = '7days') => {
  try {
    
    const [
      summary,
      topProducts,
      sales,
      categories,
      products,
      users,
      orders,
      revenue
    ] = await Promise.allSettled([
      getDashboardSummary(),
      getTopProducts(5),
      getSalesAnalytics(period),
      getCategoryAnalytics(),
      getProductAnalytics(),
      getUserAnalytics(),
      getOrderAnalytics(),
      getRevenueAnalytics(period)
    ])
    
    return {
      summary: summary.status === 'fulfilled' ? summary.value : null,
      topProducts: topProducts.status === 'fulfilled' ? topProducts.value : [],
      sales: sales.status === 'fulfilled' ? sales.value : { data: [], total: 0 },
      categories: categories.status === 'fulfilled' ? categories.value : [],
      products: products.status === 'fulfilled' ? products.value : null,
      users: users.status === 'fulfilled' ? users.value : null,
      orders: orders.status === 'fulfilled' ? orders.value : null,
      revenue: revenue.status === 'fulfilled' ? revenue.value : null,
      errors: {
        summary: summary.status === 'rejected' ? summary.reason.message : null,
        topProducts: topProducts.status === 'rejected' ? topProducts.reason.message : null,
        sales: sales.status === 'rejected' ? sales.reason.message : null,
        categories: categories.status === 'rejected' ? categories.reason.message : null,
        products: products.status === 'rejected' ? products.reason.message : null,
        users: users.status === 'rejected' ? users.reason.message : null,
        orders: orders.status === 'rejected' ? orders.reason.message : null,
        revenue: revenue.status === 'rejected' ? revenue.reason.message : null
      }
    }
  } catch (error) {
    throw new Error(`Failed to fetch analytics data: ${error.message}`)
  }
}

// 🔍 Test API connection
export const testConnection = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/summary`, config)
    
    return {
      success: true,
      status: response.status,
      message: 'API connection successful'
    }
  } catch (error) {
    return {
      success: false,
      status: error.response?.status || 0,
      message: error.message
    }
  }
}

// 📱 Get real-time analytics (if implemented)
export const getRealTimeAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/realtime`, config)
    
    return response.data
  } catch (error) {
   
    return null
  }
}

// 📊 Export analytics data
export const exportAnalyticsData = async (format = 'csv', period = '30days') => {
  try {
    const config = {
      ...getAuthHeaders(),
      responseType: 'blob' // Important for file downloads
    }
    
    const response = await axios.get(
      `${API}/analytics/export?format=${format}&period=${period}`,
      config
    )
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to export analytics data: ${error.message}`)
  }
}

// 🎛️ Update analytics settings
export const updateAnalyticsSettings = async (settings) => {
  try {
    const config = getAuthHeaders()
    const response = await axios.put(`${API}/analytics/settings`, settings, config)
    
    return response.data
  } catch (error) {
    throw new Error(`Failed to update analytics settings: ${error.message}`)
  }
}

// �️ Get comprehensive analytics with fallback structure
export const getComprehensiveAnalytics = async (period = '7days') => {
  try {
    
    const results = await Promise.allSettled([
      getDashboardSummary(),
      getTopProducts(5),
      getSalesAnalytics(period),
      getCategoryAnalytics(),
      getDetailedRevenue()
    ])
    
    const [summaryResult, topProductsResult, salesResult, categoriesResult, revenueResult] = results
    
    // Process results with proper error handling
    const summary = summaryResult.status === 'fulfilled' ? summaryResult.value : {
      users: { total: 0, active: 0, new: 0, growth: 0 },
      products: { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 },
      orders: { total: 0, completed: 0, pending: 0, cancelled: 0, growth: 0 },
      revenue: { total: 0, growth: 0 }
    }
    
    const topProducts = topProductsResult.status === 'fulfilled' ? topProductsResult.value : []
    const sales = salesResult.status === 'fulfilled' ? salesResult.value : { data: [], total: 0, period }
    const categories = categoriesResult.status === 'fulfilled' ? categoriesResult.value : []
    const revenueData = revenueResult.status === 'fulfilled' ? revenueResult.value : { total: 0, growth: 0 }
    
    // Override summary revenue with detailed revenue data (always use detailed data)
    if (revenueData && typeof revenueData.total === 'number') {
      summary.revenue = {
        total: revenueData.total,
        growth: revenueData.growth || 0,
        recent: revenueData.recent || 0,
        avgOrderValue: revenueData.avgOrderValue || 0
      }
    }
    
  
    
    // Handle errors
    const errors = []
    if (summaryResult.status === 'rejected') errors.push(`Summary: ${summaryResult.reason.message}`)
    if (topProductsResult.status === 'rejected') errors.push(`Top Products: ${topProductsResult.reason.message}`)
    if (salesResult.status === 'rejected') errors.push(`Sales: ${salesResult.reason.message}`)
    if (categoriesResult.status === 'rejected') errors.push(`Categories: ${categoriesResult.reason.message}`)
    if (revenueResult.status === 'rejected') errors.push(`Revenue: ${revenueResult.reason.message}`)
  
    
    return {
      summary,
      topProducts,
      sales,
      categories,
      errors: errors.length > 0 ? errors : null,
      timestamp: new Date().toISOString(),
      period
    }
    
  } catch (error) {
    throw new Error(`Failed to fetch comprehensive analytics: ${error.message}`)
  }
}

// 🔄 Refresh analytics data
export const refreshAnalytics = async (period = '7days') => {
  try {
    
    // Force fresh data by adding timestamp to requests
    const timestamp = Date.now()
    const config = {
      ...getAuthHeaders(),
      params: { _refresh: timestamp }
    }
    
    const [summary, topProducts, sales, categories] = await Promise.all([
      axios.get(`${API}/analytics/summary`, config),
      axios.get(`${API}/analytics/top-products?limit=5`, config),
      axios.get(`${API}/analytics/sales?period=${period}`, config),
      axios.get(`${API}/analytics/categories`, config)
    ])
    
    
    return {
      summary: summary.data,
      topProducts: topProducts.data || [],
      sales: sales.data || { data: [], total: 0, period },
      categories: categories.data || [],
      timestamp: new Date().toISOString(),
      period
    }
    
  } catch (error) {
    throw new Error(`Failed to refresh analytics: ${error.message}`)
  }
}

// 📈 Get analytics for specific date range
export const getAnalyticsByDateRange = async (startDate, endDate) => {
  try {
    const config = {
      ...getAuthHeaders(),
      params: { startDate, endDate }
    }
    
    const response = await axios.get(`${API}/analytics/date-range`, config)
    
    return response.data
    
  } catch (error) {
    throw new Error(`Failed to fetch date range analytics: ${error.message}`)
  }
}

// 🎯 Get conversion analytics
export const getConversionAnalytics = async () => {
  try {
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/conversions`, config)
    
    return response.data
    
  } catch (error) {
    throw new Error(`Failed to fetch conversion analytics: ${error.message}`)
  }
}

// � Validate analytics data structure
export const validateAnalyticsData = (data) => {
  const isValid = {
    summary: data?.summary && typeof data.summary === 'object',
    topProducts: Array.isArray(data?.topProducts),
    sales: data?.sales && Array.isArray(data?.sales?.data),
    categories: Array.isArray(data?.categories)
  }
  
  const allValid = Object.values(isValid).every(Boolean)
  
  
  return { isValid: allValid, checks: isValid }
}

// �🔧 Utility functions
export const formatCurrency = (amount, currency = 'PKR') => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'Rs 0'
  }
  
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

export const formatNumber = (number) => {
  if (typeof number !== 'number' || isNaN(number)) {
    return '0'
  }
  
  return new Intl.NumberFormat('en-PK').format(number)
}

export const formatPercentage = (value, decimals = 1) => {
  if (typeof value !== 'number' || isNaN(value)) {
    return '0.0%'
  }
  
  return `${value.toFixed(decimals)}%`
}

export const formatGrowth = (current, previous) => {
  if (typeof current !== 'number' || typeof previous !== 'number' || previous === 0) {
    return 0
  }
  
  return ((current - previous) / previous * 100)
}

// 📊 Analytics service status and health check
export const getServiceInfo = () => {
  const token = localStorage.getItem('cratlyToken')
  
  return {
    name: 'Professional Analytics Service',
    version: '3.0.0',
    apiUrl: API,
    timeout: axios.defaults.timeout,
    authenticated: !!token,
    features: [
      'Real-time Database Analytics',
      'Dashboard Summary',
      'Top Products Analysis',
      'Sales Trends',
      'Category Performance',
      'User Behavior Analytics',
      'Order Processing Analytics',
      'Revenue Analysis',
      'Date Range Queries',
      'Conversion Analytics',
      'Data Validation',
      'Professional Formatting',
      'Error Handling & Recovery'
    ],
    endpoints: {
      summary: `${API}/analytics/summary`,
      topProducts: `${API}/analytics/top-products`,
      sales: `${API}/analytics/sales`,
      categories: `${API}/analytics/categories`,
      users: `${API}/analytics/users`,
      orders: `${API}/analytics/orders`,
      revenue: `${API}/analytics/revenue`
    }
  }
}

// 📊 Service health check
export const checkServiceHealth = async () => {
  try {
    
    const startTime = Date.now()
    const connection = await testConnection()
    const responseTime = Date.now() - startTime
    
    const health = {
      status: connection.success ? 'healthy' : 'unhealthy',
      responseTime: `${responseTime}ms`,
      apiUrl: API,
      authenticated: !!localStorage.getItem('cratlyToken'),
      timestamp: new Date().toISOString()
    }
    
    return health
    
  } catch (error) {
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }
  }
}

// Get recent orders for dashboard
export const getRecentOrders = async (limit = 5) => {
  try {
    const response = await axios.get(
      `${API}/analytics/recent-orders?limit=${limit}`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent orders')
  }
}

// Get top products for dashboard
export const getDashboardTopProducts = async (limit = 5) => {
  try {
    const response = await axios.get(
      `${API}/analytics/dashboard-top-products?limit=${limit}`,
      getAuthHeaders()
    )
    return response.data
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch top products')
  }
}

export default {
  // Core analytics functions
  getDashboardSummary,
  getTopProducts,
  getSalesAnalytics,
  getCategoryAnalytics,
  getProductAnalytics,
  getUserAnalytics,
  getOrderAnalytics,
  getRevenueAnalytics,
  getDetailedRevenue,
  
  // Dashboard specific
  getRecentOrders,
  getDashboardTopProducts,
  
  // Professional features
  getComprehensiveAnalytics,
  refreshAnalytics,
  getAnalyticsByDateRange,
  getConversionAnalytics,
  validateAnalyticsData,
  
  // Advanced features
  getAllAnalytics,
  testConnection,
  getRealTimeAnalytics,
  exportAnalyticsData,
  updateAnalyticsSettings,
  checkServiceHealth,
  
  // Utilities
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatGrowth,
  getServiceInfo
}
