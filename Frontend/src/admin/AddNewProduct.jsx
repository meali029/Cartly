import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const AddNewProduct = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'men',
    size: '',
    image: '',
    stock: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/products`, form, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      showToast('✅ Product added!')
      navigate('/admin/products')
    } catch (err) {
      showToast('Failed to add product', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full border px-3 py-2 rounded" required />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border px-3 py-2 rounded" required />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="w-full border px-3 py-2 rounded" required />
        <select name="category" value={form.category} onChange={handleChange} className="w-full border px-3 py-2 rounded">
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>
        <input name="size" value={form.size} onChange={handleChange} placeholder="Sizes (comma separated)" className="w-full border px-3 py-2 rounded" />
        <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="w-full border px-3 py-2 rounded" required />
        <input name="stock" type="number" value={form.stock} onChange={handleChange} placeholder="Stock" className="w-full border px-3 py-2 rounded" required />
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
          {loading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  )
}

export default AddNewProduct
