import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchAllUsers, updateUserRole } from '../services/adminService'
import Badge from '../components/ui/Badge'

const ManageUsers = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchAllUsers()
      setUsers(data)
    } catch (err) {
      console.error('❌ Failed to load users:', err)
      showToast('Could not load users', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (user?.isAdmin) loadUsers()
  }, [user, loadUsers])

  const toggleRole = async (id, currentRole) => {
    try {
      await updateUserRole(id, !currentRole)
      showToast('✅ Role updated')
      loadUsers()
    } catch (err) {
      console.error('❌ Failed to update role:', err)
      showToast('Failed to update role', 'error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">👥 Manage Users</h1>

      {loading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border rounded-md">
            <thead className="bg-gray-100 text-sm text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    <Badge
                      text={u.isAdmin ? 'Admin' : 'User'}
                      color={u.isAdmin ? 'purple' : 'gray'}
                    />
                  </td>
                  <td className="p-3 text-right">
                    {u._id === user._id ? (
                      <span className="text-xs text-gray-400">This is you</span>
                    ) : (
                      <button
                        onClick={() => toggleRole(u._id, u.isAdmin)}
                        className="text-indigo-600 hover:underline text-sm"
                      >
                        {u.isAdmin ? 'Revoke Admin' : 'Make Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageUsers
