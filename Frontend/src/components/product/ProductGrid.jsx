import ProductCard from './ProductCard'
import { useState } from 'react'
import { 
  ChevronDownIcon, 
  ArchiveBoxIcon,
  ArrowPathIcon,
  Squares2X2Icon,
  ListBulletIcon
} from '@heroicons/react/24/outline'

const ProductGrid = ({ products, loading = false }) => {
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden animate-pulse">
            <div className="h-40 sm:h-44 bg-gradient-to-br from-slate-200 to-slate-300"></div>
            <div className="p-3 sm:p-4 space-y-3">
              <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2"></div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mb-6 shadow-lg">
          <ArchiveBoxIcon className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">No Products Found</h3>
        <p className="text-slate-600 text-center max-w-md mb-6">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-6 py-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2 hover:scale-105 shadow-lg"
        >
          <ArrowPathIcon className="w-4 h-4" />
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-xl">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">
            {products.length} Product{products.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="w-2 h-2 bg-slate-600 rounded-full animate-pulse"></div>
        </div>
        
        {/* View toggle */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-sm text-slate-600 font-medium">View:</span>
          <div className="flex bg-slate-100 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg shadow-sm transition-all duration-300 ${
                viewMode === 'grid' 
                  ? 'bg-slate-900 text-white hover:bg-slate-800 transform scale-105' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              title="Grid view"
            >
              <Squares2X2Icon className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all duration-300 ${
                viewMode === 'list' 
                  ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800 transform scale-105' 
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
              title="List view"
            >
              <ListBulletIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className={`${
        viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
          : 'space-y-4'
      }`}>
        {products.map((product, index) => (
          <div
            key={product._id}
            className={`animate-fadeInUp ${
              viewMode === 'list' ? 'bg-white rounded-3xl border border-slate-200 shadow-xl hover:shadow-2xl transition-all duration-500' : ''
            }`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {viewMode === 'grid' ? (
              <ProductCard product={product} />
            ) : (
              <div className="flex gap-4 p-4">
                {/* List view layout */}
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover rounded-xl shadow-md"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 mb-1 truncate">{product.title}</h3>
                  <p className="text-sm text-slate-600 mb-2 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-slate-900">
                      PKR {product.price?.toLocaleString() || 'N/A'}
                    </span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        // Add to cart functionality
                        console.log('Added to cart:', product.title)
                      }}
                      className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all duration-300 text-sm font-medium transform hover:scale-105 shadow-lg"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {products.length >= 12 && (
        <div className="flex justify-center pt-6">
          <button 
            onClick={() => {
              // Add load more functionality here
              console.log('Loading more products...')
            }}
            className="px-8 py-3 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 hover:border-slate-400 text-slate-800 hover:text-slate-900 font-medium rounded-3xl transition-all duration-300 flex items-center gap-2 border border-slate-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span>Load More Products</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
