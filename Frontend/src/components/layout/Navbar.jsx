import { Link, NavLink } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'

const Navbar = () => {
  const { user, logout } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext)

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to={user?.isAdmin ? "/admin/dashboard" : "/"}
          className="text-2xl font-bold text-indigo-600"
        >
          Cratly
        </Link>

        {/* NAV LINKS */}
        <nav className="space-x-6 hidden md:flex font-medium text-gray-700">
          {/* Show regular links only if not admin */}
          {!user?.isAdmin && (
            <>
              <NavLink to="/men" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Men</NavLink>
              <NavLink to="/women" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Women</NavLink>
              <NavLink to="/kids" className={({ isActive }) => isActive ? 'text-indigo-600' : ''}>Kids</NavLink>
            </>
          )}
          {/* Admin Links */}
          {user?.isAdmin && (
            <>
              <NavLink to="/admin/orders" className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`
              }>Manage Orders</NavLink>
              <NavLink to="/admin/products" className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`
              }>Manage Products</NavLink>
              <NavLink to="/admin/users" className={({ isActive }) =>
                `text-sm px-3 py-1 rounded-md ${isActive ? 'bg-indigo-600 text-white' : 'text-indigo-600 hover:bg-indigo-50'}`
              }>Manage Users</NavLink>
            </>
          )}
        </nav>

        {/* SEARCH + CART + USER */}
        <div className="flex items-center space-x-4">
          {/* Show search and cart only for non-admin users */}
          {!user?.isAdmin && (
            <>
              <input
                type="text"
                placeholder="Search..."
                className="hidden md:block px-3 py-1 border border-gray-300 rounded-md focus:outline-none"
              />
              <Link to="/cart" className="relative">
                <span className="material-icons text-gray-700">shopping_cart</span>
                {cartItems?.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </>
          )}
          {/* Auth Links */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link to="/profile" className="text-sm font-medium text-gray-700 hover:text-indigo-600">
                {user.name}
              </Link>
              <button onClick={logout} className="text-sm text-red-500 hover:underline">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="text-sm font-medium text-indigo-600 hover:underline">Login</Link>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
