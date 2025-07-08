import { useState } from 'react'

const SizeFilter = ({ selectedSize, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true)

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

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg text-white">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Size</h3>
            <p className="text-sm text-gray-500">
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
          <svg
            className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Quick Actions */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Quick select:</span>
              <button
                onClick={() => onChange('M')}
                className="text-xs px-2 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Most Popular (M)
              </button>
            </div>
            {selectedSize && (
              <button
                onClick={() => onChange(null)}
                className="text-sm text-red-600 hover:text-red-700 font-medium flex items-center space-x-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span>Clear</span>
              </button>
            )}
          </div>

          {/* Size Categories */}
          <div className="space-y-4">
            {sizeCategories.map((category) => (
              <div key={category.category}>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                  {category.category} Sizes
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {category.sizes.map((size) => (
                    <button
                      key={size.value}
                      onClick={() => onChange(size.value)}
                      className={`relative group p-3 rounded-lg border-2 transition-all duration-200 text-center ${
                        selectedSize === size.value
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 transform scale-105 shadow-md'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                      }`}
                      title={size.description}
                    >
                      <div className="font-semibold text-sm">{size.label}</div>
                      <div className="text-xs text-gray-500 mt-1">{size.description}</div>
                      
                      {selectedSize === size.value && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Size Guide */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h4 className="text-sm font-medium text-blue-900">Size Guide</h4>
            </div>
            <p className="text-sm text-blue-700">
              Not sure about your size? Check our detailed size guide for accurate measurements.
            </p>
            <button className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium underline">
              View Size Chart
            </button>
          </div>

          {/* Statistics */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            {allSizes.length} sizes available • Most popular: Medium (M)
          </div>
        </div>
      )}
    </div>
  )
}

export default SizeFilter
