import { Line } from 'react-chartjs-2'
import { useState, useMemo } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js'
import 'chartjs-adapter-date-fns'

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
  Filler
)

const SalesChart = ({ salesData, period }) => {
  const [_animationComplete, setAnimationComplete] = useState(false)
  const [_hoveredPoint, setHoveredPoint] = useState(null)

  // Calculate key metrics from data
  const metrics = useMemo(() => {
    if (!salesData || !salesData.length) {
      return {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        bestDay: null,
        trend: 0,
        growth: 0
      }
    }

    const totalSales = salesData.reduce((sum, item) => sum + (item.sales || 0), 0)
    const totalOrders = salesData.reduce((sum, item) => sum + (item.orders || 0), 0)
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0
    
    // Find best performing day
    const bestDay = salesData.reduce((best, current) => 
      (current.sales || 0) > (best.sales || 0) ? current : best
    , salesData[0])

    // Calculate trend (comparing first half vs second half)
    const midPoint = Math.floor(salesData.length / 2)
    const firstHalf = salesData.slice(0, midPoint)
    const secondHalf = salesData.slice(midPoint)
    
    const firstHalfAvg = firstHalf.length > 0 ? 
      firstHalf.reduce((sum, item) => sum + (item.sales || 0), 0) / firstHalf.length : 0
    const secondHalfAvg = secondHalf.length > 0 ?
      secondHalf.reduce((sum, item) => sum + (item.sales || 0), 0) / secondHalf.length : 0
    
    const growth = firstHalfAvg > 0 ? ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100 : 0

    return {
      totalSales,
      totalOrders,
      avgOrderValue,
      bestDay,
      growth: Math.round(growth * 10) / 10
    }
  }, [salesData])

  // Format data for Chart.js with enhanced styling
  const formatChartData = (data) => {
    if (!data || !data.length) {
      return {
        labels: [],
        datasets: [
          {
            label: 'Sales Revenue (PKR)',
            data: [],
            borderColor: 'rgb(99, 102, 241)',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      }
    }

    const labels = data.map(item => {
      const date = new Date(item.date)
      if (period === '7days') {
        return date.toLocaleDateString('en-PK', { weekday: 'short', day: 'numeric' })
      } else if (period === '30days') {
        return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
      } else if (period === '90days') {
        return date.toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
      } else {
        return date.toLocaleDateString('en-PK', { year: 'numeric', month: 'short' })
      }
    })

    const salesValues = data.map(item => item.sales || 0)
    const orderCounts = data.map(item => item.orders || 0)

    // Create gradient for sales line
    const ctx = document.createElement('canvas').getContext('2d')
    const salesGradient = ctx.createLinearGradient(0, 0, 0, 400)
    salesGradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)')
    salesGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.2)')
    salesGradient.addColorStop(1, 'rgba(99, 102, 241, 0.05)')

    const ordersGradient = ctx.createLinearGradient(0, 0, 0, 400)
    ordersGradient.addColorStop(0, 'rgba(16, 185, 129, 0.3)')
    ordersGradient.addColorStop(1, 'rgba(16, 185, 129, 0.05)')

    return {
      labels,
      datasets: [
        {
          label: '💰 Sales Revenue (PKR)',
          data: salesValues,
          borderColor: 'rgb(99, 102, 241)',
          backgroundColor: salesGradient,
          fill: true,
          tension: 0.4,
          yAxisID: 'y',
          pointBackgroundColor: 'rgb(99, 102, 241)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: 'rgb(79, 70, 229)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 4
        },
        {
          label: '📦 Orders Count',
          data: orderCounts,
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: ordersGradient,
          fill: true,
          tension: 0.4,
          yAxisID: 'y1',
          pointBackgroundColor: 'rgb(16, 185, 129)',
          pointBorderColor: '#fff',
          pointBorderWidth: 3,
          pointRadius: 5,
          pointHoverRadius: 7,
          pointHoverBackgroundColor: 'rgb(5, 150, 105)',
          pointHoverBorderColor: '#fff',
          pointHoverBorderWidth: 4,
          borderDash: [0],
          borderWidth: 3
        }
      ]
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onComplete: () => setAnimationComplete(true)
    },
    plugins: {
      title: {
        display: false
      },
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          font: {
            size: 13,
            weight: 'bold'
          },
          color: '#374151',
          padding: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#6366f1',
        borderWidth: 2,
        cornerRadius: 12,
        displayColors: true,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        padding: 12,
        callbacks: {
          title: function(context) {
            return `📅 ${context[0].label}`
          },
          label: function(context) {
            if (context.datasetIndex === 0) {
              const value = context.parsed.y
              return `💰 Revenue: PKR ${value.toLocaleString('en-PK')}`
            } else {
              const value = context.parsed.y
              const avgOrderValue = salesValues[context.dataIndex] / value || 0
              return [
                `📦 Orders: ${value}`,
                `💳 Avg Order Value: PKR ${avgOrderValue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}`
              ]
            }
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 12,
            weight: '500'
          },
          padding: 10
        },
        border: {
          display: false
        }
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        grid: {
          color: '#f3f4f6',
          drawBorder: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          padding: 10,
          callback: function(value) {
            if (value >= 1000000) {
              return 'PKR ' + (value / 1000000).toFixed(1) + 'M'
            } else if (value >= 1000) {
              return 'PKR ' + (value / 1000).toFixed(0) + 'K'
            }
            return 'PKR ' + value.toLocaleString('en-PK')
          }
        },
        title: {
          display: true,
          text: '💰 Sales Revenue',
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        border: {
          display: false
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 11
          },
          padding: 10
        },
        title: {
          display: true,
          text: '📦 Order Count',
          color: '#374151',
          font: {
            size: 12,
            weight: 'bold'
          }
        },
        border: {
          display: false
        }
      }
    },
    onHover: (event, elements) => {
      if (elements.length > 0) {
        setHoveredPoint(elements[0].index)
      } else {
        setHoveredPoint(null)
      }
    }
  }

  const chartData = formatChartData(salesData)
  const salesValues = salesData?.map(item => item.sales || 0) || []

  return (
    <div className="space-y-4">
      {/* Chart Header with Key Metrics */}
      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
            <div className="text-xs text-gray-600 font-medium">Total Revenue</div>
            <div className="text-lg font-bold text-indigo-600">
              PKR {metrics.totalSales.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg border border-green-100">
            <div className="text-xs text-gray-600 font-medium">Total Orders</div>
            <div className="text-lg font-bold text-green-600">
              {metrics.totalOrders.toLocaleString('en-PK')}
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-3 rounded-lg border border-purple-100">
            <div className="text-xs text-gray-600 font-medium">Avg Order Value</div>
            <div className="text-lg font-bold text-purple-600">
              PKR {metrics.avgOrderValue.toLocaleString('en-PK', { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
        
        {/* Growth Indicator */}
        {metrics.growth !== 0 && (
          <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
            metrics.growth > 0 
              ? 'bg-green-100 text-green-700' 
              : 'bg-red-100 text-red-700'
          }`}>
            <span className="text-xs font-medium">
              {metrics.growth > 0 ? '📈' : '📉'} Trend
            </span>
            <span className="font-bold">
              {metrics.growth > 0 ? '+' : ''}{metrics.growth}%
            </span>
          </div>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative">
        <div className="h-80 w-full bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 shadow-sm">
          {salesData && salesData.length > 0 ? (
            <Line data={chartData} options={options} />
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">📊</div>
                <p className="text-gray-500 text-lg font-medium">No sales data available</p>
                <p className="text-gray-400 text-sm mt-2">
                  Sales data will appear when orders are placed for the selected period
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Best Performance Day */}
        {metrics.bestDay && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
            <div className="text-xs text-gray-600 font-medium">🏆 Best Day</div>
            <div className="text-sm font-bold text-gray-900">
              {new Date(metrics.bestDay.date).toLocaleDateString('en-PK', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="text-xs text-indigo-600 font-medium">
              PKR {metrics.bestDay.sales?.toLocaleString('en-PK')}
            </div>
          </div>
        )}
      </div>

      {/* Data Insights */}
      {salesData && salesData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2">
              <span className="text-blue-500">📈</span>
              <div className="text-sm font-medium text-blue-700">
                Peak Performance
              </div>
            </div>
            <div className="text-xs text-blue-600 mt-1">
              {metrics.bestDay ? 
                `${new Date(metrics.bestDay.date).toLocaleDateString('en-PK', { weekday: 'long' })} had the highest sales` :
                'No peak performance data'
              }
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <div className="flex items-center space-x-2">
              <span className="text-green-500">💎</span>
              <div className="text-sm font-medium text-green-700">
                Order Efficiency
              </div>
            </div>
            <div className="text-xs text-green-600 mt-1">
              {metrics.avgOrderValue > 0 ?
                `Average PKR ${metrics.avgOrderValue.toLocaleString('en-PK', { maximumFractionDigits: 0 })} per order` :
                'No order data available'
              }
            </div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <div className="flex items-center space-x-2">
              <span className="text-purple-500">🎯</span>
              <div className="text-sm font-medium text-purple-700">
                Data Period
              </div>
            </div>
            <div className="text-xs text-purple-600 mt-1">
              Showing {salesData.length} days of sales data
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SalesChart
