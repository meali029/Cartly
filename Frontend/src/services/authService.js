import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 📝 Register a new user
export const registerUser = async (userData) => {
  const res = await axios.post(`${API}/users/register`, userData)
  return res.data // returns user object with token
}

// 🔐 Login user
export const loginUser = async (credentials) => {
  const res = await axios.post(`${API}/users/login`, credentials)
  return res.data // returns user object with token
}
