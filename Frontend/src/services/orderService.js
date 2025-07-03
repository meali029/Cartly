import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 🛒 Place a new order
export const placeOrder = async (orderData, token) => {
  const res = await axios.post(`${API}/orders`, orderData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// 👤 Get orders of a specific user
export const getUserOrders = async (userId, token) => {
  const res = await axios.get(`${API}/orders/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// 👑 Admin: Get all orders
export const getAllOrders = async (token) => {
  const res = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  return res.data
}

// 🔄 Admin: Update order status
export const updateOrderStatus = async (orderId, status, token) => {
  const res = await axios.put(
    `${API}/orders/${orderId}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  return res.data
}
