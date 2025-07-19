import { useState, useContext } from 'react'
import { CartContext } from '../context/CartContext'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { placeOrder } from '../services/orderService'
import { useNavigate, useLocation } from 'react-router-dom'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Spinner from '../components/ui/Spinner'
import Badge from '../components/ui/Badge'

const Checkout = () => {
  const { cartItems, clearCart } = useContext(CartContext)
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Get buy now item from navigation state
  const buyNowItem = location.state?.buyNowItem
  
  // Use buy now item if available, otherwise use cart items
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems

  // Pakistani cities - simplified list
  const pakistaniCities = [
    'Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Faisalabad', 'Multan', 
    'Peshawar', 'Quetta', 'Sialkot', 'Gujranwala', 'Hyderabad', 'Bahawalpur',
    'Other City'
  ]

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    area: '',
    postalCode: '',
    instructions: ''
  })

  const [loading, setLoading] = useState(false)
  const [orderStatus, setOrderStatus] = useState(null) // 'placing', 'success', 'error'
  const [errors, setErrors] = useState({})

  const getTotal = () =>
    checkoutItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    )

  const getShippingCost = () => {
    const total = getTotal()
    if (total >= 5000) return 0 // Free shipping for orders above PKR 5000
    return 200 // Standard shipping cost
  }

  const getFinalTotal = () => getTotal() + getShippingCost()

  const validateForm = () => {
    const newErrors = {}
    
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.phone.trim()) newErrors.phone = 'Phone number is required'
    if (!form.address.trim()) newErrors.address = 'Address is required'
    if (!form.city.trim()) newErrors.city = 'City is required'
    if (!form.area.trim()) newErrors.area = 'Area is required'
    
    // Pakistani phone number validation
    if (form.phone && !/^(\+92|0)?[0-9]{10}$/.test(form.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'Please enter a valid Pakistani phone number (e.g., 03123456789)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' })
    }
  }

  const handleOrder = async (e) => {
    e.preventDefault()

    if (!user) {
      showToast('Please login to place an order', 'error')
      navigate('/login')
      return
    }

    if (!validateForm()) {
      showToast('Please fill all required fields correctly', 'error')
      return
    }

    if (checkoutItems.length === 0) {
      showToast('No items to order', 'error')
      return
    }

    const orderPayload = {
      userId: user._id,
      items: checkoutItems.map(({ product, quantity, size, color }) => ({
        productId: product._id,
        title: product.title,
        price: product.price,
        quantity,
        size,
        color,
        image: product.image
      })),
      totalPrice: getFinalTotal(),
      shippingInfo: {
        address: form.address,
        city: form.city,
        area: form.area,
        postalCode: form.postalCode,
        country: 'Pakistan',
      },
      paymentStatus: 'unpaid',
      paymentMethod: 'COD',
      customerInfo: {
        phone: form.phone,
        alternatePhone: form.alternatePhone,
        instructions: form.instructions
      }
    }

    try {
      setLoading(true)
      setOrderStatus('placing')
      
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await placeOrder(orderPayload)

      setOrderStatus('success')
      showToast('Order placed successfully! 🎉', 'success')
      
      // Wait a moment before clearing cart and navigating
      setTimeout(() => {
        // Only clear cart if we're not in buy now mode
        if (!buyNowItem) {
          clearCart()
        }
        navigate('/orders')
      }, 1500)
      
    } catch (err) {
      setOrderStatus(err)
      
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to place order'
      
      if (err?.response?.status === 401) {
        showToast('Please login to place an order', 'error')
        // Redirect to login if not authenticated
        setTimeout(() => navigate('/login'), 2000)
      } else {
        showToast('❌ ' + errorMessage, 'error')
      }
    } finally {
      setTimeout(() => {
        setLoading(false)
        setOrderStatus(null)
      }, 2000)
    }
  }

  if (checkoutItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center max-w-md transform hover:shadow-3xl transition-all duration-500">
          <div className="text-slate-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">No items to checkout</h2>
          <p className="text-slate-600 mb-4">Add some items to continue with checkout</p>
          <Button onClick={() => navigate('/')} className="bg-slate-900 hover:bg-slate-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
              loading ? 'bg-yellow-500 animate-pulse' : 'bg-slate-600'
            }`}>
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L9 18m0 0h10" />
                </svg>
              )}
            </div>
            <h1 className="text-4xl font-bold text-slate-900 transform hover:scale-105 transition-all duration-300">
              {loading ? 'Processing Order...' : 'Secure Checkout'}
            </h1>
            <Badge variant="success" className={`transition-all duration-300 ${
              loading ? 'bg-yellow-100 text-yellow-700' : 'bg-slate-100 text-slate-700'
            }`}>
              {loading ? 'Processing...' : 'Cash on Delivery Only'}
            </Badge>
          </div>
          
          {/* Progress bar */}
          {loading && (
            <div className="mt-4">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div className="bg-slate-600 h-2 rounded-full animate-pulse" style={{ width: '70%' }}></div>
              </div>
              <p className="text-sm text-slate-600 mt-2">
                {orderStatus === 'placing' && 'Validating order details...'}
                {orderStatus === 'success' && 'Order confirmed! Redirecting...'}
                {orderStatus === 'error' && 'Order failed. Please try again.'}
                {!orderStatus && 'Processing your order...'}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Order Summary */}
          <div className="lg:order-2">
            <div className={`bg-white rounded-3xl shadow-xl p-6 sticky top-6 transition-all duration-500 transform hover:shadow-2xl ${
              loading ? 'opacity-75 ring-2 ring-slate-300' : ''
            }`}>
              <h2 className={`text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2 ${loading ? 'animate-pulse' : ''}`}>
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {loading ? 'Processing Order...' : 'Order Summary'}
              </h2>
              
              <div className="space-y-4 mb-6">
                {checkoutItems.map(({ product, quantity, size }) => (
                  <div key={`${product._id}-${size || 'default'}`} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-all duration-300 rounded-xl">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded-xl shadow-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-slate-900">{product.title}</h3>
                      {size && (
                        <Badge variant="secondary" className="mt-1 bg-slate-100 text-slate-700">
                          Size: {size}
                        </Badge>
                      )}
                      <p className="text-sm text-slate-600">Qty: {quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-slate-900">PKR {(product.price * quantity).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="text-slate-900">PKR {getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className={getShippingCost() === 0 ? 'text-slate-600 font-medium' : 'text-slate-900'}>
                    {getShippingCost() === 0 ? 'FREE' : `PKR ${getShippingCost()}`}
                  </span>
                </div>
                {getShippingCost() === 0 && (
                  <p className="text-xs text-slate-600">Free shipping on orders above PKR 5,000</p>
                )}
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-700">Total</span>
                  <span className="text-slate-900">PKR {getFinalTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-semibold text-slate-800">Cash on Delivery</h3>
                </div>
                <p className="text-sm text-slate-700">
                  Pay when your order is delivered to your doorstep. No advance payment required.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Form */}
          <div className="lg:order-1">
            <div className="bg-white rounded-3xl shadow-xl p-6 transform hover:shadow-2xl transition-all duration-500">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Delivery Information
              </h2>
              
              <form onSubmit={handleOrder} className={`space-y-6 ${loading ? 'opacity-75 pointer-events-none' : ''}`}>
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">Personal Information</h3>
                  
                  <Input
                    label="Full Name *"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    error={errors.name}
                    placeholder="Enter your full name"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number *"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      error={errors.phone}
                      placeholder="03xxxxxxxxx"
                    />
                    <Input
                      label="Alternate Phone"
                      name="alternatePhone"
                      value={form.alternatePhone}
                      onChange={handleChange}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                {/* Address Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-slate-900 border-b border-slate-200 pb-2">
                    Delivery Address <span className="text-slate-600 text-sm">(Pakistan Only)</span>
                  </h3>
                  
                  <Input
                    label="Complete Address *"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    error={errors.address}
                    placeholder="House/Building number, Street, Area, City"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        City *
                      </label>
                      <select
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 ${
                          errors.city ? 'border-red-500' : 'border-slate-300'
                        }`}
                      >
                        <option value="">Select your city</option>
                        {pakistaniCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
                    </div>
                    
                    <Input
                      label="Area/Sector *"
                      name="area"
                      value={form.area}
                      onChange={handleChange}
                      error={errors.area}
                      placeholder="e.g., DHA, Gulberg, F-7"
                    />
                  </div>
                  
                  <Input
                    label="Postal Code (Optional)"
                    name="postalCode"
                    value={form.postalCode}
                    onChange={handleChange}
                    placeholder="e.g., 75400"
                  />
                  
                  {/* Delivery Info */}
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <h4 className="font-medium text-slate-900">Delivery Information</h4>
                    </div>
                    <ul className="text-sm text-slate-800 space-y-1">
                      <li>• We deliver only within Pakistan</li>
                      <li>• Delivery time: 2-5 business days</li>
                      <li>• Free delivery on orders above PKR 5,000</li>
                      <li>• Please provide complete address with landmarks</li>
                    </ul>
                  </div>
                </div>

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    name="instructions"
                    value={form.instructions}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300"
                    placeholder="Any additional notes for delivery (e.g., 'Call before arriving', 'Leave at gate')"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-6">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      loading 
                        ? 'bg-slate-400 cursor-not-allowed' 
                        : orderStatus === 'success'
                        ? 'bg-slate-500 hover:bg-slate-600'
                        : orderStatus === 'error'
                        ? 'bg-red-500 hover:bg-red-600'
                        : 'bg-slate-900 hover:bg-slate-800'
                    } text-white rounded-xl`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="relative">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        </div>
                        <span>
                          {orderStatus === 'placing' && 'Processing your order...'}
                          {orderStatus === 'success' && 'Order placed successfully! 🎉'}
                          {orderStatus === 'error' && 'Order failed. Please try again.'}
                          {!orderStatus && 'Placing Order...'}
                        </span>
                      </div>
                    ) : orderStatus === 'success' ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Order Placed Successfully!</span>
                      </div>
                    ) : orderStatus === 'error' ? (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <span>Try Again</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span>Place Order - PKR {getFinalTotal().toLocaleString()}</span>
                      </div>
                    )}
                  </Button>
                  
                  {/* Loading overlay */}
                  {loading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white rounded-3xl p-8 text-center max-w-sm mx-4 shadow-2xl transform animate-pulse">
                        <div className="mb-4">
                          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-600 rounded-full animate-spin mx-auto"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          {orderStatus === 'placing' && 'Processing Your Order'}
                          {orderStatus === 'success' && 'Order Placed Successfully!'}
                          {orderStatus === 'error' && 'Order Failed'}
                          {!orderStatus && 'Processing...'}
                        </h3>
                        <p className="text-sm text-slate-600">
                          {orderStatus === 'placing' && 'Please wait while we process your order...'}
                          {orderStatus === 'success' && 'Redirecting to your orders...'}
                          {orderStatus === 'error' && 'Something went wrong. Please try again.'}
                          {!orderStatus && 'Please wait...'}
                        </p>
                        
                        {orderStatus === 'success' && (
                          <div className="mt-4 text-slate-600">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                        
                        {orderStatus === 'error' && (
                          <div className="mt-4 text-red-600">
                            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <p className="text-xs text-slate-600 text-center mt-3">
                    By placing this order, you agree to our terms and conditions.
                    Your order will be confirmed via phone call.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
