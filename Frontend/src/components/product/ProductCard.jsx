import { Link } from 'react-router-dom'
import { useContext, useState } from 'react'
import { CartContext } from '../../context/CartContext'
import { 
  EyeIcon, 
  ShoppingCartIcon, 
  StarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { 
  StarIcon as StarSolid,
  HeartIcon as HeartSolid 
} from '@heroicons/react/24/solid'
import { useToast } from '../../context/ToastContext'

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext)
  const { showToast } = useToast()
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    const result = addToCart(product)
    if (result.success) {
      showToast(result.message, 'success')
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleWishlist = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
    showToast(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      isWishlisted ? 'info' : 'success'
    )
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    // Navigate to product details
    window.open(`/product/${product._id}`, '_blank')
  }

  return (
    <div className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-slate-200 overflow-hidden transform hover:scale-105">
      {/* Image Container */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
        <div className="relative h-40 sm:h-44 bg-gradient-to-br from-slate-50 to-slate-100">
          {imageLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          <img
            src={imageError ? '/placeholder-product.jpg' : product.image}
            alt={product.title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
              imageLoading ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true)
              setImageLoading(false)
            }}
          />
          
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Action buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <button 
              onClick={handleWishlist}
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-white/30"
              title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              {isWishlisted ? (
                <HeartSolid className="w-4 h-4 text-red-500" />
              ) : (
                <HeartIcon className="w-4 h-4 text-slate-600 hover:text-red-500" />
              )}
            </button>
            <button 
              onClick={handleQuickView}
              className="w-10 h-10 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl hover:bg-white hover:scale-110 transition-all duration-300 border border-white/30"
              title="Quick view"
            >
              <EyeIcon className="w-4 h-4 text-slate-600 hover:text-slate-800" />
            </button>
          </div>

          {/* Sale badge */}
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-xl text-xs font-bold shadow-lg">
              {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
            </div>
          )}

          {/* Stock indicator */}
          {product.stock <= 15 && product.stock > 0 && (
            <div className="absolute bottom-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-xl text-xs font-medium shadow-lg">
              Only {product.stock} left
            </div>
          )}

          {product.stock === 0 && (
            <div className="absolute bottom-3 left-3 bg-red-500 text-white px-3 py-1 rounded-xl text-xs font-medium shadow-lg">
              Out of Stock
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 sm:p-5">
        {/* Category & Rating */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-xl transition-all duration-300 cursor-default">
            {product.category}
          </span>
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <StarSolid 
                key={i} 
                className={`w-3 h-3 ${i < 4 ? 'text-yellow-400' : 'text-slate-200'}`} 
              />
            ))}
            <span className="text-xs text-slate-500 ml-1 font-medium">(4.8)</span>
          </div>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 mb-3 line-clamp-2 hover:text-slate-700 transition-colors leading-tight">
            {product.title}
          </h3>
        </Link>

        {/* Price Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-bold text-slate-900">
                PKR {product.price?.toLocaleString() || 'N/A'}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through font-medium">
                  PKR {product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-green-600 font-semibold">
                Save PKR {(product.originalPrice - product.price).toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Sizes */}
        {product.size && product.size.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-500 font-semibold">Sizes:</span>
            <div className="flex gap-1">
              {product.size.slice(0, 3).map((size) => (
                <span 
                  key={size} 
                  className="w-fit px-2 py-1 h-6 border border-slate-300 rounded-lg text-xs flex items-center justify-center text-slate-600 bg-slate-50 hover:bg-slate-100 hover:border-slate-400 transition-all duration-300 font-medium"
                >
                  {size}
                </span>
              ))}
              {product.size.length > 3 && (
                <span className="text-xs text-slate-500 font-semibold flex items-center">
                  +{product.size.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl disabled:shadow-none group/btn transform hover:scale-105 active:scale-95"
        >
          <ShoppingCartIcon className="w-4 h-4 group-hover/btn:scale-110 transition-transform duration-300" />
          <span className="text-sm font-semibold">
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProductCard
