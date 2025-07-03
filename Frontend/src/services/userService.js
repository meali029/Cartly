import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 👤 Get all users (admin only)
export const getAllUsers = async (token) => {
  const res = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// 🔁 Admin: Update user role (e.g. promote/demote admin)
export const updateUserRole = async (userId, isAdmin, token) => {
  const res = await axios.put(
    `${API}/admin/users/${userId}`,
    { isAdmin },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}

// 👤 Optional: Get current logged-in user profile
export const getUserProfile = async (token) => {
  const res = await axios.get(`${API}/users/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// ✏️ Optional: Update profile details (name, password)
export const updateUserProfile = async (profileData, token) => {
  const res = await axios.put(`${API}/users/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}
