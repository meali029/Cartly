import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const cartContext = useContext(CartContext)
  const { cartItems } = cartContext || { cartItems: [] }

  // Don't render navbar for admin users since they have their own layout
  if (user?.isAdmin) {
    return null
  }

  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl border-b border-slate-700 sticky top-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={user?.isAdmin ? "/admin/dashboard" : "/"}
            className="group flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                Cartly
              </h1>
              <p className="text-xs text-gray-400 -mt-1">Premium Shopping</p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-8">
            <NavLink to="/men" className={({ isActive }) => 
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`
            }>
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-all">
                <span className="text-lg">👔</span>
              </div>
              <div>
                <span className="font-medium">Men</span>
                <p className="text-xs opacity-75">Fashion</p>
              </div>
            </NavLink>
            <NavLink to="/women" className={({ isActive }) => 
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`
            }>
              <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center group-hover:bg-pink-500/30 transition-all">
                <span className="text-lg">👗</span>
              </div>
              <div>
                <span className="font-medium">Women</span>
                <p className="text-xs opacity-75">Collection</p>
              </div>
            </NavLink>
            <NavLink to="/kids" className={({ isActive }) => 
              `group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive 
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg' 
                  : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
              }`
            }>
              <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center group-hover:bg-emerald-500/30 transition-all">
                <span className="text-lg">🧒</span>
              </div>
              <div>
                <span className="font-medium">Kids</span>
                <p className="text-xs opacity-75">Wear</p>
              </div>
            </NavLink>
          </nav>

          {/* RIGHT SIDE - SEARCH + CART + USER */}
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative group">
              <div className="absolute left-4 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
                <span className="text-lg">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-12 pr-4 py-3 w-64 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>
            <Link to="/cart" className="relative group">
              <div className="p-3 bg-slate-700/50 rounded-xl border border-slate-600 hover:bg-slate-600/50 transition-all duration-300 group-hover:scale-105">
                <span className="text-xl text-gray-300 group-hover:text-white">🛒</span>
              </div>
              {cartItems?.length > 0 && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-white text-xs font-bold">
                    {cartItems.length > 99 ? '99+' : cartItems.length}
                  </span>
                </div>
              )}
            </Link>
            
            {/* Auth Links */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link 
                  to="/profile" 
                  className="group flex items-center gap-3 px-4 py-3 bg-slate-700/50 rounded-xl border border-slate-600 hover:bg-slate-600/50 transition-all duration-300"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                    <span className="text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || '👤'}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {user.name}
                    </span>
                    <p className="text-xs text-gray-400">Customer</p>
                  </div>
                </Link>
                <button 
                  onClick={logout} 
                  className="group flex items-center gap-2 px-4 py-3 bg-red-500/20 text-red-400 rounded-xl border border-red-500/30 hover:bg-red-500/30 hover:text-red-300 transition-all duration-300"
                >
                  <span className="text-lg">🚪</span>
                  <span className="text-sm font-medium hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link 
                to="/login" 
                className="group flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg">🔐</span>
                <span className="font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
