import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  return token ? {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  } : {}
}

// 📦 Get all products (optionally filter by category, search, etc.)
export const getAllProducts = async () => {
  const res = await axios.get(`${API}/products`)
  // Backend returns { products: [...], totalPages, currentPage, totalProducts }
  // Extract the products array from the response
  return res.data.products || []
}

// 🧠 Get single product by ID
export const getProductById = async (id) => {
  try {
    const res = await axios.get(`${API}/products/${id}`)
    return res.data
  } catch (error) {
    if (error.response) {
      console.error(`❌ Product fetch failed for ID ${id}:`, error)
      
    }
    throw error
  }
}

// ✍️ Admin: Create new product
export const createProduct = async (productData) => {
  const res = await axios.post(`${API}/products`, productData, getAuthHeaders())
  return res.data
}

// 🛠 Admin: Update product
export const updateProduct = async (id, updates) => {
  try {
    const res = await axios.put(`${API}/products/${id}`, updates, getAuthHeaders())
    return res.data
  } catch (error) {
    if (error.response) {
      console.error('Response data:', error.response.data)
    }
    throw error
  }
}

// ❌ Admin: Delete product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API}/products/${id}`, getAuthHeaders())
  return res.data
}
