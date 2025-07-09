import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// 📦 Get all products (optionally filter by category, search, etc.)
export const getAllProducts = async () => {
  const res = await axios.get(`${API}/products`)
  return res.data
}

// 🧠 Get single product by ID
export const getProductById = async (id) => {
  const res = await axios.get(`${API}/products/${id}`)
  return res
}

// ✍️ Admin: Create new product
export const createProduct = async (productData) => {
  const res = await axios.post(`${API}/products`, productData)
  return res.data
}

// 🛠 Admin: Update product
export const updateProduct = async (id, updates) => {
  const res = await axios.put(`${API}/products/${id}`, updates)
  return res.data
}

// ❌ Admin: Delete product
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API}/products/${id}`)
  return res.data
}
