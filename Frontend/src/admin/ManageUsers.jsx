import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchAllUsers, updateUserRole } from '../services/adminService'
import Badge from '../components/ui/Badge'
import { 
  UserGroupIcon,
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowPathIcon,
  CalendarDaysIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline'

const ManageUsers = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllUsers()
      // Sort users - admins first, then by name
      const sortedUsers = data.sort((a, b) => {
        if (a.isAdmin && !b.isAdmin) return -1
        if (!a.isAdmin && b.isAdmin) return 1
        return a.name.localeCompare(b.name)
      })
      setUsers(sortedUsers)
      setLastUpdated(new Date())
    } catch (err) {
      showToast('Could not load users', err)
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (user?.isAdmin) loadUsers()
  }, [user, loadUsers])

  const handleRefresh = async () => {
    showToast('Refreshing users...', 'info')
    await loadUsers()
    showToast('Users refreshed successfully', 'success')
  }

  const toggleRole = async (id, currentRole, userName) => {
    const action = currentRole ? 'revoke admin privileges from' : 'grant admin privileges to'
    if (!confirm(`Are you sure you want to ${action} "${userName}"?`)) return

    try {
      await updateUserRole(id, !currentRole)
      showToast(`User role updated successfully`, 'success')
      loadUsers()
    } catch (err) {
      showToast('Failed to update role', err)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <UserGroupIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Users
              {users.length > 0 && (
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({users.length})
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Users List */}
      {loading && users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading users...</h3>
          <p className="text-gray-500">Please wait while we fetch user accounts.</p>
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">User accounts will appear here when they register.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center">
                <ArrowPathIcon className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
                <span className="text-sm text-blue-800">Refreshing users...</span>
              </div>
            </div>
          )}
          
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>User</span>
                    </div>
                  </th>
                  <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <ShieldCheckIcon className="h-4 w-4" />
                      <span>Role</span>
                    </div>
                  </th>
                  <th className="w-1/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Joined</span>
                    </div>
                  </th>
                  <th className="w-1/5 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((userItem) => (
                  <tr key={userItem._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {userItem.name}
                            {userItem._id === user._id && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">(You)</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {userItem.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        text={userItem.isAdmin ? 'Admin' : 'User'}
                        color={userItem.isAdmin ? 'purple' : 'gray'}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {userItem._id === user._id ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-gray-800 bg-gray-100">
                          <IdentificationIcon className="h-3 w-3 mr-1" />
                          Current User
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleRole(userItem._id, userItem.isAdmin, userItem.name)}
                          className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md ${
                            userItem.isAdmin
                              ? 'text-red-700 bg-red-100 hover:bg-red-200'
                              : 'text-green-700 bg-green-100 hover:bg-green-200'
                          }`}
                        >
                          {userItem.isAdmin ? (
                            <>
                              <UserMinusIcon className="h-3 w-3 mr-1" />
                              Revoke Admin
                            </>
                          ) : (
                            <>
                              <UserPlusIcon className="h-3 w-3 mr-1" />
                              Make Admin
                            </>
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {users.map((userItem) => (
                <div key={userItem._id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <UserIcon className="h-6 w-6 text-gray-500" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900">
                            {userItem.name}
                            {userItem._id === user._id && (
                              <span className="ml-2 text-xs text-blue-600 font-normal">(You)</span>
                            )}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {userItem.email}
                          </p>
                          <div className="mt-1 flex items-center space-x-4">
                            <Badge
                              text={userItem.isAdmin ? 'Admin' : 'User'}
                              color={userItem.isAdmin ? 'purple' : 'gray'}
                            />
                            <span className="text-xs text-gray-500">
                              Joined: {userItem.createdAt ? new Date(userItem.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          {userItem._id === user._id ? (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-gray-800 bg-gray-100">
                              <IdentificationIcon className="h-3 w-3 mr-1" />
                              You
                            </span>
                          ) : (
                            <button
                              onClick={() => toggleRole(userItem._id, userItem.isAdmin, userItem.name)}
                              className={`inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded ${
                                userItem.isAdmin
                                  ? 'text-red-700 bg-red-100 hover:bg-red-200'
                                  : 'text-green-700 bg-green-100 hover:bg-green-200'
                              }`}
                            >
                              {userItem.isAdmin ? (
                                <>
                                  <UserMinusIcon className="h-3 w-3 mr-1" />
                                  Revoke
                                </>
                              ) : (
                                <>
                                  <UserPlusIcon className="h-3 w-3 mr-1" />
                                  Promote
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
