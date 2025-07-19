import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Set up axios defaults
axios.defaults.timeout = 15000 // 15 second timeout

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  if (!token) {
    console.error('❌ No auth token found')
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
    console.log(`🌐 ${config.method?.toUpperCase()} Request:`, config.url)
    return config
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error)
    return Promise.reject(error)
  }
)

// Add response interceptor for debugging and error handling
axios.interceptors.response.use(
  (response) => {
    console.log(`✅ ${response.config.method?.toUpperCase()} Success:`, response.config.url, `(${response.status})`)
    return response
  },
  (error) => {
    const url = error.config?.url || 'unknown'
    const method = error.config?.method?.toUpperCase() || 'unknown'
    
    if (error.response) {
      console.error(`❌ ${method} ${error.response.status}:`, url, error.response.data?.message || error.response.statusText)
    } else if (error.request) {
      console.error(`❌ ${method} Network Error:`, url, 'No response received')
    } else {
      console.error(`❌ ${method} Request Error:`, url, error.message)
    }
    
    return Promise.reject(error)
  }
)

// 📊 Get comprehensive dashboard summary
export const getDashboardSummary = async () => {
  try {
    console.log('🔄 Fetching dashboard summary...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/summary`, config)
    
    console.log('✅ Dashboard summary received:', response.data)
    return response.data
  } catch (error) {
    console.error('❌ getDashboardSummary failed:', error.message)
    throw new Error(`Failed to fetch dashboard summary: ${error.message}`)
  }
}

// 🔝 Get top performing products
export const getTopProducts = async (limit = 10) => {
  try {
    console.log(`🔄 Fetching top ${limit} products...`)
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/top-products?limit=${limit}`, config)
    
    console.log(`✅ Top products received: ${response.data?.length || 0} products`)
    return response.data || []
  } catch (error) {
    console.error('❌ getTopProducts failed:', error.message)
    throw new Error(`Failed to fetch top products: ${error.message}`)
  }
}

// 📈 Get sales analytics data
export const getSalesAnalytics = async (period = '7days') => {
  try {
    console.log(`🔄 Fetching sales analytics for period: ${period}`)
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/sales?period=${period}`, config)
    
    const salesData = response.data || { data: [], total: 0, period }
    console.log(`✅ Sales analytics received: ${salesData.data?.length || 0} data points`)
    return salesData
  } catch (error) {
    console.error('❌ getSalesAnalytics failed:', error.message)
    throw new Error(`Failed to fetch sales analytics: ${error.message}`)
  }
}

