import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getAllProducts, deleteProduct } from '../services/productService'
import { useSocket } from '../hooks/useSocket'
import { Link } from 'react-router-dom'
import { 
  ShoppingBagIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  TagIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ManageProducts = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true)
      const productsArray = await getAllProducts()
      
      // Sort products by creation date (newest first)
      const sortedProducts = productsArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setProducts(sortedProducts)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('❌ Failed to fetch products:', err)
      showToast('Could not load products', 'error')
      setProducts([]) // Set empty array on error
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (user?.isAdmin) fetchProducts()
  }, [user, fetchProducts])

  // Socket listener for real-time stock updates
  useSocket({
    'stock:update': (data) => {
      console.log('🔄 Real-time stock update received:', data)
      setProducts(prevProducts => 
        prevProducts.map(product => 
          product._id === data.productId 
            ? { ...product, stock: data.newStock }
            : product
        )
      )
      showToast(
        `Stock updated for product (${data.itemsSold || data.itemsRestored} ${data.itemsSold ? 'sold' : 'restored'})`, 
        'info'
      )
    }
  })

  const handleDelete = async (id, productTitle) => {
    if (!confirm(`Are you sure you want to delete "${productTitle}"? This action cannot be undone.`)) return

    try {
      await deleteProduct(id)
      showToast('Product deleted successfully', 'success')
      fetchProducts()
    } catch (err) {
      console.error('❌ Delete failed:', err)
      showToast('Failed to delete product', 'error')
    }
  }

  const handleRefresh = async () => {
    showToast('Refreshing products...', 'info')
    await fetchProducts()
    showToast('Products refreshed successfully', 'success')
  }

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !categoryFilter || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(p => p.category))].sort()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <ShoppingBagIcon className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Products
              {products.length > 0 && (
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({filteredProducts.length}{filteredProducts.length !== products.length ? ` of ${products.length}` : ''})
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              Create, edit, and manage your product catalog
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Products List */}
      {loading && products.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading products...</h3>
          <p className="text-gray-500">Please wait while we fetch your products.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ShoppingBagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter ? 'No products match your filters' : 'No products found'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || categoryFilter 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first product to the catalog.'
            }
          </p>
          {!searchTerm && !categoryFilter && (
            <Link
              to="/admin/products/add-product"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && (
            <div className="bg-purple-50 border-b border-purple-200 px-6 py-3">
              <div className="flex items-center">
                <ArrowPathIcon className="h-4 w-4 text-purple-600 mr-2 animate-spin" />
                <span className="text-sm text-purple-800">Refreshing products...</span>
              </div>
            </div>
          )}
          
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-2/5 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <PhotoIcon className="h-4 w-4" />
                      <span>Product</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="w-1/6 px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="h-12 w-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.target.src = '/placeholder-image.jpg'
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate">
                            {product.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        PKR {product.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {product.stock || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-1">
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          title="Edit Product"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id, product.title)}
                          className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                          title="Delete Product"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-16 w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 truncate">
                            {product.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {product.description}
                          </p>
                          <div className="mt-1 flex items-center space-x-4">
                            <span className="text-sm font-medium text-gray-900">
                              PKR {product.price.toLocaleString()}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {product.category}
                            </span>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            Stock: {product.stock || 0}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageProducts
