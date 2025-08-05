import { useState } from 'react'
import { ChevronDownIcon, XMarkIcon } from '@heroicons/react/24/outline'

const SizeFilter = ({ selectedSize, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div className="bg-white rounded-lg border shadow-sm w-full">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-3 sm:px-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="text-left">
          <h3 className="text-sm font-medium text-gray-900">Size</h3>
          <p className="text-xs text-gray-500">
            {selectedSize ? `Selected: ${selectedSize}` : 'Select size'}
          </p>
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
          {/* Clear button */}
          {selectedSize && (
            <div className="flex justify-end mb-3 pt-3">
              <button
                onClick={() => onChange(null)}
                className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 py-1 px-2 hover:bg-red-50 rounded transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
                Clear
              </button>
            </div>
          )}

          {/* Size grid */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 p-2">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => onChange(size)}
                className={`p-2 sm:p-3 text-xs sm:text-sm font-medium rounded-md sm:rounded-lg border transition-colors min-h-[40px] sm:min-h-[44px] flex items-center justify-center ${
                  selectedSize === size
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeFilter
