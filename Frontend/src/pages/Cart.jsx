import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'
import { TrashIcon, ShoppingBagIcon, MinusIcon, PlusIcon, ArrowRightIcon } from '@heroicons/react/24/outline'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, updateQuantity } = useContext(CartContext)
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
    if (newQuantity < 1) {
      removeFromCart(productId, size)
    } else if (updateQuantity) {
      updateQuantity(productId, size, newQuantity)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBagIcon className="h-8 w-8 text-slate-600" />
              <h1 className="text-3xl font-bold text-slate-900">Shopping Cart</h1>
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
              <span>Continue Shopping</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center transform hover:shadow-2xl transition-all duration-500">
            <div className="text-slate-400 mb-6">
              <ShoppingBagIcon className="h-24 w-24 mx-auto mb-4" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Your cart is empty</h2>
            <p className="text-slate-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link to="/">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl p-6 transform hover:shadow-2xl transition-all duration-500">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Cart Items</h2>
                <div className="space-y-4">
                  {cartItems.map(({ product, quantity, size }) => (
                    <div
                      key={product._id + size}
                      className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:shadow-md transition-all duration-300 hover:border-slate-300"
                    >
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-20 h-20 object-cover rounded-lg"
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
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-slate-300 rounded-xl">
                          <button
                            onClick={() => handleQuantityChange(product._id, size, quantity - 1)}
                            className="p-2 hover:bg-slate-100 rounded-l-xl transition-colors"
                          >
                            <MinusIcon className="h-4 w-4 text-slate-600" />
                          </button>
                          <span className="px-4 py-2 font-medium text-slate-900 min-w-[3rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(product._id, size, quantity + 1)}
                            className="p-2 hover:bg-slate-100 rounded-r-xl transition-colors"
                          >
                            <PlusIcon className="h-4 w-4 text-slate-600" />
                          </button>
                        </div>

                        {/* Item Total */}
                        <div className="text-right min-w-[4rem]">
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

                {/* Clear Cart Button */}
                <div className="mt-6 pt-6 border-t border-slate-200">
                  <Button
                    variant="outline"
                    onClick={clearCart}
                    className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                  >
                    <TrashIcon className="h-4 w-4 mr-2" />
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl p-6 sticky top-6 transform hover:shadow-2xl transition-all duration-500">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
                
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

                <div className="mt-8 space-y-4">
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
                <div className="mt-6 pt-6 border-t border-slate-200">
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
