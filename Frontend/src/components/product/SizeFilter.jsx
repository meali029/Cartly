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

  // const allSizes = sizeCategories.flatMap(cat => cat.sizes)

  // Helper: is a size currently selected?
  const isSelected = (val) => selectedSize === val

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-4 text-left flex items-center justify-between hover:bg-slate-50 transition-all duration-300"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl text-white shadow-lg transform hover:scale-110 transition-all duration-300">
            <RectangleStackIcon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Size</h3>
            <p className="text-sm text-slate-600">
              {selectedSize ? `Selected: ${selectedSize}` : 'All sizes'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {selectedSize && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
              1 selected
            </span>
          )}
          <ChevronDownIcon
            className={`w-4 h-4 text-slate-400 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 max-h-64 overflow-y-auto transition-all duration-300">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-slate-600">Quick select:</span>
              <button
                onClick={() => onChange('M')}
                className={`text-sm px-3 py-1 rounded-xl transition-all duration-300 focus:outline-none transform hover:scale-105 ${isSelected('M') ? 'bg-slate-100 text-slate-700 font-bold' : 'bg-slate-50 hover:bg-slate-100'}`}
                aria-pressed={isSelected('M')}
              >
                Most Popular (M)
              </button>
            </div>
            {selectedSize && (
              <button
                onClick={() => onChange(null)}
                className="text-sm text-red-600 hover:text-white hover:bg-red-500 font-medium flex items-center space-x-1 px-3 py-1 rounded-xl transition-all duration-300 transform hover:scale-105"
                aria-label="Clear size selection"
              >
                <XMarkIcon className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Standard Sizes */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center uppercase tracking-wide">
              <span className="w-2 h-2 bg-slate-300 rounded-full mr-2"></span>
              Standard Sizes
            </h4>
            <div className="grid grid-cols-3 gap-2">
              {sizeCategories[0].sizes.map((size) => (
                <button
                  key={size.value}
                  onClick={() => onChange(size.value)}
                  className={`relative group p-3 rounded-xl border-2 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transform hover:scale-105 ${
                    isSelected(size.value)
                      ? 'border-slate-600 bg-slate-50 text-slate-700 scale-105 shadow-lg'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
                  }`}
                  title={size.description}
                  aria-pressed={isSelected(size.value)}
                >
                  <div className="font-semibold text-sm">{size.label}</div>
                  <div className="text-xs text-slate-400 mt-1">{size.description}</div>
                  {isSelected(size.value) && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
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
              className="text-sm text-slate-600 hover:underline mb-3"
              aria-expanded={showNumeric}
            >
              {showNumeric ? 'Hide Numeric Sizes' : 'Show Numeric Sizes'}
            </button>
            {showNumeric && (
              <div>
                <h4 className="text-sm font-semibold text-slate-600 mb-3 flex items-center uppercase tracking-wide">
                  <span className="w-2 h-2 bg-slate-300 rounded-full mr-2"></span>
                  Numeric Sizes
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {sizeCategories[1].sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => onChange(size.value)}
                      className={`relative group p-3 rounded-xl border-2 transition-all duration-300 text-center focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-slate-400 transform hover:scale-105 ${
                        isSelected(size.value)
                          ? 'border-slate-600 bg-slate-50 text-slate-700 scale-105 shadow-lg'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50 hover:shadow-md'
                      }`}
                      title={size.description}
                      aria-pressed={isSelected(size.value)}
                    >
                      <div className="font-semibold text-sm">{size.label}</div>
                      <div className="text-xs text-slate-400 mt-1">{size.description}</div>
                      {isSelected(size.value) && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-slate-600 rounded-full flex items-center justify-center">
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
