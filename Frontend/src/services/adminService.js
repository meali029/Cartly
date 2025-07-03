import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 🔐 Get all users (admin only)
export const fetchAllUsers = async (token) => {
  const res = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// 👑 Update user admin role
export const updateUserRole = async (userId, isAdmin, token) => {
  const res = await axios.put(
    `${API}/users/admin/users/${userId}`,
    { isAdmin },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}

// 📊 Fetch admin dashboard stats
export const fetchAdminStats = async (token) => {
  const res = await axios.get(`${API}/users/admin/stats`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
