import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = () => {
    addToCart(product)
  }

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 overflow-hidden hover:scale-[1.02]">
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
        <div className="relative h-72 bg-gradient-to-br from-gray-100 to-gray-200">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageError ? '/placeholder-product.jpg' : product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Quick view button */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
            <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors">
              <span className="text-lg">👁️</span>
            </button>
          </div>

          {/* Sale badge if applicable */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
              SALE
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {product.category}
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
          <div className="flex text-yellow-400 text-xs">
            {'★'.repeat(5)}
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 hover:text-indigo-600 transition-colors group-hover:text-indigo-600">
            {product.title}
          </h3>
        </Link>

        {/* Description if available */}
        {product.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PKR {product.price?.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                PKR {product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock && product.stock <= 10 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left!
            </span>
          )}
        </div>

        {/* Sizes if available */}
        {product.size && product.size.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            <span className="text-xs text-gray-500">Sizes:</span>
            {product.size.slice(0, 4).map((size) => (
              <span key={size} className="w-6 h-6 border border-gray-300 rounded text-xs flex items-center justify-center text-gray-600">
                {size}
              </span>
            ))}
            {product.size.length > 4 && (
              <span className="text-xs text-gray-500">+{product.size.length - 4}</span>
            )}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group/btn"
        >
          <span className="text-lg group-hover/btn:scale-110 transition-transform">🛒</span>
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
