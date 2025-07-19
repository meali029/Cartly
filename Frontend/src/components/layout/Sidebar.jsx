import { NavLink } from 'react-router-dom'
import { useChatNotifications } from '../../context/ChatNotificationContext'

const Sidebar = () => {
  const { adminUnreadCount } = useChatNotifications()
  return (
    <aside className="w-full md:w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 border-r border-slate-700 shadow-2xl h-full">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">⚡</span>
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Admin Panel
            </h2>
            <p className="text-xs text-gray-400">Management Dashboard</p>
          </div>
        </div>
        <div className="w-full h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 rounded-full"></div>
      </div>

      {/* Navigation Section */}
      <nav className="p-6 space-y-3">
        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => 
              `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/25' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`
            }
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
              'bg-blue-500/20 group-hover:bg-blue-500/30'
            }`}>
              <span className="text-lg">📊</span>
            </div>
            <div className="flex-1">
              <span className="font-medium">Dashboard</span>
              <p className="text-xs opacity-75">Overview & Analytics</p>
            </div>
          </NavLink>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Store Management
          </h3>
          
          <div className="space-y-2">
            <NavLink 
              to="/admin/products" 
              className={({ isActive }) => 
                `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'bg-violet-500/20 group-hover:bg-violet-500/30'
              }`}>
                <span className="text-lg">🛍️</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Products</span>
                <p className="text-xs opacity-75">Inventory & Catalog</p>
              </div>
            </NavLink>

            <NavLink 
              to="/admin/orders" 
              className={({ isActive }) => 
                `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'bg-emerald-500/20 group-hover:bg-emerald-500/30'
              }`}>
                <span className="text-lg">📦</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Orders</span>
                <p className="text-xs opacity-75">Sales & Fulfillment</p>
              </div>
            </NavLink>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
            User Management
          </h3>
          
          <div className="space-y-2">
            <NavLink 
              to="/admin/users" 
              className={({ isActive }) => 
                `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg shadow-rose-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'bg-rose-500/20 group-hover:bg-rose-500/30'
              }`}>
                <span className="text-lg">👥</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Users</span>
                <p className="text-xs opacity-75">Customer Management</p>
              </div>
            </NavLink>

            <NavLink 
              to="/admin/chats" 
              className={({ isActive }) => 
                `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 relative ${
                  isActive 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-600 text-white shadow-lg shadow-purple-500/25' 
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`
              }
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300 ${
                'bg-purple-500/20 group-hover:bg-purple-500/30'
              }`}>
                <span className="text-lg">💬</span>
              </div>
              <div className="flex-1">
                <span className="font-medium">Live Chats</span>
                <p className="text-xs opacity-75">Customer Support</p>
              </div>
              {adminUnreadCount > 0 && (
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  <span className="text-white text-xs font-bold">
                    {adminUnreadCount > 99 ? '99+' : adminUnreadCount}
                  </span>
                </div>
              )}
            </NavLink>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Quick Stats</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Total Orders</span>
              <span className="text-emerald-400 font-medium">1,234</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Active Users</span>
              <span className="text-blue-400 font-medium">856</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Products</span>
              <span className="text-violet-400 font-medium">432</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-400 font-medium">System Online</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">All services operational</p>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
