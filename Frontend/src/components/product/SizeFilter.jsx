import { useState } from 'react'
import { 
  RectangleStackIcon, 
  ChevronDownIcon, 
  XMarkIcon, 
  CheckIcon, 
  InformationCircleIcon 
} from '@heroicons/react/24/outline'

const SizeFilter = ({ selectedSize, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showNumeric, setShowNumeric] = useState(false)

  const sizeCategories = [
    {
      category: 'Standard',
      sizes: [
        { value: 'XS', label: 'XS', description: 'Extra Small' },
        { value: 'S', label: 'S', description: 'Small' },
        { value: 'M', label: 'M', description: 'Medium' },
        { value: 'L', label: 'L', description: 'Large' },
        { value: 'XL', label: 'XL', description: 'Extra Large' },
        { value: 'XXL', label: 'XXL', description: '2X Large' }
      ]
    },
    {
      category: 'Numeric',
      sizes: [
        { value: '6', label: '6', description: 'Size 6' },
        { value: '7', label: '7', description: 'Size 7' },
        { value: '8', label: '8', description: 'Size 8' },
        { value: '9', label: '9', description: 'Size 9' },
        { value: '10', label: '10', description: 'Size 10' },
        { value: '11', label: '11', description: 'Size 11' },
        { value: '12', label: '12', description: 'Size 12' }
      ]
    }
  ]

  const allSizes = sizeCategories.flatMap(cat => cat.sizes)

  // Helper: is a size currently selected?
  const isSelected = (val) => selectedSize === val

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-7 h-7 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white">
            <RectangleStackIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-gray-900">Size</h3>
            <p className="text-xs text-gray-500">
              {selectedSize ? `Selected: ${selectedSize}` : 'All sizes'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {selectedSize && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              1 selected
            </span>
          )}
          <ChevronDownIcon
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 max-h-64 overflow-y-auto transition-all duration-300">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600">Quick select:</span>
              <button
                onClick={() => onChange('M')}
                className={`text-xs px-2 py-1 rounded-md transition-colors focus:outline-none ${isSelected('M') ? 'bg-indigo-100 text-indigo-700 font-bold' : 'bg-gray-100 hover:bg-indigo-100'}`}
                aria-pressed={isSelected('M')}
              >
                Most Popular (M)
              </button>
            </div>
            {selectedSize && (
              <button
                onClick={() => onChange(null)}
                className="text-xs text-red-600 hover:text-white hover:bg-red-500 font-medium flex items-center space-x-1 px-2 py-1 rounded transition-colors"
                aria-label="Clear size selection"
              >
                <XMarkIcon className="w-4 h-4" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Standard Sizes */}
          <div className="mb-2">
            <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center uppercase tracking-wide">
              <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
              Standard Sizes
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sizeCategories[0].sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onChange(size.value)}
                  className={`relative group p-2 rounded-lg border-2 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                    isSelected(size.value)
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-105 shadow-md'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm'
                  }`}
                  title={size.description}
                  aria-pressed={isSelected(size.value)}
                >
                  <div className="font-semibold text-xs">{size.label}</div>
                  <div className="text-[10px] text-gray-400 mt-1">{size.description}</div>
                  {isSelected(size.value) && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Numeric Sizes (collapsed by default) */}
          <div>
            <button
              onClick={() => setShowNumeric((v) => !v)}
              className="text-xs text-indigo-600 hover:underline mb-1"
              aria-expanded={showNumeric}
            >
              {showNumeric ? 'Hide Numeric Sizes' : 'Show Numeric Sizes'}
            </button>
            {showNumeric && (
              <div>
                <h4 className="text-xs font-semibold text-gray-500 mb-1 flex items-center uppercase tracking-wide">
                  <span className="w-2 h-2 bg-gray-300 rounded-full mr-2"></span>
                  Numeric Sizes
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizeCategories[1].sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => onChange(size.value)}
                      className={`relative group p-2 rounded-lg border-2 transition-all duration-200 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 ${
                        isSelected(size.value)
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 scale-105 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-indigo-300 hover:bg-indigo-50 hover:shadow-sm'
                      }`}
                      title={size.description}
                      aria-pressed={isSelected(size.value)}
                    >
                      <div className="font-semibold text-xs">{size.label}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{size.description}</div>
                      {isSelected(size.value) && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full flex items-center justify-center">
                          <CheckIcon className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeFilter
