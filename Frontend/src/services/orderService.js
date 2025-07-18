import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 🛒 Place a new order
export const placeOrder = async (orderData) => {
  const res = await axios.post(`${API}/orders`, orderData, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 👤 Get orders of a specific user
export const getUserOrders = async (userId) => {
  const res = await axios.get(`${API}/orders/user/${userId}`, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 👑 Admin: Get all orders
export const getAllOrders = async () => {
  const res = await axios.get(`${API}/orders`, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 🔄 Admin: Update order status
export const updateOrderStatus = async (orderId, status) => {
  const res = await axios.put(
    `${API}/orders/${orderId}`,
    { status },
    { headers: getAuthHeaders() }
  )
  return res.data
}

// ❌ Admin: Cancel order with reason
export const cancelOrder = async (orderId, cancelReason) => {
  const res = await axios.put(
    `${API}/orders/${orderId}`,
    { status: 'cancelled', cancelReason },
    { headers: getAuthHeaders() }
  )
  return res.data
}