// 🎯 Get category performance analytics
export const getCategoryAnalytics = async () => {
  try {
    console.log('🔄 Fetching category analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/categories`, config)
    
    const categories = response.data || []
    console.log(`✅ Category analytics received: ${categories.length} categories`)
    return categories
  } catch (error) {
    console.error('❌ getCategoryAnalytics failed:', error.message)
    throw new Error(`Failed to fetch category analytics: ${error.message}`)
  }
}

// 📦 Get product analytics
export const getProductAnalytics = async () => {
  try {
    console.log('🔄 Fetching product analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/products`, config)
    
    console.log('✅ Product analytics received')
    return response.data
  } catch (error) {
    console.error('❌ getProductAnalytics failed:', error.message)
    throw new Error(`Failed to fetch product analytics: ${error.message}`)
  }
}

// 👥 Get user analytics
export const getUserAnalytics = async () => {
  try {
    console.log('🔄 Fetching user analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/users`, config)
    
    console.log('✅ User analytics received')
    return response.data
  } catch (error) {
    console.error('❌ getUserAnalytics failed:', error.message)
    throw new Error(`Failed to fetch user analytics: ${error.message}`)
  }
}

// 📋 Get order analytics
export const getOrderAnalytics = async () => {
  try {
    console.log('🔄 Fetching order analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/orders`, config)
    
    console.log('✅ Order analytics received')
    return response.data
  } catch (error) {
    console.error('❌ getOrderAnalytics failed:', error.message)
    throw new Error(`Failed to fetch order analytics: ${error.message}`)
  }
}

// 💰 Get revenue analytics
export const getRevenueAnalytics = async (period = '30days') => {
  try {
    console.log(`🔄 Fetching revenue analytics for period: ${period}`)
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/revenue?period=${period}`, config)
    
    console.log('✅ Revenue analytics received')
    return response.data
  } catch (error) {
    console.error('❌ getRevenueAnalytics failed:', error.message)
    throw new Error(`Failed to fetch revenue analytics: ${error.message}`)
  }
}

// 💵 Get detailed revenue data
export const getDetailedRevenue = async () => {
  try {
    console.log('🔄 Fetching detailed revenue data...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/revenue`, config)
    
    console.log('✅ Detailed revenue data received:', {
      total: response.data?.total,
      recent: response.data?.recent,
      orderCount: response.data?.orderCount,
      debug: response.data?.debug
    })
    
    // Validate revenue data
    if (response.data && typeof response.data.total === 'number') {
      return response.data
    } else {
      console.warn('⚠️ Invalid revenue data structure:', response.data)
      return { total: 0, recent: 0, orderCount: 0, avgOrderValue: 0 }
    }
  } catch (error) {
    console.error('❌ getDetailedRevenue failed:', error.message)
    if (error.response?.data) {
      console.error('🔍 Server error details:', error.response.data)
    }
    throw new Error(`Failed to fetch detailed revenue: ${error.message}`)
  }
}

// 📊 Get all analytics data in one call (optimization)
export const getAllAnalytics = async (period = '7days') => {
  try {
    console.log('🔄 Fetching all analytics data...')
    
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
    console.error('❌ getAllAnalytics failed:', error.message)
    throw new Error(`Failed to fetch analytics data: ${error.message}`)
  }
}

// 🔍 Test API connection
export const testConnection = async () => {
  try {
    console.log('🔄 Testing API connection...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/summary`, config)
    
    console.log('✅ API connection successful')
    return {
      success: true,
      status: response.status,
      message: 'API connection successful'
    }
  } catch (error) {
    console.error('❌ API connection failed:', error.message)
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
    console.log('🔄 Fetching real-time analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/realtime`, config)
    
    console.log('✅ Real-time analytics received')
    return response.data
  } catch (error) {
    console.error('❌ getRealTimeAnalytics failed:', error.message)
    // Don't throw error for real-time analytics as it might not be implemented
    return null
  }
}

// 📊 Export analytics data
export const exportAnalyticsData = async (format = 'csv', period = '30days') => {
  try {
    console.log(`🔄 Exporting analytics data as ${format}...`)
    const config = {
      ...getAuthHeaders(),
      responseType: 'blob' // Important for file downloads
    }
    
    const response = await axios.get(
      `${API}/analytics/export?format=${format}&period=${period}`,
      config
    )
    
    console.log('✅ Analytics data exported successfully')
    return response.data
  } catch (error) {
    console.error('❌ exportAnalyticsData failed:', error.message)
    throw new Error(`Failed to export analytics data: ${error.message}`)
  }
}

// 🎛️ Update analytics settings
export const updateAnalyticsSettings = async (settings) => {
  try {
    console.log('🔄 Updating analytics settings...')
    const config = getAuthHeaders()
    const response = await axios.put(`${API}/analytics/settings`, settings, config)
    
    console.log('✅ Analytics settings updated')
    return response.data
  } catch (error) {
    console.error('❌ updateAnalyticsSettings failed:', error.message)
    throw new Error(`Failed to update analytics settings: ${error.message}`)
  }
}

// �️ Get comprehensive analytics with fallback structure
export const getComprehensiveAnalytics = async (period = '7days') => {
  try {
    console.log('� Fetching comprehensive analytics from database...')
    
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
      console.log('🔄 Using detailed revenue data:', revenueData.total)
      summary.revenue = {
        total: revenueData.total,
        growth: revenueData.growth || 0,
        recent: revenueData.recent || 0,
        avgOrderValue: revenueData.avgOrderValue || 0
      }
    } else {
      console.warn('⚠️ No valid detailed revenue data, using summary revenue:', summary.revenue.total)
    }
    
    // Log what we received
    console.log('📊 Database Analytics Summary:', {
      summaryStatus: summaryResult.status,
      topProductsCount: topProducts.length,
      salesDataPoints: sales.data?.length || 0,
      categoriesCount: categories.length,
      detailedRevenue: revenueData?.total || 'N/A',
      summaryRevenue: summary.revenue.total,
      revenueSource: revenueData && typeof revenueData.total === 'number' ? 'detailed' : 'summary'
    })
    
    // Handle errors
    const errors = []
    if (summaryResult.status === 'rejected') errors.push(`Summary: ${summaryResult.reason.message}`)
    if (topProductsResult.status === 'rejected') errors.push(`Top Products: ${topProductsResult.reason.message}`)
    if (salesResult.status === 'rejected') errors.push(`Sales: ${salesResult.reason.message}`)
    if (categoriesResult.status === 'rejected') errors.push(`Categories: ${categoriesResult.reason.message}`)
    if (revenueResult.status === 'rejected') errors.push(`Revenue: ${revenueResult.reason.message}`)
    
    if (errors.length > 0) {
      console.warn('⚠️ Some analytics data failed to load:', errors.join(', '))
    }
    
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
    console.error('❌ getComprehensiveAnalytics failed:', error.message)
    throw new Error(`Failed to fetch comprehensive analytics: ${error.message}`)
  }
}

// 🔄 Refresh analytics data
export const refreshAnalytics = async (period = '7days') => {
  try {
    console.log('🔄 Refreshing analytics data...')
    
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
    
    console.log('✅ Analytics data refreshed successfully')
    
    return {
      summary: summary.data,
      topProducts: topProducts.data || [],
      sales: sales.data || { data: [], total: 0, period },
      categories: categories.data || [],
      timestamp: new Date().toISOString(),
      period
    }
    
  } catch (error) {
    console.error('❌ refreshAnalytics failed:', error.message)
    throw new Error(`Failed to refresh analytics: ${error.message}`)
  }
}

// 📈 Get analytics for specific date range
export const getAnalyticsByDateRange = async (startDate, endDate) => {
  try {
    console.log(`🔄 Fetching analytics for date range: ${startDate} to ${endDate}`)
    const config = {
      ...getAuthHeaders(),
      params: { startDate, endDate }
    }
    
    const response = await axios.get(`${API}/analytics/date-range`, config)
    
    console.log('✅ Date range analytics received')
    return response.data
    
  } catch (error) {
    console.error('❌ getAnalyticsByDateRange failed:', error.message)
    throw new Error(`Failed to fetch date range analytics: ${error.message}`)
  }
}

// 🎯 Get conversion analytics
export const getConversionAnalytics = async () => {
  try {
    console.log('🔄 Fetching conversion analytics...')
    const config = getAuthHeaders()
    const response = await axios.get(`${API}/analytics/conversions`, config)
    
    console.log('✅ Conversion analytics received')
    return response.data
    
  } catch (error) {
    console.error('❌ getConversionAnalytics failed:', error.message)
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
  
  if (!allValid) {
    console.warn('⚠️ Analytics data validation failed:', isValid)
  }
  
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
    console.log('🏥 Checking analytics service health...')
    
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
    
    console.log('🏥 Service health check result:', health)
    return health
    
  } catch (error) {
    console.error('❌ Service health check failed:', error)
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
    console.error('❌ Failed to fetch recent orders:', error)
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
    console.error('❌ Failed to fetch dashboard top products:', error)
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
