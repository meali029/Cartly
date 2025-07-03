import { useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { Link, useNavigate } from 'react-router-dom'

const Cart = () => {
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext)
  const navigate = useNavigate()

  const getTotal = () => {
    return cartItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
  }

  const handleCheckout = () => {
    if (cartItems.length === 0) return
    navigate('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-gray-600 text-center">
          <p className="mb-4">Your cart is empty.</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
          >
            Go Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="grid gap-4">
            {cartItems.map(({ product, quantity, size }) => (
              <div
                key={product._id + size}
                className="flex items-center justify-between border p-4 rounded-md shadow-sm"
              >
                {/* Image */}
                <div className="flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{product.title}</h3>
                    <p className="text-sm text-gray-500">PKR {product.price}</p>
                    {size && (
                      <p className="text-xs text-gray-400">Size: {size}</p>
                    )}
                  </div>
                </div>

                {/* Quantity + Remove */}
                <div className="text-right">
                  <p className="mb-2 text-sm">Qty: {quantity}</p>
                  <button
                    onClick={() => removeFromCart(product._id, size)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Totals & Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <p className="text-xl font-semibold">
                Total: PKR {getTotal().toLocaleString()}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-100"
              >
                Clear Cart
              </button>

              <button
                onClick={handleCheckout}
                className="bg-indigo-600 text-white px-4 py-2 text-sm rounded-md hover:bg-indigo-700"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Cart
