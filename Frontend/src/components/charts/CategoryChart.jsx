import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend)

const CategoryChart = ({ categories }) => {
  // Format data for Chart.js
  const formatChartData = (data) => {
    if (!data || !data.length) {
      return {
        labels: [],
        datasets: [{
          data: [],
          backgroundColor: [],
          borderColor: [],
          borderWidth: 2
        }]
      }
    }

    const colors = [
      { bg: 'rgba(79, 70, 229, 0.8)', border: 'rgba(79, 70, 229, 1)' },
      { bg: 'rgba(34, 197, 94, 0.8)', border: 'rgba(34, 197, 94, 1)' },
      { bg: 'rgba(251, 146, 60, 0.8)', border: 'rgba(251, 146, 60, 1)' },
      { bg: 'rgba(239, 68, 68, 0.8)', border: 'rgba(239, 68, 68, 1)' },
      { bg: 'rgba(168, 85, 247, 0.8)', border: 'rgba(168, 85, 247, 1)' }
    ]

    return {
      labels: data.map(category => category.name),
      datasets: [{
        data: data.map(category => category.sales),
        backgroundColor: data.map((_, index) => colors[index % colors.length].bg),
        borderColor: data.map((_, index) => colors[index % colors.length].border),
        borderWidth: 2,
        hoverBorderWidth: 3
      }]
    }
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#374151',
        borderWidth: 1,
        callbacks: {
          label: function(context) {
            const category = categories[context.dataIndex]
            return `${context.label}: PKR ${context.parsed.toLocaleString('en-PK')} (${category.percentage}%)`
          }
        }
      }
    },
    cutout: '60%'
  }

  const chartData = formatChartData(categories)

  if (!categories || categories.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm">No category data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-64 w-full">
      <Doughnut data={chartData} options={options} />
    </div>
  )
}

export default CategoryChart
