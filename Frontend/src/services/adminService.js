import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 🔐 Get all users (admin only)
export const fetchAllUsers = async () => {
  const res = await axios.get(`${API}/users`)
  return res.data
}

// 👑 Update user admin role
export const updateUserRole = async (userId, isAdmin) => {
  const res = await axios.put(
    `${API}/users/admin/users/${userId}`,
    { isAdmin }
  )
  return res.data
}

// 📊 Fetch admin dashboard stats
export const fetchAdminStats = async () => {
  const res = await axios.get(`${API}/users/admin/stats`)
  return res.data
}
