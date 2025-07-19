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
    console.log(`🌐 Fetching product with ID: ${id}`)
    const res = await axios.get(`${API}/products/${id}`)
    console.log(`✅ Product fetch success:`, res.data)
    return res.data
  } catch (error) {
    console.error(`❌ Product fetch failed for ID ${id}:`, error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
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
    console.log(`🔄 Updating product ${id}:`, updates)
    const res = await axios.put(`${API}/products/${id}`, updates, getAuthHeaders())
    console.log(`✅ Product update success:`, res.data)
    return res.data
  } catch (error) {
    console.error(`❌ Product update failed for ID ${id}:`, error)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    throw error
  }
}

// ❌ Admin: Delete product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API}/products/${id}`, getAuthHeaders())
  return res.data
}
