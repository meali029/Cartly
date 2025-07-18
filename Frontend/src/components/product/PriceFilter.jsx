import { useState } from 'react'
import { CurrencyDollarIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

const PriceFilter = ({ onChange, currentRange }) => {
  const [min, setMin] = useState(currentRange?.min || '')
  const [max, setMax] = useState(currentRange?.max || '')
  const [isExpanded, setIsExpanded] = useState(false)

  // const predefinedRanges = [
  //   { label: 'Under PKR 1,000', min: 0, max: 1000 },
  //   { label: 'PKR 1,000 - 2,500', min: 1000, max: 2500 },
  //   { label: 'PKR 2,500 - 5,000', min: 2500, max: 5000 },
  //   { label: 'PKR 5,000 - 10,000', min: 5000, max: 10000 },
  //   { label: 'Above PKR 10,000', min: 10000, max: 999999 },
  // ]

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

  // const handlePredefinedRange = (range) => {
  //   setMin(range.min)
  //   setMax(range.max === 999999 ? '' : range.max)
  //   onChange({ min: range.min, max: range.max })
  // }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden transform hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <div 
        className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-800 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
              <CurrencyDollarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Price Range</h3>
              <p className="text-sm text-slate-600">Filter by price</p>
            </div>
          </div>
          <span>
            <ChevronDownIcon
              className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className={`transition-all duration-300 overflow-hidden ${isExpanded ? 'max-h-48 opacity-100 overflow-y-auto' : 'max-h-0 opacity-0'}`}>
        <div className="p-4 space-y-4">
          
          {/* Predefined Ranges */}
          {/* <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Quick Select</h4>
            <div className="space-y-2">
              {predefinedRanges.map((range, index) => (
                <button
                  key={index}
                  onClick={() => handlePredefinedRange(range)}
                  className="w-full text-left px-4 py-3 rounded-xl border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-200 text-sm"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div> */}

          {/* Custom Range */}
          <div>
            <h4 className="text-sm font-semibold text-slate-700 mb-2">Custom Range</h4>
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">PKR</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={min}
                    onChange={(e) => setMin(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm">PKR</span>
                  <input
                    type="number"
                    placeholder="No limit"
                    value={max}
                    onChange={(e) => setMax(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 shadow-sm hover:shadow-md"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleApply}
                className="flex-1 bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold py-3 px-4 rounded-xl hover:from-slate-800 hover:to-slate-700 transition-all duration-300 text-sm transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Apply Filter
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-all duration-300 text-sm transform hover:scale-105"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Current Range Display */}
          {(min || max) && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-600 font-medium">Current Range:</span>
                <span className="text-slate-700">
                  PKR {min || '0'} - {max || 'No limit'}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PriceFilter
