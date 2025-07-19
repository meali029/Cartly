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
        setLoading(true)
        console.log('🔍 Fetching product with ID:', id) // Debug log
        const data = await getProductById(id)
        console.log('📦 Product data received:', data) // Debug log
        
        if (data && data._id) {
          setProduct(data)
        } else {
          console.error('❌ Invalid product data:', data)
          showToast('Product not found', 'error')
          navigate('/') // Redirect to home if product not found
        }
      } catch (err) {
        console.error('❌ Failed to load product:', err)
        showToast('Failed to load product. Please try again.', 'error')
        navigate('/') // Redirect to home on error
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchProduct()
    } else {
      setLoading(false)
      showToast('Invalid product ID', 'error')
      navigate('/')
    }
  }, [id, showToast, navigate])

  const handleAddToCart = () => {
    if (!product) {
      showToast('Product data not available', 'error')
      return
    }

    if (product.size && product.size.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error')
      return
    }

    const result = addToCart(product, selectedSize, quantity)
    if (result.success) {
      showToast(`Added ${quantity} item(s) to cart 🛒`, 'success')
    } else {
      showToast(result.message, 'error')
    }
  }

  const handleBuyNow = () => {
    if (!product) {
      showToast('Product data not available', 'error')
      return
    }

    if (product.size && product.size.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error')
      return
    }

    if (product.stock && product.stock < quantity) {
      showToast('Not enough stock available', 'error')
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
    const maxQuantity = product?.stock ? Math.min(10, product.stock) : 10
    
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    } else if (newQuantity > maxQuantity) {
      showToast(`Only ${maxQuantity} items available in stock`, 'error')
    }
  }

  // Handle product images - create array from single image or use multiple if available
  const productImages = product ? [
    product.image,
    product.image, // Duplicate for demo - in real app you'd have multiple images
    product.image
  ].filter(Boolean) : [] // Filter out any null/undefined images

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Image Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 hover:bg-slate-100 transition-all duration-300 transform hover:scale-110"
            >
              <XMarkIcon className="w-6 h-6 text-slate-600" />
            </button>
            <img
              src={productImages[selectedImage]}
              alt={product.title}
              className="max-w-full max-h-full object-contain rounded-3xl shadow-2xl"
            />
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500">
          <div className="grid lg:grid-cols-2 gap-8 p-6 lg:p-8">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={productImages[selectedImage] || '/placeholder-image.jpg'}
                  alt={product.title || 'Product image'}
                  className="w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-xl cursor-zoom-in transition-all duration-500 group-hover:scale-105"
                  onClick={() => setIsZoomed(true)}
                  onError={(e) => {
                    e.target.src = '/placeholder-image.jpg'
                  }}
                />
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110 shadow-lg"
                >
                  <MagnifyingGlassIcon className="w-5 h-5 text-slate-600" />
                </button>
                
                {/* Stock indicator */}
                {product.stock !== undefined && (
                  <div className="absolute top-4 left-4">
                    <Badge 
                      text={product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'} 
                      color={product.stock > 0 ? 'slate' : 'red'} 
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail Images */}
              {productImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        selectedImage === index
                          ? 'border-slate-600 scale-105 shadow-lg'
                          : 'border-slate-200 hover:border-slate-400 hover:scale-102'
                      }`}
                    >
                      <img
                        src={img || '/placeholder-image.jpg'}
                        alt={`${product.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = '/placeholder-image.jpg'
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 transform hover:scale-105 transition-all duration-300">
                    {product.title || product.name || 'Product Name'}
                  </h1>
                  <button
                    onClick={handleWishlist}
                    className="p-2 rounded-full hover:bg-slate-100 transition-all duration-300 transform hover:scale-110"
                  >
                    {isWishlisted ? (
                      <HeartIconSolid className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6 text-slate-400" />
                    )}
                  </button>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-4">
                  {product.description || 'No description available'}
                </p>
                
                {/* Rating and Badge */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-sm text-slate-600 ml-1">(4.8)</span>
                  </div>
                  {product.category && <Badge text={product.category} color="slate" />}
                </div>
              </div>

              {/* Price */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl p-6 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-bold text-slate-900">
                    PKR {typeof product.price === 'number' ? product.price.toLocaleString() : 'N/A'}
                  </span>
                  <span className="text-lg text-slate-500 line-through">
                    PKR {typeof product.price === 'number' ? (product.price * 1.2).toLocaleString() : ''}
                  </span>
                  <Badge text="20% OFF" color="red" />
                </div>
              </div>

              {/* Size Options */}
              {product.size?.length > 0 && (
                <div>
                  <label className="block mb-3 font-semibold text-slate-900">Select Size:</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.size.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 border-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                          selectedSize === s
                            ? 'bg-slate-900 text-white border-slate-900 scale-105 shadow-lg'
                            : 'border-slate-300 hover:border-slate-600 hover:bg-slate-50'
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
                <label className="block mb-3 font-semibold text-slate-900">
                  Quantity: 
                  {product.stock !== undefined && (
                    <span className="text-sm font-normal text-slate-600 ml-2">
                      (Max: {Math.min(10, product.stock || 0)})
                    </span>
                  )}
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="text-slate-900 font-semibold">-</span>
                  </button>
                  <span className="w-16 text-center font-bold text-xl text-slate-900">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= Math.min(10, product.stock || 0)}
                    className="w-12 h-12 rounded-full border-2 border-slate-300 flex items-center justify-center hover:border-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
                  >
                    <span className="text-slate-900 font-semibold">+</span>
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {product.stock > 0 ? (
                  <>
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:from-slate-800 hover:to-slate-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-2"
                    >
                      <BoltIcon className="w-6 h-6" />
                      Buy Now
                    </button>
                    
                    <button
                      onClick={handleAddToCart}
                      className="w-full bg-white border-2 border-slate-600 text-slate-900 py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-slate-50 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      <ShoppingCartIcon className="w-6 h-6" />
                      Add to Cart
                    </button>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-red-600 font-semibold text-lg mb-4">Out of Stock</p>
                    <button
                      disabled
                      className="w-full bg-slate-300 text-slate-500 py-4 px-6 rounded-3xl font-semibold text-lg cursor-not-allowed"
                    >
                      Notify When Available
                    </button>
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="bg-slate-50 rounded-3xl p-6 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <TruckIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700">Shipping: PKR 200 (Free on orders over PKR 5,000)</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheckIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700">30-day return policy</span>
                </div>
                <div className="flex items-center gap-3">
                  <HeartIcon className="w-5 h-5 text-slate-600" />
                  <span className="text-sm text-slate-700">100% authentic products</span>
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
