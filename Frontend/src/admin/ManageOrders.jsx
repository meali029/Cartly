import { useEffect, useState, useContext, useCallback } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getAllOrders, updateOrderStatus, cancelOrder } from '../services/orderService'
import Badge from '../components/ui/Badge'
import { useSocket } from '../hooks/useSocket'
import { 
  ClipboardDocumentListIcon,
  TruckIcon,
  CheckCircleIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  EyeIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ShoppingBagIcon,
  TagIcon
} from '@heroicons/react/24/outline'

const ManageOrders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [cancelReason, setCancelReason] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [expandedOrder, setExpandedOrder] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllOrders()
      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(sortedOrders)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err)
      showToast('Failed to fetch orders', 'error')
    } finally {
      setLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    if (user?.isAdmin) fetchOrders()
  }, [user, fetchOrders])

  // Real-time updates
  useSocket({
    'order:new': fetchOrders,
    'order:update': fetchOrders,
  })

  const handleRefresh = async () => {
    showToast('Refreshing orders...', 'info')
    await fetchOrders()
    showToast('Orders refreshed successfully', 'success')
  }

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus)
      showToast('✅ Status updated')
      fetchOrders()
    } catch (err) {
      console.error('❌ Failed to update order:', err)
      showToast('Update failed', 'error')
    }
  }

  const handleCancel = async (id) => {
    if (!cancelReason.trim()) {
      showToast('Please provide a reason for cancellation', 'error')
      return
    }
    try {
      await cancelOrder(id, cancelReason)
      showToast('✅ Order cancelled')
      setCancelReason('')
      setCancelId(null)
      fetchOrders()
    } catch (err) {
      console.error('❌ Failed to cancel order:', err)
      showToast('Cancel failed', 'error')
    }
  }

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const OrderItems = ({ items }) => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
        <ShoppingBagIcon className="h-4 w-4" />
        <span>Order Items ({items?.length || 0})</span>
      </div>
      <div className="grid gap-3">
        {items && items.length > 0 ? items.map((item, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-shrink-0">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-12 w-12 rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                  <TagIcon className="h-6 w-6 text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 truncate">
                {item.title || 'Product Name'}
              </h4>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-gray-500">
                  Qty: {item.quantity || 1}
                </span>
                <span className="text-xs text-gray-500">
                  Price: PKR {(item.price || 0).toLocaleString()}
                </span>
                {item.size && (
                  <span className="text-xs text-gray-500">
                    Size: {item.size}
                  </span>
                )}
                {item.color && (
                  <span className="text-xs text-gray-500">
                    Color: {item.color}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900">
                PKR {((item.price || 0) * (item.quantity || 1)).toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>
        )) : (
          <div className="text-center py-4 text-gray-500">
            <ShoppingBagIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">No items found</p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Manage Orders
              {orders.length > 0 && (
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({orders.length})
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              View and manage all customer orders
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowPathIcon className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Orders List */}
      {loading && orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading orders...</h3>
          <p className="text-gray-500">Please wait while we fetch the latest orders.</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when customers place them.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && (
            <div className="bg-blue-50 border-b border-blue-200 px-6 py-3">
              <div className="flex items-center">
                <ArrowPathIcon className="h-4 w-4 text-blue-600 mr-2 animate-spin" />
                <span className="text-sm text-blue-800">Refreshing orders...</span>
              </div>
            </div>
          )}
          
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-1/5" />
                <col className="w-1/10" />
                <col className="w-1/10" />
                <col className="w-1/10" />
                <col className="w-1/5" />
                <col className="w-1/12" />
                <col className="w-1/6" />
              </colgroup>
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-3 w-3" />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="h-3 w-3" />
                      <span>Total</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="h-3 w-3" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                      <MapPinIcon className="h-3 w-3" />
                      <span>Address</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center justify-center space-x-1">
                      <EyeIcon className="h-3 w-3" />
                      <span>Details</span>
                    </div>
                  </th>
                  <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <>
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-6 w-6">
                            <div className="h-6 w-6 rounded-full bg-gray-100 flex items-center justify-center">
                              <UserIcon className="h-3 w-3 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-2 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {order.userId?.name || 'Guest'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                              {order.userId?.email || 'No email'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm font-medium text-gray-900">
                          PKR {order.totalPrice.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          text={order.status}
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
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-3">
                        <div className="text-sm text-gray-900">
                          <div className="font-medium truncate">{order.shippingInfo?.address}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <button
                          onClick={() => toggleOrderDetails(order._id)}
                          className="inline-flex items-center px-2 py-1 border border-gray-300 rounded-md text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                        >
                          {expandedOrder === order._id ? (
                            <>
                              <ChevronUpIcon className="h-3 w-3 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <EyeIcon className="h-3 w-3 mr-1" />
                              View
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-3 py-3 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          {order.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleStatusUpdate(order._id, 'shipped')}
                                className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                              >
                                <TruckIcon className="h-3 w-3 mr-1" />
                                Ship
                              </button>
                              {cancelId === order._id ? (
                                <div className="flex flex-col gap-1 min-w-40">
                                  <input
                                    type="text"
                                    placeholder="Reason"
                                    value={cancelReason}
                                    onChange={e => setCancelReason(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 rounded text-xs focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                  />
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleCancel(order._id)}
                                      className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                    >
                                      <XMarkIcon className="h-3 w-3 mr-1" />
                                      Cancel
                                    </button>
                                    <button
                                      onClick={() => { setCancelId(null); setCancelReason('') }}
                                      className="inline-flex items-center px-2 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                      Dismiss
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setCancelId(order._id)}
                                  className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  <XMarkIcon className="h-3 w-3 mr-1" />
                                  Cancel
                                </button>
                              )}
                            </>
                          )}
                          {order.status === 'shipped' && (
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'delivered')}
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                            >
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Deliver
                            </button>
                          )}
                          {order.status === 'delivered' && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-green-800 bg-green-100">
                              <CheckCircleIcon className="h-3 w-3 mr-1" />
                              Done
                            </span>
                          )}
                          {order.status === 'cancelled' && (
                            <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium text-red-800 bg-red-100">
                              <XMarkIcon className="h-3 w-3 mr-1" />
                              Cancelled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="7" className="px-6 py-4 bg-gray-50">
                          <div className="max-w-4xl">
                            <OrderItems items={order.items} />
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden">
            <div className="divide-y divide-gray-200">
              {orders.map((order) => (
                <div key={order._id} className="p-3 space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 min-w-0 flex-1">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {order.userId?.name || 'Guest'}
                        </div>
                        <div className="text-xs text-gray-500 truncate">
                          {order.userId?.email || 'No email'}
                        </div>
                      </div>
                    </div>
                    <Badge
                      text={order.status}
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

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="flex items-center space-x-1 text-gray-500 mb-1">
                        <CurrencyDollarIcon className="h-3 w-3" />
                        <span>Total</span>
                      </div>
                      <div className="font-medium text-gray-900">
                        PKR {order.totalPrice.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-1 text-gray-500 mb-1">
                        <CalendarDaysIcon className="h-3 w-3" />
                        <span>Date</span>
                      </div>
                      <div className="text-gray-900">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <div className="flex items-center space-x-1 text-gray-500 mb-1">
                      <MapPinIcon className="h-3 w-3" />
                      <span>Address</span>
                    </div>
                    <div className="text-sm text-gray-900">
                      <div className="font-medium truncate">{order.shippingInfo?.address}</div>
                      <div className="text-gray-500 truncate">
                        {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex flex-wrap gap-2">
                      {/* View Details Button - Always visible */}
                      <button
                        onClick={() => toggleOrderDetails(order._id)}
                        className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        {expandedOrder === order._id ? (
                          <>
                            <ChevronUpIcon className="h-4 w-4 mr-1" />
                            Hide Details
                          </>
                        ) : (
                          <>
                            <EyeIcon className="h-4 w-4 mr-1" />
                            View Details
                          </>
                        )}
                      </button>
                      
                      {/* Status Action Buttons */}
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusUpdate(order._id, 'shipped')}
                            className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                          >
                            <TruckIcon className="h-4 w-4 mr-1" />
                            Ship
                          </button>
                          {cancelId === order._id ? (
                            <div className="w-full mt-2 space-y-2">
                              <input
                                type="text"
                                placeholder="Cancellation reason"
                                value={cancelReason}
                                onChange={e => setCancelReason(e.target.value)}
                                className="w-full border border-gray-300 px-2 py-1 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleCancel(order._id)}
                                  className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                                >
                                  <XMarkIcon className="h-4 w-4 mr-1" />
                                  Cancel
                                </button>
                                <button
                                  onClick={() => { setCancelId(null); setCancelReason('') }}
                                  className="flex-1 inline-flex items-center justify-center px-2 py-1 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Dismiss
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelId(order._id)}
                              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                            >
                              <XMarkIcon className="h-4 w-4 mr-1" />
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => handleStatusUpdate(order._id, 'delivered')}
                          className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                        >
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Mark Delivered
                        </button>
                      )}
                      {order.status === 'delivered' && (
                        <span className="w-full inline-flex items-center justify-center px-3 py-2 rounded text-sm font-medium text-green-800 bg-green-100">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          Completed
                        </span>
                      )}
                      {order.status === 'cancelled' && (
                        <span className="w-full inline-flex items-center justify-center px-3 py-2 rounded text-sm font-medium text-red-800 bg-red-100">
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancelled
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Expandable Order Details for Mobile */}
                  {expandedOrder === order._id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <OrderItems items={order.items} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrders