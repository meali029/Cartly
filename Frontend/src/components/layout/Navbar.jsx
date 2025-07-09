import { Link, NavLink } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  LockClosedIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Navbar = () => {
  const { user } = useContext(AuthContext)
  const cartContext = useContext(CartContext)
  const { cartItems } = cartContext || { cartItems: [] }
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation data
  const navigationLinks = [
    {
      id: 'men',
      name: 'Men',
      path: '/men',
      subtitle: 'Fashion',
      icon: UserGroupIcon,
      gradient: 'from-indigo-500 to-purple-600',
      bgColor: 'bg-indigo-50',
      hoverBg: 'hover:bg-indigo-100'
    },
    {
      id: 'women',
      name: 'Women',
      path: '/women',
      subtitle: 'Collection',
      icon: HeartIcon,
      gradient: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      hoverBg: 'hover:bg-pink-100'
    },
    {
      id: 'kids',
      name: 'Kids',
      path: '/kids',
      subtitle: 'Wear',
      icon: SparklesIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-100'
    }
  ]

  // Brand data
  const brand = {
    name: 'Cartly',
    tagline: 'Premium Shopping',
    logo: 'C'
  }

  // Don't render navbar for admin users since they have their own layout
  if (user?.isAdmin) {
    return null
  }

  return (
    <header className="bg-white shadow-lg border-b border-gray-200 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={user?.isAdmin ? "/admin/dashboard" : "/"}
            className="group flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                <span className="text-white font-bold text-lg">{brand.logo}</span>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-gray-800">
                {brand.name}
              </h1>
              <p className="text-xs text-gray-500 -mt-1">{brand.tagline}</p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <NavLink 
                key={link.id}
                to={link.path} 
                className={({ isActive }) => 
                  `group flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? `bg-gradient-to-r ${link.gradient} text-white shadow-md` 
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`
                }
              >
                <div className={`w-8 h-8 ${link.bgColor} rounded-lg flex items-center justify-center ${link.hoverBg} transition-all`}>
                  <link.icon className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <span className="font-medium text-sm">{link.name}</span>
                  <p className="text-xs opacity-75">{link.subtitle}</p>
                </div>
              </NavLink>
            ))}
          </nav>

          {/* RIGHT SIDE - SEARCH + CART + USER */}
          <div className="flex items-center space-x-3">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>

            {/* Desktop Search */}
            <div className="hidden md:flex items-center relative group">
              <div className="absolute left-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-60 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
              />
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300 group-hover:scale-105">
                <ShoppingCartIcon className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
              </div>
              {cartItems?.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md">
                  <span className="text-white text-xs font-bold">
                    {cartItems.length > 99 ? '99+' : cartItems.length}
                  </span>
                </div>
              )}
            </Link>
            
            {/* Auth Links */}
            {user ? (
              <Link 
                to="/profile" 
                className="group flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-all duration-300"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                  {user.name?.charAt(0)?.toUpperCase() ? (
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
                    {user.name}
                  </span>
                  <p className="text-xs text-gray-500">Customer</p>
                </div>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <LockClosedIcon className="h-4 w-4" />
                <span className="font-medium text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                {navigationLinks.map((link) => (
                  <NavLink
                    key={link.id}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        isActive
                          ? `bg-gradient-to-r ${link.gradient} text-white shadow-md`
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }`
                    }
                  >
                    <div className={`w-8 h-8 ${link.bgColor} rounded-lg flex items-center justify-center ${link.hoverBg} transition-all`}>
                      <link.icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <span className="font-medium text-sm">{link.name}</span>
                      <p className="text-xs opacity-75">{link.subtitle}</p>
                    </div>
                  </NavLink>
                ))}
              </div>

              {/* Mobile Auth Section */}
              {user && (
                <div className="pt-4 border-t border-gray-200">
                  <Link 
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
                      {user.name?.charAt(0)?.toUpperCase() ? (
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                      <p className="text-xs text-gray-500">View Profile</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
