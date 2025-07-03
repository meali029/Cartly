import { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { fetchAdminStats } from '../services/adminService'
import clsx from 'clsx' // ✅ optional utility for Tailwind-safe class merging

const AdminDashboard = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()

  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0,
    revenue: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchAdminStats(user.token)
        setStats({
          users: data.totalUsers,
          orders: data.totalOrders,
          products: data.totalProducts,
          revenue: data.totalSales,
        })
      } catch (err) {
        console.error('❌ Failed to load admin stats:', err)
        showToast('Admin stats failed to load', 'error')
      }
    }

    if (user?.isAdmin) loadStats()
  }, [user])

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Users" value={stats.users} color="indigo" />
        <StatCard label="Orders" value={stats.orders} color="blue" />
        <StatCard label="Products" value={stats.products} color="green" />
        <StatCard
          label="Revenue"
          value={`PKR ${Number(stats.revenue).toLocaleString()}`}
          color="purple"
        />
      </div>
    </div>
  )
}

const StatCard = ({ label, value, color }) => {
  const bgClass = `bg-${color}-50`
  const borderClass = `border-l-4 border-${color}-500`
  const textClass = `text-${color}-700`

  return (
    <div className={clsx(bgClass, borderClass, 'p-4 rounded shadow')}>
      <h2 className="text-sm font-medium text-gray-600 mb-1">{label}</h2>
      <p className={clsx('text-2xl font-bold', textClass)}>{value}</p>
    </div>
  )
}

export default AdminDashboard
