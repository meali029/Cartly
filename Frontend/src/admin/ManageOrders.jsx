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
  ArrowPathIcon
} from '@heroicons/react/24/outline'

const ManageOrders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [cancelReason, setCancelReason] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

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
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <UserIcon className="h-4 w-4" />
                      <span>Customer</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>Total</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <CalendarDaysIcon className="h-4 w-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <MapPinIcon className="h-4 w-4" />
                      <span>Shipping Address</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <UserIcon className="h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {order.userId?.name || 'Guest'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {order.userId?.email || 'No email'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        PKR {order.totalPrice.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        <div className="font-medium">{order.shippingInfo?.address}</div>
                        <div className="text-gray-500">
                          {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}
                        </div>
                        <div className="text-gray-500">{order.shippingInfo?.country}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {order.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order._id, 'shipped')}
                              className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200"
                            >
                              <TruckIcon className="h-3 w-3 mr-1" />
                              Ship
                            </button>
                            {cancelId === order._id ? (
                              <div className="flex flex-col gap-2 min-w-48">
                                <input
                                  type="text"
                                  placeholder="Reason for cancellation"
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
                                className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
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
                            className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
                          >
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Deliver
                          </button>
                        )}
                        {order.status === 'delivered' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-green-800 bg-green-100">
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                            Completed
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-medium text-red-800 bg-red-100">
                            <XMarkIcon className="h-3 w-3 mr-1" />
                            Cancelled
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrders