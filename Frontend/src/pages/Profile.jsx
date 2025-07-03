import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Orders from './Orders'

const Profile = () => {
  const { user } = useContext(AuthContext)

  if (!user) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 text-center text-gray-500">
        <h1 className="text-2xl font-bold mb-4">Not logged in</h1>
        <p>Please log in to view your profile.</p>
        <Link to="/login" className="text-indigo-600 underline mt-4 inline-block">Go to Login</Link>
      </div>
    )
  }

  if (user.isAdmin) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Admin Header with Badge */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
         <div className="flex items-center gap-5">
  <div className="bg-gradient-to-br from-blue-500 to-gray-700 p-3 rounded-xl shadow-md">
    <span className="material-icons text-4xl text-white">admin_panel_settings</span>
  </div>
  <div>
    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Administrator Dashboard</h1>
    <p className="text-sm text-gray-600 mt-1">Privileged access to system management</p>
  </div>
</div>

        <div className="bg-gradient-to-r from-blue-600 to-gray-700 text-white px-4 py-2 rounded-full text-sm font-medium shadow-md">
  Administrator Access
</div>

        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Profile Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Full Name</p>
                <p className="text-gray-800">{user.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Email Address</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Account Type</p>
                <p className="text-indigo-600 font-medium">Administrator</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">Login At</p>
                <p className="text-gray-800">
                  {new Date().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">ID: {user.id || 'ADM-' + Math.random().toString(36).substr(2, 8).toUpperCase()}</p>
          </div>
        </div>

        {/* Admin Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-5 rounded-r-lg mb-8">
          <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Administrator Notice</h3>
              <div className="mt-1 text-sm text-blue-700">
                <p>
                  Welcome back, <span className="font-semibold">{user.name}</span>. As an administrator, you have full access to all system management features. 
                  Please ensure you follow all security protocols when managing sensitive data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              to="/admin/dashboard" 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Dashboard</span>
              </div>
            </Link>
            <Link 
              to="/admin/products" 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Products</span>
              </div>
            </Link>
            <Link 
              to="/admin/orders" 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Orders</span>
              </div>
            </Link>
            <Link 
              to="/admin/users" 
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <span className="font-medium text-gray-800">Users</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Recent Activity (Placeholder) */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
              <p className="mt-1 text-sm text-gray-500">Your administrative actions will appear here.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Regular user profile remains the same
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">👤 My Profile</h1>
      <div className="bg-white shadow-md rounded-md p-4 mb-6 border">
        <p className="text-lg font-semibold">{user.name}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
      <h2 className="text-2xl font-semibold mb-3 mt-8">📦 Order History</h2>
      <Orders />
    </div>
  )
}

export default Profile