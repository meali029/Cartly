import { Link, NavLink } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'
import { useChatNotifications } from '../../context/ChatNotificationContext'
import {
  MagnifyingGlassIcon,
  ShoppingCartIcon,
  UserIcon,
  LockClosedIcon,
  Bars3Icon,
  XMarkIcon,
  UserGroupIcon,
  HeartIcon,
  SparklesIcon,
  ChatBubbleLeftRightIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const Navbar = ({ onOpenAuth }) => {
  const { user } = useContext(AuthContext)
  const cartContext = useContext(CartContext)
  const { cartItems } = cartContext || { cartItems: [] }
  const { unreadCount: chatUnreadCount, clearNotifications } = useChatNotifications()
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Navigation data
  const navigationLinks = [
    {
      id: 'men',
      name: 'Men',
      path: '/men',
      subtitle: 'Fashion',
      icon: UserGroupIcon,
      gradient: 'from-slate-600 to-slate-800',
      bgColor: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100'
    },
    {
      id: 'women',
      name: 'Women',
      path: '/women',
      subtitle: 'Collection',
      icon: HeartIcon,
      gradient: 'from-slate-600 to-slate-800',
      bgColor: 'bg-slate-50',
      hoverBg: 'hover:bg-slate-100'
    },
    {
      id: 'kids',
      name: 'Kids',
      path: '/kids',
      subtitle: 'Wear',
      icon: SparklesIcon,
      gradient: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      hoverBg: 'hover:bg-emerald-100'
    }
  ]

  // Brand data
  const brand = {
    name: 'Cartly',
    tagline: 'Premium Shopping',
    logo: 'https://www.logoground.com/uploads/2018191292018-07-284631561C-Cart-logo.jpg'
  }

  // Don't render navbar for admin users since they have their own layout
  if (user?.isAdmin) {
    return null
  }

  return (
    <>
      <header className="bg-white shadow-xl border-b border-slate-200 fixed top-0 left-0 right-0 z-50 backdrop-blur-lg">
      <div className="container mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <Link
            to={user?.isAdmin ? "/admin/dashboard" : "/"}
            className="group flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105 overflow-hidden">
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-10 h-10 object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-bold text-slate-800">
                {brand.name}
              </h1>
              <p className="text-xs text-slate-500 -mt-1">{brand.tagline}</p>
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navigationLinks.map((link) => (
              <NavLink 
                key={link.id}
                to={link.path} 
                className={({ isActive }) => 
                  `group flex items-center gap-3 px-4 py-2 rounded-xl transition-all duration-300 hover:scale-105 transform ${
                    isActive 
                      ? `bg-gradient-to-r ${link.gradient} text-white shadow-xl` 
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`
                }
              >
                <div className={`w-8 h-8 ${link.bgColor} rounded-xl flex items-center justify-center ${link.hoverBg} transition-all`}>
                  <link.icon className="h-4 w-4 text-slate-600" />
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
              className="lg:hidden p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>

            {/* Desktop Search */}
            {/* <div className="hidden md:flex items-center relative group">
              <div className="absolute left-3 text-slate-400 group-focus-within:text-slate-500 transition-colors">
                <MagnifyingGlassIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-60 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 hover:shadow-lg focus:shadow-xl"
              />
            </div> */}
          
<div className="hidden md:flex items-center">
  <span className="bg-gradient-to-r from-red-500 to-red-400 text-white font-bold px-4 py-2 rounded-xl shadow-lg text-base tracking-wide border-2 border-white ring-2 ring-pink-200 flex items-center gap-2">
    <TagIcon className="h-5 w-5 text-white" />
    20% OFF Today!
  </span>
</div>


            {/* Chat Support */}
            {user && (
              <Link 
                to="/chat" 
                className="group relative"
                onClick={clearNotifications}
              >
                <div className="p-2 bg-blue-50 rounded-xl border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
                </div>
                {chatUnreadCount > 0 && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
                    <span className="text-white text-xs font-bold">
                      {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Chat Support
                  {chatUnreadCount > 0 && (
                    <span className="ml-1 px-1 bg-red-500 rounded-full text-xs">
                      {chatUnreadCount}
                    </span>
                  )}
                </div>
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative group">
              <div className="p-2 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300 group-hover:scale-105 shadow-lg hover:shadow-xl">
                <ShoppingCartIcon className="h-5 w-5 text-slate-600 group-hover:text-slate-800" />
              </div>
              {cartItems?.length > 0 && (
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
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
                className="group flex items-center gap-3 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                  {user.name?.charAt(0)?.toUpperCase() ? (
                    <span className="text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  ) : (
                    <UserIcon className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                    {user.name}
                  </span>
                  <p className="text-xs text-slate-500">Customer</p>
                </div>
              </Link>
            ) : (
              <button 
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-xl shadow-xl hover:from-slate-700 hover:to-slate-900 hover:shadow-2xl transition-all duration-300 hover:scale-105"
              >
                <LockClosedIcon className="h-4 w-4" />
                <span className="font-medium text-sm">Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <div className="absolute left-3 top-3 text-slate-400">
                  <MagnifyingGlassIcon className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
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
                      `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 hover:scale-105 transform ${
                        isActive
                          ? `bg-gradient-to-r ${link.gradient} text-white shadow-xl`
                          : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <div className={`w-8 h-8 ${link.bgColor} rounded-xl flex items-center justify-center ${link.hoverBg} transition-all`}>
                      <link.icon className="h-4 w-4 text-slate-600" />
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
                <div className="pt-4 border-t border-slate-200 space-y-2">
                  <Link 
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 transition-all duration-300 hover:scale-105 transform"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg">
                      {user.name?.charAt(0)?.toUpperCase() ? (
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <UserIcon className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">{user.name}</span>
                      <p className="text-xs text-slate-500">View Profile</p>
                    </div>
                  </Link>

                  <Link 
                    to="/chat"
                    onClick={() => {
                      setIsMobileMenuOpen(false)
                      clearNotifications()
                    }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 transition-all duration-300 hover:scale-105 transform relative"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg relative">
                      <ChatBubbleLeftRightIcon className="h-4 w-4 text-white" />
                      {chatUnreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-slate-700">
                        Chat Support
                        {chatUnreadCount > 0 && (
                          <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                            {chatUnreadCount} new
                          </span>
                        )}
                      </span>
                      <p className="text-xs text-slate-500">Get help instantly</p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      </header>
      {/* Add space below navbar */}
      <div style={{ height: '80px' }} />
    </>
  )
}

export default Navbar
