import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { Link } from 'react-router-dom'

const ManageProducts = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()

  const [products, setProducts] = useState([])

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products`)
      setProducts(res.data)
    } catch (err) {
      console.error('❌ Failed to fetch products:', err)
      showToast('Could not load products', 'error')
    }
  }

  useEffect(() => {
    if (user?.isAdmin) fetchProducts()
  }, [user])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      showToast('✅ Product deleted')
      fetchProducts()
    } catch (err) {
      console.error('❌ Delete failed:', err)
      showToast('Failed to delete product', 'error')
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🛍️ Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          + Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border rounded-md">
            <thead className="bg-gray-100 text-sm text-left">
              <tr>
                <th className="p-3">Image</th>
                <th className="p-3">Title</th>
                <th className="p-3">Price</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {products.map((p) => (
                <tr key={p._id}>
                  <td className="p-3">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-3">{p.title}</td>
                  <td className="p-3">PKR {p.price.toLocaleString()}</td>
                  <td className="p-3 capitalize">{p.category}</td>
                  <td className="p-3 text-right space-x-2">
                    <Link
                      to={`/admin/products/edit/${p._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageProducts
