import { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { placeOrder } from '../services/orderService'
import { useNavigate } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: user?.name || '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  })

  const [paymentMethod, setPaymentMethod] = useState('COD')
  const [loading, setLoading] = useState(false)

  const getTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOrder = async (e) => {
    e.preventDefault()

    if (!user) {
      showToast('🚫 Please login to place an order', 'error')
      return
    }

    const { name, address, phone } = form
    if (!name.trim() || !address.trim() || !phone.trim()) {
      showToast('⚠️ All fields are required', 'error')
      return
    }

    if (cartItems.length === 0) {
      showToast('🛒 Your cart is empty', 'error')
      return
    }

    const orderPayload = {
      userId: user._id,
      items: cartItems.map(({ product, quantity, size }) => ({
        productId: product._id,
        quantity,
        size,
      })),
      totalPrice: getTotal(),
      shippingInfo: {
        address: form.address,
        city: form.city,
        postalCode: form.postalCode,
        country: form.country,
      },
      paymentStatus: paymentMethod === 'Card' ? 'paid' : 'unpaid',
      paymentMethod,
    }

    try {
      setLoading(true)
      await placeOrder(orderPayload, user.token)

      showToast('✅ Order placed successfully!')
      clearCart()
      navigate('/profile')
    } catch (err) {
      console.error('❌ Order error:', err)
      showToast('Failed to place order', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Checkout</h1>

      {/* 🧾 Order Summary */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Order Summary:</h3>
        {cartItems.length > 0 ? (
          cartItems.map(({ product, quantity, size }) => (
            <div
              key={`${product._id}-${size || 'default'}`}
              className="flex justify-between text-sm mb-1"
            >
              <span>
                {product.title} {size && `(${size})`} × {quantity}
              </span>
              <span>PKR {product.price * quantity}</span>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
        <div className="font-bold mt-2">
          Total: PKR {getTotal().toLocaleString()}
        </div>
      </div>

      {/* 📮 Shipping Info */}
      <form onSubmit={handleOrder} className="space-y-4 max-w-md mx-auto">
        <Input
          label="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
        />
        <Input
          label="City"
          name="city"
          value={form.city}
          onChange={handleChange}
          required
        />
        <Input
          label="Postal Code"
          name="postalCode"
          value={form.postalCode}
          onChange={handleChange}
          required
        />
        <Input
          label="Country"
          name="country"
          value={form.country}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        {/* 💳 Payment Method */}
        <div>
          <label className="block text-sm font-medium mb-1">Payment Method</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="COD"
                checked={paymentMethod === 'COD'}
                onChange={() => setPaymentMethod('COD')}
                className="accent-indigo-600"
              />
              Cash on Delivery
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="Card"
                checked={paymentMethod === 'Card'}
                onChange={() => setPaymentMethod('Card')}
                className="accent-indigo-600"
              />
              Card
            </label>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? <Spinner size="sm" /> : 'Place Order'}
        </Button>
      </form>
    </div>
  )
}

export default Checkout
