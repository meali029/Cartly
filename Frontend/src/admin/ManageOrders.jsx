import { useEffect, useState, useContext, useCallback, useMemo } from 'react'
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
  MapPinIcon,
  CalendarDaysIcon,
  UserIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  EyeIcon,
  ShoppingBagIcon,
  TagIcon,
  PhoneIcon,
  ClipboardDocumentIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const ManageOrders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [cancelReason, setCancelReason] = useState('')
  const [cancelId, setCancelId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getAllOrders()
      // Sort orders by creation date (newest first)
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      setOrders(sortedOrders)
      setLastUpdated(new Date())
    } catch (err) {
      showToast('Failed to fetch orders', err)
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

  // Normalizes input: strips 'order', spaces, and non-alphanumerics
  const normalizeQuery = (str) =>
    (str || '')
      .toString()
      .toLowerCase()
      .replace(/order/g, '')
      .replace(/[^a-z0-9]/g, '')

  const filteredOrders = useMemo(() => {
    const q = normalizeQuery(searchTerm)
    if (!q) return orders
    return orders.filter((o) => {
      const full = (o._id || '').toString().toLowerCase()
      const shortId = full.slice(-6)
      return full.includes(q) || shortId.includes(q)
    })
  }, [orders, searchTerm])

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateOrderStatus(id, newStatus)
      showToast('✅ Status updated')
      fetchOrders()
    } catch (err) {
      showToast('Update failed', err)
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
      showToast('Cancel failed', err)
    }
  }

  const openDetails = (order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const closeDetails = () => {
    setIsDetailsOpen(false)
    setSelectedOrder(null)
    setCancelId(null)
    setCancelReason('')
  }

  const copyOrderDetails = async (order) => {
    const orderDetails = `
ORDER DETAILS
=============
Order ID: ${order._id}
Date: ${new Date(order.createdAt).toLocaleString()}
Status: ${order.status}
Total Amount: PKR ${order.totalPrice.toLocaleString()}

CUSTOMER INFORMATION
===================
Name: ${order.userId?.name || 'Guest'}
Email: ${order.userId?.email || 'No email'}
Phone: ${order.customerInfo?.phone || 'No phone number'}

SHIPPING ADDRESS
===============
Address: ${order.shippingInfo?.address || 'No address'}
City: ${order.shippingInfo?.city || 'No city'}
Postal Code: ${order.shippingInfo?.postalCode || 'No postal code'}

ORDER ITEMS
===========
${order.items?.map((item, index) => `
${index + 1}. ${item.title || 'Product'}
   - Quantity: ${item.quantity || 1}
   - Price: PKR ${(item.price || 0).toLocaleString()}
   - Total: PKR ${((item.price || 0) * (item.quantity || 1)).toLocaleString()}
   ${item.size ? `- Size: ${item.size}` : ''}
   ${item.color ? `- Color: ${item.color}` : ''}
`).join('') || 'No items'}

PAYMENT SUMMARY
==============
Subtotal: PKR ${(order.totalPrice - (order.deliveryCharges || 0)).toLocaleString()}
Delivery Charges: PKR ${(order.deliveryCharges || 0).toLocaleString()}
Total: PKR ${order.totalPrice.toLocaleString()}
`.trim()

    try {
      await navigator.clipboard.writeText(orderDetails)
      showToast('Order details copied to clipboard!', 'success')
    } catch (error) {
      showToast('Failed to copy order details', 'error')
      console.error('Copy failed:', error)
    }
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
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-100 p-2 rounded-lg">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Orders
              {orders.length > 0 && (
                <span className="ml-2 text-lg font-normal text-gray-500">
                  ({searchTerm ? `${filteredOrders.length} of ${orders.length}` : orders.length})
                </span>
              )}
            </h1>
            <p className="text-gray-600">
              View orders and open details in a popup
              {lastUpdated && (
                <span className="ml-2 text-sm text-gray-500">
                  • Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Search by Order ID (supports short ID e.g., last 6 chars) */}
          <div className="relative flex-1 min-w-[220px] sm:min-w-[260px]">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MagnifyingGlassIcon className="h-4 w-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Order ID (e.g., 7b8131 or full ID)"
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-md text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
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
      </div>

      {/* Loading / Empty */}
      {loading && orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ArrowPathIcon className="h-12 w-12 text-gray-400 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Loading orders...</h3>
          <p className="text-gray-500">Please wait while we fetch the latest orders.</p>
        </div>
      )}

      {!loading && orders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-500">Orders will appear here when customers place them.</p>
        </div>
      )}

      {/* Simple, responsive list of orders */}
      {orders.length > 0 && searchTerm && filteredOrders.length === 0 && (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-600">
          No orders match “{searchTerm}”. Try the last 6 characters (e.g., Order #abcdef).
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {filteredOrders.map((order) => (
          <div key={order._id} className="bg-white rounded-lg shadow p-4 flex items-start justify-between">
            <div className="flex items-start space-x-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                <UserIcon className="h-5 w-5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-sm font-semibold text-gray-900 truncate max-w-[180px] sm:max-w-[260px]">
                    {order.userId?.name || 'Guest'}
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
                  <span className="text-xs text-gray-500">• Order #{(order._id || '').toString().slice(-6)}</span>
                </div>
                <div className="text-xs text-gray-500 truncate max-w-[260px]">
                  {order.userId?.email || 'No email'}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 mt-2">
                  <div className="flex items-center">
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1 text-gray-400" />
                    Order #{(order._id || '').toString().slice(-6)}
                  </div>
                  <div className="flex items-center">
                    <PhoneIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {order.customerInfo?.phone || 'N/A'}
                  </div>
                  <div className="flex items-center">
                    <CurrencyDollarIcon className="h-4 w-4 mr-1 text-gray-400" />
                    PKR {order.totalPrice.toLocaleString()}
                  </div>
                  <div className="flex items-center">
                    <CalendarDaysIcon className="h-4 w-4 mr-1 text-gray-400" />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center truncate max-w-[220px]">
                    <MapPinIcon className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="truncate">{order.shippingInfo?.city}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => copyOrderDetails(order)}
                className="inline-flex items-center px-2 py-1 border border-green-300 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                title="Copy order details"
              >
                <ClipboardDocumentIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => openDetails(order)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <EyeIcon className="h-4 w-4 mr-1" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Details Modal */}
      {isDetailsOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeDetails} />
          <div className="relative bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden">
      {/* Modal header */}
            <div className="px-5 py-4 border-b flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-500">Order ID</div>
        <div className="text-sm font-semibold text-gray-900 truncate">{selectedOrder._id}</div>
        <div className="text-xs text-gray-500">Short: #{(selectedOrder._id || '').toString().slice(-6)}</div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  text={selectedOrder.status}
                  color={
                    selectedOrder.status === 'delivered'
                      ? 'green'
                      : selectedOrder.status === 'shipped'
                      ? 'blue'
                      : selectedOrder.status === 'cancelled'
                      ? 'red'
                      : 'yellow'
                  }
                />
                <button
                  onClick={closeDetails}
                  className="inline-flex items-center px-2 py-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal body */}
            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Customer & Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-500" />
                    {selectedOrder.userId?.name || 'Guest'}
                  </div>
                  <div className="text-xs text-gray-600 truncate">{selectedOrder.userId?.email || 'No email'}</div>
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    {selectedOrder.customerInfo?.phone || 'N/A'}
                    {selectedOrder.customerInfo?.alternatePhone && (
                      <span className="text-gray-400">• Alt: {selectedOrder.customerInfo.alternatePhone}</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-xs text-gray-600 flex items-center gap-2">
                    <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
                    {new Date(selectedOrder.createdAt).toLocaleString()}
                  </div>
                  <div className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
                    PKR {selectedOrder.totalPrice.toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-900 mb-1">
                  <MapPinIcon className="h-4 w-4" />
                  Shipping Address
                </div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{selectedOrder.shippingInfo?.address}</div>
                  <div className="text-gray-600">
                    {selectedOrder.shippingInfo?.area ? `${selectedOrder.shippingInfo.area}, ` : ''}
                    {selectedOrder.shippingInfo?.city}, {selectedOrder.shippingInfo?.postalCode}, {selectedOrder.shippingInfo?.country}
                  </div>
                  {selectedOrder.customerInfo?.instructions && (
                    <div className="text-gray-600 mt-1">Note: {selectedOrder.customerInfo.instructions}</div>
                  )}
                </div>
              </div>

              {/* Items */}
              <OrderItems items={selectedOrder.items} />

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t">
                <div className="flex items-center gap-2">
                  {selectedOrder.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleStatusUpdate(selectedOrder._id, 'shipped')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200"
                      >
                        <TruckIcon className="h-4 w-4 mr-1" />
                        Mark Shipped
                      </button>
                      {cancelId === selectedOrder._id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Reason"
                            value={cancelReason}
                            onChange={e => setCancelReason(e.target.value)}
                            className="border border-gray-300 px-2 py-1 rounded text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500"
                          />
                          <button
                            onClick={() => handleCancel(selectedOrder._id)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                          >
                            <XMarkIcon className="h-4 w-4 mr-1" />
                            Confirm Cancel
                          </button>
                          <button
                            onClick={() => { setCancelId(null); setCancelReason('') }}
                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                          >
                            Dismiss
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setCancelId(selectedOrder._id)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-red-700 bg-red-100 hover:bg-red-200"
                        >
                          <XMarkIcon className="h-4 w-4 mr-1" />
                          Cancel Order
                        </button>
                      )}
                    </>
                  )}
                  {selectedOrder.status === 'shipped' && (
                    <button
                      onClick={() => handleStatusUpdate(selectedOrder._id, 'delivered')}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded text-green-700 bg-green-100 hover:bg-green-200"
                    >
                      <CheckCircleIcon className="h-4 w-4 mr-1" />
                      Mark Delivered
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => copyOrderDetails(selectedOrder)}
                    className="inline-flex items-center px-3 py-2 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                  >
                    <ClipboardDocumentIcon className="h-4 w-4 mr-1" />
                    Copy Details
                  </button>
                  <button
                    onClick={closeDetails}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageOrders