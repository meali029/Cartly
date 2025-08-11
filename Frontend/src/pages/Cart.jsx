import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { useToast } from '../context/ToastContext'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon, ShoppingBagIcon, MinusIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const getTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  }

  const getShippingCost = () => {
    const total = getTotal()
    if (total >= 5000) return 0
    return 200
  }

  const getFinalTotal = () => getTotal() + getShippingCost()

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  const handleQuantityChange = (productId, size, newQuantity) => {
    const result = updateQuantity(productId, size, newQuantity)
    if (!result.success) {
      showToast(result.message, 'error')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-y-4 md:gap-y-0">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="h-8 w-8 text-slate-600" />
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Shopping Bag</h1>
              {cartItems.length > 0 && (
                <Badge variant="primary" className="bg-slate-100 text-slate-700">
                  {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                </Badge>
              )}
            </div>
            <Link
              to="/"
              className="text-slate-600 hover:text-slate-900 flex items-center gap-2 transition-colors"
            >
              <span className="text-sm md:text-base">Continue Shopping</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-12 text-center transform hover:shadow-2xl transition-all duration-500">
            <div className="text-slate-400 mb-6">
              <ShoppingBagIcon className="h-16 w-16 sm:h-24 sm:w-24 mx-auto mb-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">Your bag is empty</h2>
            <p className="text-slate-600 mb-8 text-sm sm:text-base">Looks like you haven't added any items to your bag yet.</p>
            <Link to="/">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 w-full sm:w-auto">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 transform hover:shadow-2xl transition-all duration-500">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Bag Items</h2>
                <div className="space-y-4">
                  {cartItems.map(({ product, quantity, size }) => (
                    <div
                      key={product._id + size}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-slate-300"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 truncate">{product.title}</h3>
                        <p className="text-sm text-slate-500 mt-1">PKR {product.price.toLocaleString()}</p>
                        {size && (
                          <Badge variant="secondary" className="mt-2 bg-slate-100 text-slate-700">
                            Size: {size}
                          </Badge>
                        )}
                        {/* Stock Information */}
                        <div className="mt-2 text-xs text-slate-500">
                          {product.stock <= 10 && product.stock > 0 ? (
                            <span className="text-orange-600 font-medium">
                              Only {product.stock} left in stock
                            </span>
                          ) : product.stock === 0 ? (
                            <span className="text-red-600 font-medium">Out of stock</span>
                          ) : (
                            <span className="text-green-600">
                              {product.stock} available
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto mt-2 sm:mt-0">
                        <div className="flex items-center border border-slate-300 rounded-xl">
                          <button
                            onClick={() => handleQuantityChange(product._id, size, quantity - 1)}
                            className="p-2 hover:bg-slate-100 rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={quantity <= 1}
                          >
                            <MinusIcon className="h-4 w-4 text-slate-600" />
                          </button>
                          <span className="px-3 py-2 font-medium text-slate-900 min-w-[2.5rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, size, quantity + 1)}
                            className="p-2 hover:bg-slate-100 rounded-r-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={quantity >= product.stock}
                            title={quantity >= product.stock ? `Maximum ${product.stock} items available` : 'Increase quantity'}
                          >
                            <PlusIcon className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>
                        
                        {/* Stock Indicator for quantity */}
                        {quantity >= product.stock && (
                          <div className="text-xs text-orange-600 font-medium">
                            Max reached
                          </div>
                        )}

                        {/* Item Total */}
                        <div className="text-right min-w-[3rem] sm:min-w-[4rem]">
                          <p className="font-semibold text-slate-900">
                            PKR {(product.price * quantity).toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(product._id, size)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                          title="Remove item"
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

        {/* Clear Bag Button */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400 w-full sm:w-auto"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
          Clear Bag
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 sticky lg:top-6 transform hover:shadow-2xl transition-all duration-500">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4 sm:mb-6">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">PKR {getTotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Shipping</span>
                    <span className="font-medium">
                      {getShippingCost() === 0 ? (
                        <span className="text-green-600">Free</span>
                      ) : (
                        `PKR ${getShippingCost()}`
                      )}
                    </span>
                  </div>
                  
                  {getShippingCost() === 0 ? (
                    <div className="text-xs text-green-600">
                      Free shipping applied!
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Free shipping on orders over PKR 5,000
                    </div>
                  )}
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Tax</span>
                    <span className="font-medium">PKR 0</span>
                  </div>
                  
                  <div className="border-t border-slate-200 pt-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-slate-900">PKR {getFinalTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 sm:mt-8 space-y-4">
                  <Button
                    onClick={handleCheckout}
                    size="lg"
                    className="w-full bg-slate-900 hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    Proceed to Checkout
                    <ArrowRightIcon className="h-5 w-5 ml-2" />
                  </Button>
                  
                  <div className="text-center">
                    <Link
                      to="/"
                      className="text-slate-600 hover:text-slate-900 text-sm transition-colors"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>

                {/* Security Badge */}
                <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-slate-200">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <span>Secure checkout guaranteed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
