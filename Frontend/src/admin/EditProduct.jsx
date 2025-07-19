import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useToast } from '../context/ToastContext'
import { getProductById, updateProduct } from '../services/productService'
import { 
  PencilIcon, 
  PhotoIcon, 
  CurrencyDollarIcon, 
  TagIcon, 
  DocumentTextIcon,
  BuildingStorefrontIcon,
  ArrowLeftIcon,
  SparklesIcon,
  ExclamationCircleIcon,
  RectangleStackIcon
} from '@heroicons/react/24/outline'

const EditProduct = () => {
  const { id } = useParams()
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
  const [errors, setErrors] = useState({})
  const [fetchLoading, setFetchLoading] = useState(true)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setFetchLoading(true)
        const res = await getProductById(id)
        
        // Debug logging to understand the response structure
        console.log('🔍 Product API Response:', res)
        
        // Handle the response - the product should be directly in res.data or res
        const product = res.data || res
        
        if (!product) {
          throw new Error('Product not found in response')
        }
        
        console.log('📦 Product data:', product)
        
        setForm({
          title: product.title || '',
          description: product.description || '',
          price: product.price || '',
          category: product.category || 'men',
          size: product.size ? (Array.isArray(product.size) ? product.size.join(',') : product.size) : '',
          image: product.image || '',
          stock: product.stock || 0
        })
      } catch (error) {
        console.error('❌ Failed to load product:', error)
        showToast(`Failed to load product: ${error.message}`, 'error')
        navigate('/admin/products')
      } finally {
        setFetchLoading(false)
      }
    }
    
    if (id) {
      fetchProduct()
    } else {
      console.error('❌ No product ID provided')
      navigate('/admin/products')
    }
  }, [id, showToast, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.title.trim()) newErrors.title = 'Title is required'
    if (!form.description.trim()) newErrors.description = 'Description is required'
    if (!form.price || form.price <= 0) newErrors.price = 'Price must be greater than 0'
    if (!form.image.trim()) newErrors.image = 'Image URL is required'
    if (!form.stock || form.stock < 0) newErrors.stock = 'Stock must be 0 or greater'
    
    // Validate image URL format
    if (form.image && !isValidUrl(form.image)) {
      newErrors.image = 'Please enter a valid image URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error')
      return
    }

    setLoading(true)
    try {
      // Convert sizes string to array
      const productData = {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        size: form.size ? form.size.split(',').map(s => s.trim()).filter(s => s) : []
      }
      
      await updateProduct(id, productData)
      showToast('Product updated successfully!', 'success')
      navigate('/admin/products')
    } catch (error) {
      console.error('Failed to update product:', error)
      showToast('Failed to update product. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/products')
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleCancel}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Products</span>
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <div className="flex items-center space-x-2">
            <PencilIcon className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Product Title */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <TagIcon className="h-4 w-4" />
              <span>Product Title</span>
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter product title"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.title}</span>
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <DocumentTextIcon className="h-4 w-4" />
              <span>Description</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.description}</span>
              </p>
            )}
          </div>

          {/* Price and Stock Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <CurrencyDollarIcon className="h-4 w-4" />
                <span>Price</span>
              </label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <span>{errors.price}</span>
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <RectangleStackIcon className="h-4 w-4" />
                <span>Stock Quantity</span>
              </label>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                  errors.stock ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                required
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                  <ExclamationCircleIcon className="h-4 w-4" />
                  <span>{errors.stock}</span>
                </p>
              )}
            </div>
          </div>

          {/* Category and Sizes Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <BuildingStorefrontIcon className="h-4 w-4" />
                <span>Category</span>
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="men">Men</option>
                <option value="women">Women</option>
                <option value="kids">Kids</option>
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <SparklesIcon className="h-4 w-4" />
                <span>Sizes</span>
              </label>
              <input
                name="size"
                value={form.size}
                onChange={handleChange}
                placeholder="e.g., S, M, L, XL"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Separate multiple sizes with commas
              </p>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <PhotoIcon className="h-4 w-4" />
              <span>Image URL</span>
            </label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                errors.image ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              required
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600 flex items-center space-x-1">
                <ExclamationCircleIcon className="h-4 w-4" />
                <span>{errors.image}</span>
              </p>
            )}
            {form.image && !errors.image && (
              <div className="mt-2">
                <img
                  src={form.image}
                  alt="Preview"
                  className="w-20 h-20 object-cover rounded-md border border-gray-200"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Updating Product...</span>
                </>
              ) : (
                <>
                  <PencilIcon className="h-4 w-4" />
                  <span>Update Product</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProduct
