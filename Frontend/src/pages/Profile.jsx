import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Orders from './Orders'
import { 
  UserCircleIcon, 
  CogIcon, 
  ShieldCheckIcon, 
  ClockIcon, 
  IdentificationIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  ArrowRightIcon,
  ChartBarIcon,
  CubeIcon,
  DocumentTextIcon,
  UsersIcon,
  StarIcon,
  BellIcon
} from '@heroicons/react/24/outline'

const Profile = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
              <UserCircleIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Access Required</h1>
            <p className="text-gray-600 mb-6">Please log in to view your profile and manage your account.</p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Go to Login
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (user.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Admin Header */}
          <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/90 to-purple-600/90"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                    <ShieldCheckIcon className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                      Administrator Dashboard
                    </h1>
                    <p className="text-indigo-100 text-lg">
                      Welcome back, <span className="font-semibold">{user.name}</span>
                    </p>
                  </div>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  <span className="text-white font-medium text-sm">
                    🛡️ Admin Access
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-indigo-50 px-6 py-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <IdentificationIcon className="w-5 h-5 text-indigo-600" />
                    Profile Information
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <UserCircleIcon className="w-4 h-4" />
                        Full Name
                      </div>
                      <p className="text-gray-900 font-medium">{user.name}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <EnvelopeIcon className="w-4 h-4" />
                        Email Address
                      </div>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <ShieldCheckIcon className="w-4 h-4" />
                        Account Type
                      </div>
                      <span className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                        <StarIcon className="w-3 h-3" />
                        Administrator
                      </span>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <CalendarDaysIcon className="w-4 h-4" />
                        Last Login
                      </div>
                      <p className="text-gray-900">
                        {new Date().toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <ClockIcon className="w-3 h-3" />
                    Admin ID: {user.id || 'ADM-' + Math.random().toString(36).substr(2, 8).toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CogIcon className="w-5 h-5 text-indigo-600" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Link 
                    to="/admin/dashboard" 
                    className="group bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 hover:from-blue-100 hover:to-indigo-100 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <ChartBarIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Dashboard</span>
                        <p className="text-xs text-gray-600">Analytics & Overview</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/admin/products" 
                    className="group bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 hover:from-green-100 hover:to-emerald-100 hover:border-emerald-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-green-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <CubeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Products</span>
                        <p className="text-xs text-gray-600">Manage Inventory</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/admin/orders" 
                    className="group bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-4 hover:from-orange-100 hover:to-amber-100 hover:border-amber-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <DocumentTextIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Orders</span>
                        <p className="text-xs text-gray-600">Order Management</p>
                      </div>
                    </div>
                  </Link>
                  
                  <Link 
                    to="/admin/users" 
                    className="group bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl p-4 hover:from-purple-100 hover:to-violet-100 hover:border-violet-300 transition-all duration-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-500 p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <UsersIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="font-medium text-gray-900">Users</span>
                        <p className="text-xs text-gray-600">User Management</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* System Status */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BellIcon className="w-5 h-5 text-green-600" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Server Status</span>
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Online
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Database</span>
                    <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Connected
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Last Backup</span>
                    <span className="text-gray-900 text-sm">2 hours ago</span>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">System login detected</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">Database backup completed</p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">New order processed</p>
                      <p className="text-xs text-gray-500">4 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-amber-800 mb-1">Security Notice</h3>
                    <p className="text-sm text-amber-700">
                      As an administrator, ensure you follow security protocols when accessing sensitive data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular user profile
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full transform -translate-x-24 translate-y-24"></div>
          
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
                <UserCircleIcon className="w-16 h-16 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-blue-100 text-lg">
                  Manage your account and track your orders
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <IdentificationIcon className="w-5 h-5 text-blue-600" />
                  Profile Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <UserCircleIcon className="w-4 h-4" />
                      Full Name
                    </div>
                    <p className="text-gray-900 font-medium text-lg">{user.name}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <EnvelopeIcon className="w-4 h-4" />
                      Email Address
                    </div>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <ShieldCheckIcon className="w-4 h-4" />
                      Account Type
                    </div>
                    <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      <UserCircleIcon className="w-3 h-3" />
                      Customer
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4" />
                      Member Since
                    </div>
                    <p className="text-gray-900">
                      {new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                  <DocumentTextIcon className="w-5 h-5 text-blue-600" />
                  Order History
                </h2>
              </div>
              <div className="p-6">
                <Orders />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Shopping Tips */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <StarIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800 mb-1">Shopping Tips</h3>
                  <p className="text-sm text-blue-700">
                    Get free shipping on orders over PKR 5,000. Add more items to your cart to qualify!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile