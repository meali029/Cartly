import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { getUserOrders } from '../services/orderService'
import Badge from '../components/ui/Badge'
import { useSocket } from '../hooks/useSocket'

const Orders = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [orders, setOrders] = useState([])

  const loadOrders = async () => {
    try {
      const data = await getUserOrders(user._id, user.token)
      setOrders(data)
    } catch (err) {
      console.error('❌ Failed to fetch orders:', err)
      showToast('Failed to load your orders', 'error')
    }
  }

  useEffect(() => {
    if (user?._id) loadOrders()
  }, [user])

  // Real-time: Refresh orders when updated by admin
  useSocket({
    'order:update': loadOrders,
    'order:new': loadOrders,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📦 Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">You haven’t placed any orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders
            .slice()
            .reverse()
            .map((order) => (
              <div
                key={order._id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-semibold">
                    Order #{order._id.slice(-6)}
                  </h2>
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
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  Placed on:{' '}
                  {new Date(order.createdAt).toLocaleDateString('en-PK', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </div>

                <div className="text-sm mb-2">
                  <strong>Total:</strong> PKR{' '}
                  {order.totalPrice.toLocaleString()}
                </div>

                <div className="text-sm">
                  <strong>Items:</strong>{' '}
                  {order.items
                    .map(
                      (item) =>
                        `${item.quantity}× ${item.size ? item.size + ' ' : ''}`
                    )
                    .join(', ')}
                </div>
                {order.status === 'cancelled' && order.cancelReason && (
                  <div className="text-sm text-red-500 mt-2">
                    <strong>Cancelled Reason:</strong> {order.cancelReason}
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
