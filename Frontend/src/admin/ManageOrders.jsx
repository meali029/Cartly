import { useEffect, useState, useContext, useCallback } from 'react'
import axios from 'axios'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import Badge from '../components/ui/Badge'
import { useSocket } from '../hooks/useSocket'

const ManageOrders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])
  const [cancelReason, setCancelReason] = useState('')
  const [cancelId, setCancelId] = useState(null)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      setOrders(res.data)
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err)
      showToast('Failed to fetch orders', 'error')
    }
  }, [user.token, showToast])

  useEffect(() => {
    if (user?.isAdmin) fetchOrders()
  }, [user, fetchOrders])

  // Real-time updates
  useSocket({
    'order:new': fetchOrders,
    'order:update': fetchOrders,
  })

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
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
      await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/orders/${id}`,
        { status: 'cancelled', cancelReason },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      )
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
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Manage Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border rounded-md">
            <thead className="bg-gray-100 text-sm text-left">
              <tr>
                <th className="p-3">User</th>
                <th className="p-3">Total (PKR)</th>
                <th className="p-3">Status</th>
                <th className="p-3">Placed</th>
                <th className="p-3">Shipping Address</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y">
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="p-3">{order.userId?.name || 'Guest'}</td>
                  <td className="p-3">{order.totalPrice.toLocaleString()}</td>
                  <td className="p-3">
                    <Badge
                      text={order.status}
                      color={
                        order.status === 'delivered'
                          ? 'green'
                          : order.status === 'shipped'
                          ? 'blue'
                          : 'yellow'
                      }
                    />
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium">{order.shippingInfo?.address}</div>
                      <div className="text-xs text-gray-500">
                        {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}, {order.shippingInfo?.country}
                      </div>
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    {order.status === 'pending' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'shipped')}
                        className="text-blue-600 hover:underline"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => handleStatusUpdate(order._id, 'delivered')}
                        className="text-green-600 hover:underline"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    {order.status === 'delivered' && <span className="text-gray-400">Completed</span>}
                    {/* Cancel only if order is pending */}
                    {order.status === 'pending' && (
                      <>
                        {cancelId === order._id ? (
                          <div className="flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Reason for cancellation"
                              value={cancelReason}
                              onChange={e => setCancelReason(e.target.value)}
                              className="border px-2 py-1 rounded text-sm"
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleCancel(order._id)}
                                className="text-red-600 hover:underline text-sm"
                              >
                                Confirm Cancel
                              </button>
                              <button
                                onClick={() => { setCancelId(null); setCancelReason('') }}
                                className="text-gray-500 hover:underline text-sm"
                              >
                                Dismiss
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setCancelId(order._id)}
                            className="text-red-600 hover:underline text-sm"
                          >
                            Cancel Order
                          </button>
                        )}
                      </>
                    )}
                    {order.status === 'cancelled' && (
                      <span className="text-red-400">Cancelled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageOrders