import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import axios from 'axios'
import { UserIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'

import ProductGrid from '../components/product/ProductGrid'
import PriceFilter from '../components/product/PriceFilter'
import SizeFilter from '../components/product/SizeFilter'
import SortDropdown from '../components/product/SortDropdown'
import Pagination from '../components/product/Pagination'

const Categories = () => {
  const location = useLocation()
  const category = location.pathname.substring(1) // Get category from URL path (remove leading slash)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  // Filters
  const [price, setPrice] = useState({ min: 0, max: 999999 })
  const [size, setSize] = useState(null)
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Category configurations
  const categoryConfig = {
    men: {
      title: "Men's Collection",
      subtitle: "Premium style for the modern man",
      icon: UserIcon,
      theme: {
        primary: "blue-600",
        secondary: "slate-600",
        accent: "blue-500",
        bg: "blue-50",
        text: "blue-900"
      }
    },
    women: {
      title: "Women's Collection", 
      subtitle: "Elegant fashion for every occasion",
      icon: HeartIcon,
      theme: {
        primary: "rose-600",
        secondary: "pink-600", 
        accent: "rose-500",
        bg: "rose-50",
        text: "rose-900"
      }
    },
    kids: {
      title: "Kids Collection",
      subtitle: "Fun and comfortable for little ones",
      icon: SparklesIcon,
      theme: {
        primary: "purple-600",
        secondary: "indigo-600",
        accent: "purple-500", 
        bg: "purple-50",
        text: "purple-900"
      }
    }
  }

  const config = categoryConfig[category] || categoryConfig.men

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)

        const query = new URLSearchParams({
          category,
          page,
          limit: 12, // Show more products per page
          minPrice: price.min,
          maxPrice: price.max,
          ...(size && { size }),
          ...(sort && { sort }),
        })

        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/products?${query.toString()}`)

        setProducts(res.data.products || res.data)
        setTotalPages(res.data.totalPages || 1)
      } catch (err) {
        console.error('Error fetching products:', err)
             
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      setPage(1) // Reset page when category changes
      fetchProducts()
    }
  }, [category, price, size, sort, page])

  // Reset filters when category changes
  useEffect(() => {
    setPrice({ min: 0, max: 999999 })
    setSize(null)
    setSort('')
    setPage(1)
  }, [category])

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
    }
  })

  const IconComponent = config.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Professional Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-4 rounded-2xl transform hover:scale-105 transition-transform duration-300 shadow-lg">
              <IconComponent className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-slate-900">{config.title}</h1>
              <p className="text-slate-600 text-lg mt-1">{config.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Results Summary */}
        {!loading && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-slate-600">
                {products.length > 0 ? (
                  <>Showing <span className="font-semibold">{products.length}</span> products</>
                ) : (
                  'No products found'
                )}
              </p>
              {totalPages > 1 && (
                <p className="text-sm text-slate-500">Page {page} of {totalPages}</p>
              )}
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-5 gap-8">
          {/* Professional Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 sticky top-6 transform hover:shadow-2xl transition-all duration-500">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Filters</h3>
              <div className="space-y-6">
                <PriceFilter onChange={setPrice} />
                <SizeFilter selectedSize={size} onChange={setSize} />
                <SortDropdown sortOption={sort} onChange={setSort} />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <div className="w-12 h-12 border-3 border-slate-200 border-t-slate-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-slate-200 transform hover:shadow-2xl transition-all duration-500">
                <IconComponent className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No products found</h3>
                <p className="text-slate-600 mb-6">Try adjusting your filters to see more results</p>
                <button 
                  onClick={() => {
                    setPrice({ min: 0, max: 999999 })
                    setSize(null)
                    setSort('')
                  }}
                  className="px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                <ProductGrid products={products} />
                {totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Categories
