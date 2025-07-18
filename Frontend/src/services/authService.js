import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

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

// 🔐 Forgot Password - Send OTP
export const sendPasswordResetOTP = async (email) => {
  const res = await axios.post(`${API}/users/forgot-password`, { email })
  return res.data
}

// 🔐 Verify OTP
export const verifyPasswordResetOTP = async (email, otpCode) => {
  const res = await axios.post(`${API}/users/verify-otp`, { email, otpCode })
  return res.data
}

// 🔐 Reset Password
export const resetPassword = async (email, otpCode, newPassword) => {
  const res = await axios.post(`${API}/users/reset-password`, { 
    email, 
    otpCode, 
    newPassword 
  })
  return res.data
}

// 📧 Verify Email OTP
export const verifyEmailOTP = async (email, otpCode) => {
  const res = await axios.post(`${API}/users/verify-email`, { email, otpCode })
  return res.data
}

// 📧 Resend Email Verification
export const resendEmailVerification = async (email) => {
  const res = await axios.post(`${API}/users/resend-verification`, { email })
  return res.data
}
