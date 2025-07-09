import { useContext, useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'
import { 
  HomeIcon, 
  ShoppingBagIcon, 
  UserGroupIcon, 
  ClipboardDocumentListIcon,
  PlusIcon,
  ChartBarIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import { Outlet } from 'react-router-dom'

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Add admin-layout class to body on mount, remove on unmount
  useEffect(() => {
    document.body.classList.add('admin-layout')
    return () => {
      document.body.classList.remove('admin-layout')
    }
  }, [])

  if (!user?.isAdmin) {
    return null
  }

  const sidebarItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon, color: 'blue' },
    { name: 'Orders', href: '/admin/orders', icon: ClipboardDocumentListIcon, color: 'green' },
    { name: 'Products', href: '/admin/products', icon: ShoppingBagIcon, color: 'purple' },
    { name: 'Add Product', href: '/admin/add-product', icon: PlusIcon, color: 'indigo' },
    { name: 'Users', href: '/admin/users', icon: UserGroupIcon, color: 'pink' },
    { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon, color: 'orange' },
    { name: 'Settings', href: '/admin/settings', icon: CogIcon, color: 'gray' },
  ]

  const getColorClasses = (color, isActive) => {
    const colorMap = {
      blue: isActive ? 'bg-blue-100 text-blue-700 border-blue-500' : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700',
      green: isActive ? 'bg-green-100 text-green-700 border-green-500' : 'text-gray-600 hover:bg-green-50 hover:text-green-700',
      purple: isActive ? 'bg-purple-100 text-purple-700 border-purple-500' : 'text-gray-600 hover:bg-purple-50 hover:text-purple-700',
      indigo: isActive ? 'bg-indigo-100 text-indigo-700 border-indigo-500' : 'text-gray-600 hover:bg-indigo-50 hover:text-indigo-700',
      pink: isActive ? 'bg-pink-100 text-pink-700 border-pink-500' : 'text-gray-600 hover:bg-pink-50 hover:text-pink-700',
      orange: isActive ? 'bg-orange-100 text-orange-700 border-orange-500' : 'text-gray-600 hover:bg-orange-50 hover:text-orange-700',
      gray: isActive ? 'bg-gray-100 text-gray-700 border-gray-500' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-700',
    }
    return colorMap[color] || colorMap.gray
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Professional Vertical Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200 flex flex-col`}>
        {/* Header */}
        <div className="h-16 px-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 flex items-center justify-between flex-shrink-0">
          <Link to="/admin/dashboard" className="flex items-center group">
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-indigo-600 font-bold text-xl">C</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white"></div>
            </div>
            <div className="ml-4">
              <h1 className="text-xl font-bold text-white">Cartly</h1>
              <p className="text-sm text-indigo-200">Admin Panel</p>
            </div>
          </Link>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
          {sidebarItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              className={({ isActive }) =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 border-l-4 ${
                  isActive
                    ? `${getColorClasses(item.color, true)} shadow-md`
                    : `border-transparent ${getColorClasses(item.color, false)}`
                }`
              }
            >
              <div className="relative">
                <item.icon className="mr-4 h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-10 rounded-full transition-opacity"></div>
              </div>
              <span className="flex-1">{item.name}</span>
              {item.name === 'Orders' && (
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile Section - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {user.name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <div className="ml-3 min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-4 w-4" />
              </button>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Top Bar for Mobile */}
        <div className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg mr-3">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <h1 className="text-lg font-bold text-gray-900">Cartly Admin</h1>
            </div>
            <div className="w-10"></div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default AdminLayout
