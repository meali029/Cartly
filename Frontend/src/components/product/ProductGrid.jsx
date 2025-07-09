import ProductCard from './ProductCard'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const ProductGrid = ({ products, loading = false }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
            <div className="h-72 bg-gradient-to-br from-gray-200 to-gray-300"></div>
            <div className="p-6 space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
          <span className="text-6xl opacity-50">📦</span>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600 text-center max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300"
        >
          Refresh Page
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Results Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-gray-900">
            {products.length} Product{products.length !== 1 ? 's' : ''} Found
          </h2>
          <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
        </div>
        
        {/* View toggle could go here */}
        <div className="hidden md:flex items-center gap-2">
          <span className="text-sm text-gray-600">View:</span>
          <button className="p-2 bg-indigo-600 text-white rounded-lg">
            <span className="text-sm">⊞</span>
          </button>
          <button className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
            <span className="text-sm">☰</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product, index) => (
          <div
            key={product._id}
            className="animate-fadeInUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {products.length >= 12 && (
        <div className="flex justify-center pt-8">
          <button className="px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 font-medium rounded-xl transition-all duration-300 flex items-center gap-2">
            <span>Load More Products</span>
            <ChevronDownIcon className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  )
}

export default ProductGrid
