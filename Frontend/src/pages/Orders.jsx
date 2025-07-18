import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getUserOrders } from '../services/orderService'
import Badge from '../components/ui/Badge'
import { useSocket } from '../hooks/useSocket'
import { 
  ShoppingBagIcon, 
  ClockIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  TagIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Orders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewedOrders, setViewedOrders] = useState(new Set())
  const [hasLoadedViewedOrders, setHasLoadedViewedOrders] = useState(false)

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getUserOrders(user._id)
      console.log('📦 Orders data received:', data) // Debug log
      setOrders(data)
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err)
      showToast('Failed to load your orders', 'error')
    } finally {
      setLoading(false)
    }
  }, [user?._id, showToast])

  useEffect(() => {
    if (user?._id) {
      loadOrders()
      // Load viewed orders from localStorage when component mounts
      const stored = localStorage.getItem(`viewedOrders_${user._id}`)
      if (stored) {
        setViewedOrders(new Set(JSON.parse(stored)))
      }
      setHasLoadedViewedOrders(true)
    }
  }, [user?._id, loadOrders])

  // Mark orders as viewed after a short delay to show NEW tags first
  useEffect(() => {
    if (orders.length > 0 && user?._id && hasLoadedViewedOrders) {
      const timer = setTimeout(() => {
        const stored = localStorage.getItem(`viewedOrders_${user._id}`)
        const existingViewed = stored ? new Set(JSON.parse(stored)) : new Set()
        
        // Find orders that haven't been viewed yet
        const newOrderIds = []
        orders.forEach(order => {
          if (!existingViewed.has(order._id)) {
            newOrderIds.push(order._id)
          }
        })
        
        if (newOrderIds.length > 0) {
          // Add new order IDs to viewed orders after showing them
          const updatedViewed = new Set([...existingViewed, ...newOrderIds])
          localStorage.setItem(`viewedOrders_${user._id}`, JSON.stringify([...updatedViewed]))
        }
      }, 2000) // Show NEW tags for 2 seconds before marking as viewed
      
      return () => clearTimeout(timer)
    }
  }, [orders, user?._id, hasLoadedViewedOrders])

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'delivered':
        return <CheckCircleIcon className="w-5 h-5 text-green-600" />
      case 'shipped':
        return <TruckIcon className="w-5 h-5 text-blue-600" />
      case 'cancelled':
        return <XCircleIcon className="w-5 h-5 text-red-600" />
      default:
        return <ClockIcon className="w-5 h-5 text-yellow-600" />
    }
  }

  // Real-time: Refresh orders when updated by admin
  useSocket({
    'order:update': loadOrders,
    'order:new': loadOrders,
  })

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/4 mb-8"></div>
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-slate-200 rounded-xl h-48"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Professional Header */}
      <div className="flex items-center gap-3 mb-8">
        <ShoppingBagIcon className="w-8 h-8 text-slate-600" />
        <h1 className="text-4xl font-bold text-slate-900">Your Orders</h1>
        {orders.length > 0 && (
          <Badge text={`${orders.length}`} color="slate" />
        )}
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-slate-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 transform hover:scale-105 transition-transform duration-300">
            <ShoppingBagIcon className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-900 mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Start shopping to see your orders here</p>
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            <ShoppingBagIcon className="w-5 h-5" />
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 relative overflow-hidden transform hover:scale-[1.02]"
              >
                {/* New Order Tag */}
                {!viewedOrders.has(order._id) && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-xl text-xs font-bold flex items-center gap-1">
                      <SparklesIcon className="w-3 h-3" />
                      NEW
                    </div>
                  </div>
                )}

                {/* Professional Order Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
                    <div className="bg-slate-100 rounded-full p-2 transform hover:scale-110 transition-transform duration-300">
                      {getStatusIcon(order.status)}
                    </div>
                    <div>
                      <h2 className="font-semibold text-slate-900 text-lg">
                        Order #{order._id.slice(-6)}
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {new Date(order.createdAt).toLocaleDateString('en-PK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                  </div>
                  <Badge
                    text={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    color={
                      order.status === 'delivered'
                        ? 'green'
                        : order.status === 'shipped'
                        ? 'blue'
                        : order.status === 'cancelled'
                        ? 'red'
                        : 'yellow'
                    }
                  />
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-slate-700">Total:</span>
                    <span className="text-lg font-bold text-slate-900">
                      PKR {order.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TagIcon className="w-5 h-5 text-slate-600" />
                    <span className="text-sm font-medium text-slate-700">Items:</span>
                    <span className="text-sm text-slate-900">
                      {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="bg-slate-50 rounded-2xl p-4">
                  <h4 className="font-medium text-slate-900 mb-3">Order Details</h4>
                  <div className="space-y-3">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, index) => {
                        // Handle different data structures
                        const productName = item.title || item.productId?.title || 'Product Name Not Available'
                        const productPrice = item.price || item.productId?.price || 0
                        const productImage = item.image || item.productId?.image
                        const itemQuantity = item.quantity || 1
                        const itemSize = item.size || item.productId?.size
                        const itemColor = item.color || item.productId?.color
                        
                        return (
                          <div key={index} className="flex gap-4 py-3 border-b border-gray-200 last:border-b-0">
                            {/* Product Image */}
                            {productImage && (
                              <div className="flex-shrink-0">
                                <img 
                                  src={productImage} 
                                  alt={productName}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    e.target.style.display = 'none'
                                  }}
                                />
                              </div>
                            )}
                            
                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="font-medium text-gray-900 truncate">
                                {productName}
                              </div>
                              <div className="text-sm text-gray-600 mt-1 space-y-1">
                                <div>Quantity: <span className="font-medium">{itemQuantity}</span></div>
                                {itemSize && (
                                  <div>Size: <span className="font-medium">{itemSize}</span></div>
                                )}
                                {itemColor && (
                                  <div>Color: <span className="font-medium">{itemColor}</span></div>
                                )}
                                <div className="text-gray-500">
                                  Unit Price: PKR {productPrice.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            
                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <div className="font-semibold text-gray-900 text-lg">
                                PKR {(productPrice * itemQuantity).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <div className="text-gray-400 mb-2">📦</div>
                        <div>No items found in this order</div>
                        <div className="text-sm mt-1">Please contact support if this seems incorrect</div>
                      </div>
                    )}
                  </div>
                  
                  {/* Order Summary */}
                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-300">
                      <div className="flex justify-between items-center text-lg">
                        <span className="font-semibold text-gray-900">Total Amount:</span>
                        <span className="font-bold text-gray-900">
                          PKR {order.totalPrice?.toLocaleString() || '0'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Cancellation Reason */}
                {order.status === 'cancelled' && order.cancelReason && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircleIcon className="w-5 h-5 text-red-600" />
                      <span className="text-sm font-medium text-red-800">
                        Cancellation Reason:
                      </span>
                    </div>
                    <p className="text-sm text-red-700 mt-1">{order.cancelReason}</p>
                  </div>
                )}

                {/* Delivery Address */}
                {order.shippingAddress && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="text-sm font-medium text-blue-800 mb-1">Delivery Address</h5>
                    <p className="text-sm text-blue-700">
                      {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                    </p>
                  </div>
                )}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Orders
