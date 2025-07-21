import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { 
  getComprehensiveAnalytics, 
  refreshAnalytics, 
  checkServiceHealth,
  validateAnalyticsData,
  formatCurrency,
  formatNumber,
  formatPercentage
} from '../services/analyticsService'
import SalesChart from '../components/charts/SalesChart'
import CategoryChart from '../components/charts/CategoryChart'
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UsersIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  ShoppingCartIcon,
  ArchiveBoxIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

const Analytics = () => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('7days')
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [serviceHealth, setServiceHealth] = useState(null)
  const [dataErrors, setDataErrors] = useState([])

  useEffect(() => {
    fetchAnalytics()
    checkHealth()
  }, [selectedPeriod]) // eslint-disable-line react-hooks/exhaustive-deps

  const checkHealth = async () => {
    try {
      const health = await checkServiceHealth()
      setServiceHealth(health)
    } catch (error) {
      
      setServiceHealth({ status: 'unhealthy', error: error.message })
    }
  }

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      setDataErrors([])
    
      
      // Use the new comprehensive analytics function
      const result = await getComprehensiveAnalytics(selectedPeriod)
      
      // Validate the data structure
      const validation = validateAnalyticsData(result)
      if (!validation.isValid) {
       
        showToast('Some analytics data may be incomplete', 'warning')
      }
      
      // Set errors if any occurred
      if (result.errors && result.errors.length > 0) {
        setDataErrors(result.errors)
      }
      
      // Structure the data for the UI
      const analyticsData = {
        revenue: {
          total: result.summary?.revenue?.total || 0,
          growth: parseFloat(result.summary?.revenue?.growth) || 0
        },
        orders: {
          total: result.summary?.orders?.total || 0,
          pending: result.summary?.orders?.pending || 0,
          completed: result.summary?.orders?.completed || 0,
          cancelled: result.summary?.orders?.cancelled || 0,
          growth: parseFloat(result.summary?.orders?.growth) || 0
        },
        users: {
          total: result.summary?.users?.total || 0,
          active: result.summary?.users?.active || 0,
          new: result.summary?.users?.new || 0,
          growth: parseFloat(result.summary?.users?.growth) || 0
        },
        products: {
          total: result.summary?.products?.total || 0,
          inStock: result.summary?.products?.inStock || 0,
          outOfStock: result.summary?.products?.outOfStock || 0,
          lowStock: result.summary?.products?.lowStock || 0
        },
        topProducts: result.topProducts || [],
        sales: result.sales || { data: [], total: 0 },
        categories: result.categories || [],
        timestamp: result.timestamp,
        period: result.period
      }
      
    
      setAnalytics(analyticsData)
      setLastUpdated(new Date())
      
      if (dataErrors.length === 0) {
        showToast('Analytics data loaded successfully', 'success')
      }
      
    } catch (error) {
      showToast('Failed to load analytics data: ' + error.message, 'error')
      
      // Set empty data structure on complete failure
      setAnalytics({
        revenue: { total: 0, growth: 0 },
        orders: { total: 0, pending: 0, completed: 0, cancelled: 0, growth: 0 },
        users: { total: 0, active: 0, new: 0, growth: 0 },
        products: { total: 0, inStock: 0, outOfStock: 0, lowStock: 0 },
        topProducts: [],
        sales: { data: [], total: 0 },
        categories: [],
        timestamp: new Date().toISOString(),
        period: selectedPeriod
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = async () => {
    try {
      setLoading(true)
      
      const result = await refreshAnalytics(selectedPeriod)
      
      // Process the refreshed data same as fetchAnalytics
      const analyticsData = {
        revenue: {
          total: result.summary?.revenue?.total || 0,
          growth: parseFloat(result.summary?.revenue?.growth) || 0
        },
        orders: {
          total: result.summary?.orders?.total || 0,
          pending: result.summary?.orders?.pending || 0,
          completed: result.summary?.orders?.completed || 0,
          cancelled: result.summary?.orders?.cancelled || 0,
          growth: parseFloat(result.summary?.orders?.growth) || 0
        },
        users: {
          total: result.summary?.users?.total || 0,
          active: result.summary?.users?.active || 0,
          new: result.summary?.users?.new || 0,
          growth: parseFloat(result.summary?.users?.growth) || 0
        },
        products: {
          total: result.summary?.products?.total || 0,
          inStock: result.summary?.products?.inStock || 0,
          outOfStock: result.summary?.products?.outOfStock || 0,
          lowStock: result.summary?.products?.lowStock || 0
        },
        topProducts: result.topProducts || [],
        sales: result.sales || { data: [], total: 0 },
        categories: result.categories || [],
        timestamp: result.timestamp,
        period: result.period
      }
      
      setAnalytics(analyticsData)
      setLastUpdated(new Date())
      showToast('Analytics data refreshed successfully', 'success')
      
    } catch (error) {
      showToast('Failed to refresh analytics data: ' + error.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: IconComponent, growth, color = 'indigo' }) => ( // eslint-disable-line no-unused-vars
    <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-visible">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              {growth > 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span className={`text-sm ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(growth)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs last period</span>
            </div>
          )}
        </div>
        <div className={`hidden md:block absolute -top-5 -right-5 p-3 rounded-full shadow-lg z-10 ${color === 'green' ? 'bg-green-100' : color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : color === 'orange' ? 'bg-orange-100' : 'bg-indigo-100'}`}>
          <IconComponent className={`h-8 w-8 ${color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : color === 'orange' ? 'text-orange-600' : 'text-indigo-600'}`} />
        </div>
        <div className={`md:hidden p-3 rounded-full ${color === 'green' ? 'bg-green-100' : color === 'blue' ? 'bg-blue-100' : color === 'purple' ? 'bg-purple-100' : color === 'orange' ? 'bg-orange-100' : 'bg-indigo-100'}`}>
          <IconComponent className={`h-6 w-6 ${color === 'green' ? 'text-green-600' : color === 'blue' ? 'text-blue-600' : color === 'purple' ? 'text-purple-600' : color === 'orange' ? 'text-orange-600' : 'text-indigo-600'}`} />
        </div>
      </div>
    </div>
  )

  const formatCurrencyLocal = (amount) => {
    return formatCurrency(amount)
  }

  const formatNumberLocal = (num) => {
    return formatNumber(num)
  }

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="p-2 sm:p-4 md:p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <ChartBarIcon className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Analytics</h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:space-x-4">
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500">
            <CalendarDaysIcon className="h-4 w-4" />
            <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 text-xs sm:text-base"
          >
            <ArrowPathIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Service Health & Data Status */}
      {(serviceHealth?.status === 'unhealthy' || dataErrors.length > 0) && (
        <div className="mb-8">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Service Status</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  {serviceHealth?.status === 'unhealthy' && (
                    <p>Analytics service is experiencing issues. Some data may be unavailable.</p>
                  )}
                  {dataErrors.length > 0 && (
                    <div>
                      <p>Some data requests failed:</p>
                      <ul className="list-disc list-inside mt-1">
                        {dataErrors.map((error, index) => (
                          <li key={index} className="text-xs">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Period Selector */}
      <div className="mb-8">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">Period:</span>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-6 sm:mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-3 sm:gap-4">
            <button 
              onClick={() => navigate('/admin/orders')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-base"
            >
              <ShoppingCartIcon className="h-4 w-4" />
              <span>View All Orders</span>
            </button>
            <button 
              onClick={() => navigate('/admin/products')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-xs sm:text-base"
            >
              <ArchiveBoxIcon className="h-4 w-4" />
              <span>Manage Products</span>
            </button>
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-xs sm:text-base"
            >
              <UsersIcon className="h-4 w-4" />
              <span>View Users</span>
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrencyLocal(analytics.revenue.total)}
          icon={CurrencyDollarIcon}
          growth={analytics.revenue.growth}
          color="green"
        />
        <StatCard
          title="Total Orders"
          value={formatNumberLocal(analytics.orders.total)}
          icon={ShoppingBagIcon}
          growth={analytics.orders.growth}
          color="blue"
        />
        <StatCard
          title="Total Users"
          value={formatNumberLocal(analytics.users.total)}
          icon={UsersIcon}
          growth={analytics.users.growth}
          color="purple"
        />
        <StatCard
          title="Total Products"
          value={formatNumberLocal(analytics.products.total)}
          icon={ArchiveBoxIcon}
          color="orange"
        />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Avg Order Value */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-visible">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.orders.total > 0 ? formatCurrencyLocal(analytics.revenue.total / analytics.orders.total) : 'Rs 0'}
              </p>
            </div>
            <div className="hidden md:block absolute -top-5 -right-5 p-3 rounded-full shadow-lg z-10 bg-indigo-100">
              <CurrencyDollarIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="md:hidden p-3 rounded-full bg-indigo-100">
              <CurrencyDollarIcon className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-visible">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Conversion Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {analytics.users.total > 0 ? ((analytics.orders.total / analytics.users.total) * 100).toFixed(1) : '0'}%
              </p>
            </div>
            <div className="hidden md:block absolute -top-5 -right-5 p-3 rounded-full shadow-lg z-10 bg-yellow-100">
              <ChartBarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="md:hidden p-3 rounded-full bg-yellow-100">
              <ChartBarIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-visible">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Users</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumberLocal(analytics.users.active)}</p>
              <p className="text-sm text-gray-500">
                {analytics.users.total > 0 ? ((analytics.users.active / analytics.users.total) * 100).toFixed(1) : '0'}% of total
              </p>
            </div>
            <div className="hidden md:block absolute -top-5 -right-5 p-3 rounded-full shadow-lg z-10 bg-green-100">
              <UsersIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="md:hidden p-3 rounded-full bg-green-100">
              <UsersIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* New Users */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 relative overflow-visible">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">New Users</p>
              <p className="text-2xl font-semibold text-gray-900">{formatNumberLocal(analytics.users.new)}</p>
              <div className="flex items-center mt-2">
                <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600">{analytics.users.growth}%</span>
                <span className="text-sm text-gray-500 ml-1">this month</span>
              </div>
            </div>
            <div className="hidden md:block absolute -top-5 -right-5 p-3 rounded-full shadow-lg z-10 bg-purple-100">
              <UsersIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="md:hidden p-3 rounded-full bg-purple-100">
              <UsersIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Order Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            Order Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">Completed</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.orders.completed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Pending</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.orders.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-700">Cancelled</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.orders.cancelled}</span>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <UsersIcon className="h-5 w-5 mr-2" />
            User Statistics
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Total Users</span>
              <span className="text-sm font-medium text-gray-900">{formatNumberLocal(analytics.users.total)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Active Users</span>
              <span className="text-sm font-medium text-gray-900">{formatNumberLocal(analytics.users.active)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">New Users</span>
              <span className="text-sm font-medium text-gray-900">{formatNumberLocal(analytics.users.new)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts and Notifications */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Alerts & Notifications
          </h3>
          <div className="space-y-3">
            {analytics.products.lowStock > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Low Stock Alert</p>
                  <p className="text-sm text-yellow-700">
                    {analytics.products.lowStock} products are running low on stock
                  </p>
                </div>
              </div>
            )}
            {analytics.products.outOfStock > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-red-50 rounded-lg">
                <XCircleIcon className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium text-red-800">Out of Stock</p>
                  <p className="text-sm text-red-700">
                    {analytics.products.outOfStock} products are out of stock
                  </p>
                </div>
              </div>
            )}
            {analytics.orders.pending > 0 && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium text-blue-800">Pending Orders</p>
                  <p className="text-sm text-blue-700">
                    {analytics.orders.pending} orders are waiting for processing
                  </p>
                </div>
              </div>
            )}
            {analytics.products.lowStock === 0 && analytics.products.outOfStock === 0 && analytics.orders.pending === 0 && (
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium text-green-800">All Systems Normal</p>
                  <p className="text-sm text-green-700">
                    No urgent issues require attention
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Product Stock Status */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArchiveBoxIcon className="h-5 w-5 mr-2" />
            Product Stock Status
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircleIcon className="h-4 w-4 text-green-500" />
                <span className="text-sm text-gray-700">In Stock</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.products.inStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Low Stock</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.products.lowStock}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <XCircleIcon className="h-4 w-4 text-red-500" />
                <span className="text-sm text-gray-700">Out of Stock</span>
              </div>
              <span className="text-sm font-medium text-gray-900">{analytics.products.outOfStock}</span>
            </div>
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Category Performance
          </h3>
          {analytics.categories && analytics.categories.length > 0 ? (
            <CategoryChart categories={analytics.categories} />
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No category data available</p>
                <p className="text-gray-400 text-xs mt-1">Data will appear when orders are processed</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sales Chart */}
      <div className="mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
            Sales Trend ({selectedPeriod})
          </h3>
          {analytics.sales && analytics.sales.data && analytics.sales.data.length > 0 ? (
            <SalesChart 
              salesData={analytics.sales.data} 
              period={selectedPeriod} 
            />
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <ChartBarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">No sales data available for the selected period</p>
                <p className="text-gray-400 text-xs mt-1">Chart will appear when sales data is available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
          <ArrowTrendingUpIcon className="h-5 w-5 mr-2" />
          Top Performing Products
        </h3>
        {analytics.topProducts && analytics.topProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[400px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Product</th>
                  <th className="text-right py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Sales</th>
                  <th className="text-right py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm font-medium text-gray-700">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topProducts.map((product, index) => (
                  <tr key={product._id || product.id || index} className="border-b border-gray-100">
                    <td className="py-2 px-2 sm:py-3 sm:px-4">
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <div className="bg-indigo-100 text-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-xs sm:text-sm text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="text-right py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-900">{formatNumberLocal(product.sales)}</td>
                    <td className="text-right py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm text-gray-900">
                      {formatCurrencyLocal(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <ArchiveBoxIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No product performance data available</p>
            <p className="text-gray-400 text-xs mt-1">Data will appear when orders are processed</p>
          </div>
        )}
      </div>

      {/* Export and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
        <div className="flex flex-wrap gap-4">
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <DocumentTextIcon className="h-4 w-4" />
            <span>Export PDF Report</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <DocumentTextIcon className="h-4 w-4" />
            <span>Export CSV Data</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <DocumentTextIcon className="h-4 w-4" />
            <span>Schedule Report</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Analytics
