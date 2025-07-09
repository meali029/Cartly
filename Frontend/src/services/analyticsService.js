import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 📊 Get sales analytics data
export const getSalesAnalytics = async (period = '7days') => {
  const res = await axios.get(`${API}/analytics/sales?period=${period}`)
  return res.data
}

// 📈 Get product analytics
export const getProductAnalytics = async () => {
  const res = await axios.get(`${API}/analytics/products`)
  return res.data
}

// 👥 Get user analytics
export const getUserAnalytics = async () => {
  const res = await axios.get(`${API}/analytics/users`)
  return res.data
}

// 📦 Get order analytics
export const getOrderAnalytics = async () => {
  const res = await axios.get(`${API}/analytics/orders`)
  return res.data
}

// 💰 Get revenue analytics
export const getRevenueAnalytics = async (period = '30days') => {
  const res = await axios.get(`${API}/analytics/revenue?period=${period}`)
  return res.data
}

// 🔝 Get top performing products
export const getTopProducts = async (limit = 10) => {
  const res = await axios.get(`${API}/analytics/top-products?limit=${limit}`)
  return res.data
}

// 📊 Get dashboard summary
export const getDashboardSummary = async () => {
  const res = await axios.get(`${API}/analytics/summary`)
  return res.data
}

// Mock data for demo purposes (in case backend endpoints are not ready)
export const getMockAnalytics = () => {
  return {
    sales: {
      total: 15420,
      growth: 12.5,
      data: [
        { date: '2024-01-01', sales: 1200 },
        { date: '2024-01-02', sales: 1850 },
        { date: '2024-01-03', sales: 2100 },
        { date: '2024-01-04', sales: 1650 },
        { date: '2024-01-05', sales: 2400 },
        { date: '2024-01-06', sales: 2200 },
        { date: '2024-01-07', sales: 2020 }
      ]
    },
    revenue: {
      total: 45680,
      growth: 8.3,
      data: [
        { month: 'Jan', revenue: 12000 },
        { month: 'Feb', revenue: 15000 },
        { month: 'Mar', revenue: 18680 }
      ]
    },
    orders: {
      total: 324,
      pending: 12,
      completed: 298,
      cancelled: 14,
      growth: 15.2
    },
    users: {
      total: 1250,
      active: 890,
      new: 45,
      growth: 22.1
    },
    products: {
      total: 156,
      inStock: 142,
      outOfStock: 14,
      lowStock: 23
    },
    topProducts: [
      { id: 1, name: 'Premium T-Shirt', sales: 145, revenue: 4350 },
      { id: 2, name: 'Casual Jeans', sales: 128, revenue: 6400 },
      { id: 3, name: 'Sport Sneakers', sales: 98, revenue: 7840 },
      { id: 4, name: 'Summer Dress', sales: 87, revenue: 4350 },
      { id: 5, name: 'Winter Jacket', sales: 76, revenue: 9120 }
    ],
    categories: [
      { name: 'Men', percentage: 45, sales: 6939 },
      { name: 'Women', percentage: 38, sales: 5860 },
      { name: 'Kids', percentage: 17, sales: 2621 }
    ]
  }
}
