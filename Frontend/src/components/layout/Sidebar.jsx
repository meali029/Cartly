import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 p-5 shadow-sm h-full">
      <h2 className="text-xl font-bold text-indigo-600 mb-6">Admin Panel</h2>

      <nav className="flex flex-col space-y-3 text-sm font-medium text-gray-700">
        <NavLink 
          to="/admin/dashboard" 
          className={({ isActive }) => isActive ? 'text-indigo-600' : 'hover:text-indigo-500'}>
          📊 Dashboard
        </NavLink>

        <NavLink 
          to="/admin/products" 
          className={({ isActive }) => isActive ? 'text-indigo-600' : 'hover:text-indigo-500'}>
          🛍️ Manage Products
        </NavLink>

        <NavLink 
          to="/admin/orders" 
          className={({ isActive }) => isActive ? 'text-indigo-600' : 'hover:text-indigo-500'}>
          📦 Manage Orders
        </NavLink>

        <NavLink 
          to="/admin/users" 
          className={({ isActive }) => isActive ? 'text-indigo-600' : 'hover:text-indigo-500'}>
          👤 Manage Users
        </NavLink>
      </nav>
    </aside>
  )
}

export default Sidebar
