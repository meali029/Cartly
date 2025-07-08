import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchAdminStats } from '../services/adminService'
import { 
  UserGroupIcon, 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const data = await fetchAdminStats()
        setStats({
          users: data.totalUsers,
          orders: data.totalOrders,
          products: data.totalProducts,
          revenue: data.totalSales,
        })
      } catch (err) {
        console.error('❌ Failed to load admin stats:', err)
        showToast('Admin stats failed to load', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user?.isAdmin) loadStats()
  }, [user, showToast])

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users,
      icon: UserGroupIcon,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12.5%',
      changeType: 'positive',
      link: '/admin/users'
    },
    {
      title: 'Total Orders',
      value: stats.orders,
      icon: ClipboardDocumentListIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+8.2%',
      changeType: 'positive',
      link: '/admin/orders'
    },
    {
      title: 'Total Products',
      value: stats.products,
      icon: ShoppingBagIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+3.1%',
      changeType: 'positive',
      link: '/admin/products'
    },
    {
      title: 'Total Revenue',
      value: `PKR ${Number(stats.revenue).toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: '+15.8%',
      changeType: 'positive',
      link: '/admin/analytics'
    }
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="w-16 h-4 bg-gray-200 rounded"></div>
              </div>
              <div className="mt-4 w-20 h-8 bg-gray-200 rounded"></div>
              <div className="mt-2 w-24 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            <EyeIcon className="h-4 w-4 mr-2" />
            View Reports
          </button>
          <Link
            to="/admin/analytics"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
            Analytics
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <ClipboardDocumentListIcon className="h-5 w-5 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Order #100{index + 1}</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">PKR 2,500</p>
                    <p className="text-xs text-green-600">Completed</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/admin/orders"
                className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
              >
                View all orders →
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Top Products</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Product {index + 1}</p>
                      <p className="text-xs text-gray-500">45 sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">PKR 1,200</p>
                    <p className="text-xs text-gray-500">In stock</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/admin/products"
                className="text-sm text-indigo-600 hover:text-indigo-900 font-medium"
              >
                View all products →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, icon: Icon, color, bgColor, textColor, change, changeType, link }) => {
  const ChangeIcon = changeType === 'positive' ? ArrowTrendingUpIcon : ArrowTrendingDownIcon
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600'

  return (
    <Link to={link} className="block">
      <div className={`${bgColor} rounded-lg p-6 hover:shadow-md transition-shadow duration-200`}>
        <div className="flex items-center justify-between">
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <div className={`flex items-center space-x-1 ${changeColor}`}>
            <ChangeIcon className="h-4 w-4" />
            <span className="text-sm font-medium">{change}</span>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-500">{title}</h3>
          <p className={`text-2xl font-bold ${textColor} mt-1`}>{value}</p>
        </div>
      </div>
    </Link>
  )
}

export default AdminDashboard
