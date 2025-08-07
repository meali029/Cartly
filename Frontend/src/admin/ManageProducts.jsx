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
      showToast('Could not load products', err)
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
      showToast('Failed to delete product', err)
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
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="bg-purple-100 p-2 rounded-lg">
            <ShoppingBagIcon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
              Manage Products
              {products.length > 0 && (
                <span className="ml-2 text-sm sm:text-lg font-normal text-gray-500">
                  ({filteredProducts.length}{filteredProducts.length !== products.length ? ` of ${products.length}` : ''})
                </span>
              )}
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Create, edit, and manage your product catalog
              {lastUpdated && (
                <span className="hidden sm:inline ml-2 text-sm text-gray-500">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-md shadow-sm text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
            <span className="sm:hidden">↻</span>
          </button>
          <Link
            to="/admin/add-product"
            className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Add Product</span>
            <span className="sm:hidden">Add</span>
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="w-full sm:w-48">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FunnelIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-8 sm:pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base appearance-none"
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
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
          <ArrowPathIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4 animate-spin" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Loading products...</h3>
          <p className="text-sm sm:text-base text-gray-500">Please wait while we fetch your products.</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 sm:p-8 text-center">
          <ShoppingBagIcon className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            {searchTerm || categoryFilter ? 'No products match your filters' : 'No products found'}
          </h3>
          <p className="text-sm sm:text-base text-gray-500 mb-4">
            {searchTerm || categoryFilter 
              ? 'Try adjusting your search or filter criteria.' 
              : 'Get started by adding your first product to the catalog.'
            }
          </p>
          {!searchTerm && !categoryFilter && (
            <Link
              to="/admin/products/add-product"
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Add Your First Product
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && (
            <div className="bg-purple-50 border-b border-purple-200 px-4 py-2 sm:px-6 sm:py-3">
              <div className="flex items-center">
                <ArrowPathIcon className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 mr-2 animate-spin" />
                <span className="text-xs sm:text-sm text-purple-800">Refreshing products...</span>
              </div>
            </div>
          )}
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full table-fixed">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="w-2/5 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <PhotoIcon className="h-4 w-4" />
                      <span>Product</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>Price</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <TagIcon className="h-4 w-4" />
                      <span>Category</span>
                    </div>
                  </th>
                  <th className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="w-1/6 px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
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
                    <td className="px-4 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        PKR {product.price.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-gray-900">
                        {product.stock || 0}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
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
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <div key={product._id} className="p-3 sm:p-4">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="flex-shrink-0">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="h-12 w-12 sm:h-16 sm:w-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      {/* Title and Actions Row */}
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate flex-1 min-w-0">
                          {product.title}
                        </h3>
                        <div className="flex items-center space-x-1 flex-shrink-0">
                          <Link
                            to={`/admin/products/edit/${product._id}`}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            title="Edit"
                          >
                            <PencilIcon className="h-3 w-3" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product._id, product.title)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            title="Delete"
                          >
                            <TrashIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Description */}
                      <p className="text-xs sm:text-sm text-gray-500 mb-2" 
                         style={{
                           display: '-webkit-box',
                           WebkitLineClamp: 2,
                           WebkitBoxOrient: 'vertical',
                           overflow: 'hidden'
                         }}>
                        {product.description}
                      </p>
                      
                      {/* Price and Category */}
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900">
                          PKR {product.price.toLocaleString()}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                          {product.category}
                        </span>
                      </div>
                      
                      {/* Stock */}
                      <div className="text-xs text-gray-500">
                        Stock: {product.stock || 0}
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
