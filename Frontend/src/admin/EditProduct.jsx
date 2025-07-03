import { useState, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import axios from 'axios'

const EditProduct = () => {
  const { id } = useParams()
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`)
        const p = res.data
        setForm({
          title: p.title,
          description: p.description,
          price: p.price,
          category: p.category,
          size: p.size ? p.size.join(',') : '',
          image: p.image,
          stock: p.stock
        })
      } catch (err) {
        showToast('Failed to load product', 'error')
      }
    }
    fetchProduct()
  }, [id, showToast])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/products/${id}`,
        { ...form, size: form.size.split(',').map(s => s.trim()) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      )
      showToast('✅ Product updated!')
      navigate('/admin/products')
    } catch (err) {
      showToast('Failed to update product', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>
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
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  )
}

export default EditProduct
