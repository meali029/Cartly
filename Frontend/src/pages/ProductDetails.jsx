import { useParams, useNavigate } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { getProductById } from '../services/productService'
import { CartContext } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'
import { 
  ShoppingCartIcon, 
  BoltIcon, 
  MagnifyingGlassIcon,
  XMarkIcon,
  HeartIcon,
  StarIcon,
  TruckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id)
        setProduct(data)
      } catch (err) {
        console.error('❌ Failed to load product:', err)
        showToast('Failed to load product', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, showToast])

  const handleAddToCart = () => {
    if (product?.size?.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error')
      return
    }

    addToCart(product, selectedSize, quantity)
    showToast(`Added ${quantity} item(s) to cart 🛒`)
  }

  const handleBuyNow = () => {
    if (product?.size?.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error')
      return
    }

    // Create a temporary cart item for checkout without adding to cart
    const buyNowItem = {
      product: product,
      quantity: quantity,
      size: selectedSize
    }
    
    // Navigate to checkout with the buy now item
    navigate('/checkout', { state: { buyNowItem } })
  }

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted)
    showToast(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist ❤️')
  }

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity)
    }
  }

  // Mock product images array (in real app, this would come from the API)
  const productImages = product ? [product.image, product.image, product.image] : []

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center text-gray-500 py-10">
        ❌ Product not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
            <img
              src={productImages[selectedImage]}
              alt={product.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={productImages[selectedImage]}
                  alt={product.title}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-md cursor-zoom-in transition-transform group-hover:scale-105"
                  onClick={() => setIsZoomed(true)}
                />
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Thumbnail Images */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-indigo-500 scale-105'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">{product.title}</h1>
                  <button
                    onClick={handleWishlist}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    {isWishlisted ? (
                      <HeartIconSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">{product.description}</p>
                
                {/* Rating and Badge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                  </div>
                  <Badge text={product.category} color="indigo" />
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-indigo-600">
                    PKR {typeof product.price === 'number' ? product.price.toLocaleString() : 'N/A'}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    PKR {typeof product.price === 'number' ? (product.price * 1.2).toLocaleString() : ''}
                  </span>
                  <Badge text="20% OFF" color="red" />
                </div>
              </div>

              {/* Size Options */}
              {product.size?.length > 0 && (
                <div>
                  <label className="block mb-3 font-semibold text-gray-900">Select Size:</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.size.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all ${
                          selectedSize === s
                            ? 'bg-indigo-600 text-white border-indigo-600 scale-105'
                            : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block mb-3 font-semibold text-gray-900">Quantity:</label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    -
                  </button>
                  <span className="w-16 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <BoltIcon className="w-6 h-6" />
                  Buy Now
                </button>
                
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-white border-2 border-indigo-600 text-indigo-600 py-4 px-6 rounded-xl font-semibold text-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>

              {/* Features */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700">Shipping: PKR 200 (Free on orders over PKR 5,000)</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm text-gray-700">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartIcon className="w-5 h-5 text-red-600" />
                  <span className="text-sm text-gray-700">100% authentic products</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
