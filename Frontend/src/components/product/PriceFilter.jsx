import { useState } from 'react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'

const PriceFilter = ({ onChange, currentRange }) => {
  const [min, setMin] = useState(currentRange?.min || '')
  const [max, setMax] = useState(currentRange?.max || '')
  const [isExpanded, setIsExpanded] = useState(false)

  const handleApply = () => {
    const minValue = min ? parseInt(min) : 0
    const maxValue = max ? parseInt(max) : 999999
    
    if (minValue > maxValue) {
      alert('Minimum price cannot be greater than maximum price')
      return
    }
    
    onChange({ min: minValue, max: maxValue })
  }

  const handleReset = () => {
    setMin('')
    setMax('')
    onChange({ min: 0, max: 999999 })
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm w-full">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-3 sm:px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-900">Price Range</h3>
          <p className="text-xs text-gray-500">Filter by price</p>
        </div>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-3 pb-4 sm:px-4 border-t">
          <div className="pt-4 space-y-4">
            {/* Price inputs */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Price</label>
                <input
                  type="number"
                  placeholder="0"
                  value={min}
                  onChange={(e) => setMin(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[44px]"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Price</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={max}
                  onChange={(e) => setMax(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 min-h-[44px]"
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={handleApply}
                className="flex-1 bg-gray-900 text-white font-medium py-3 px-4 rounded-lg hover:bg-gray-800 transition-colors text-sm min-h-[44px]"
              >
                Apply
              </button>
              <button
                onClick={handleReset}
                className="flex-1 sm:flex-none sm:px-6 py-3 px-4 border text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm min-h-[44px]"
              >
                Reset
              </button>
            </div>

            {/* Current range display */}
            {(min || max) && (
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  Current range: PKR {min || '0'} - {max || 'No limit'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceFilter
