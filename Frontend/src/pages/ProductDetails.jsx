import { useParams } from 'react-router-dom'
import { useEffect, useState, useContext } from 'react'
import { getProductById } from '../services/productService'
import { CartContext } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'

const ProductDetails = () => {
  const { id } = useParams()
  const { addToCart } = useContext(CartContext)
  const { showToast } = useToast()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')

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
  }, [id])

  const handleAddToCart = () => {
    if (product?.size?.length > 0 && !selectedSize) {
      showToast('Please select a size first', 'error')
      return
    }

    addToCart(product, selectedSize, 1)
    showToast('Added to cart 🛒')
  }

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
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-10">
        {/* Product Image */}
        <div>
          <img
            src={product.image}
            alt={product.title}
            className="w-full max-h-[500px] object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <Badge text={product.category} color="indigo" />

          <p className="text-2xl font-bold text-indigo-600 mt-4">
            PKR {product.price.toLocaleString()}
          </p>

          {/* Size Options */}
          {product.size?.length > 0 && (
            <div className="mt-4">
              <label className="block mb-1 font-medium text-sm">Select Size:</label>
              <div className="flex gap-2 flex-wrap">
                {product.size.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSize(s)}
                    className={`px-3 py-1 border rounded-full text-sm transition ${
                      selectedSize === s
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'border-gray-300 hover:bg-gray-100'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="mt-6 bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
