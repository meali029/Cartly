import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import { useNavigate } from 'react-router-dom'
import { createProduct } from '../services/productService'
import { 
  PlusIcon,
  PhotoIcon,
  CurrencyDollarIcon,
  TagIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  ArrowLeftIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline'

const AddNewProduct = () => {
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
      
      await createProduct(productData)
      showToast('Product added successfully!', 'success')
      navigate('/admin/products')
    } catch (error) {
      console.error('Failed to add product:', error)
      showToast('Failed to add product. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/admin/products')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 px-4 py-6 bg-white border-b border-gray-200">
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
            <PlusIcon className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="flex-1 min-h-0 px-4 py-6 bg-gray-50">
        <div className="max-w-3xl mx-auto h-full">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-full flex flex-col">
            {/* Form Content - Scrollable */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
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
                </div>
              </form>
            </div>

            {/* Form Actions - Fixed at bottom */}
            <div className="flex-shrink-0 px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-end space-x-4">
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
                  onClick={handleSubmit}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Adding Product...</span>
                    </>
                  ) : (
                    <>
                      <PlusIcon className="h-4 w-4" />
                      <span>Add Product</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddNewProduct
