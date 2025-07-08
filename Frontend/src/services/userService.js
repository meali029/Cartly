import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 👤 Get all users (admin only)
export const getAllUsers = async () => {
  const res = await axios.get(`${API}/users`)
  return res.data
}

// 🔁 Admin: Update user role (e.g. promote/demote admin)
export const updateUserRole = async (userId, isAdmin) => {
  const res = await axios.put(
    `${API}/admin/users/${userId}`,
    { isAdmin }
  )
  return res.data
}

// 👤 Optional: Get current logged-in user profile
export const getUserProfile = async () => {
  const res = await axios.get(`${API}/users/profile`)
  return res.data
}

// ✏️ Optional: Update profile details (name, password)
export const updateUserProfile = async (profileData) => {
  const res = await axios.put(`${API}/users/profile`, profileData)
  return res.data
}
