import { useState } from 'react'

const CategoryFilter = ({ selectedCategory, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const categories = [
    {
      id: 'all',
      name: 'All Products',
      icon: '🏪',
      description: 'Browse all items',
      color: 'from-gray-500 to-gray-700',
      count: 1250
    },
    {
      id: 'men',
      name: 'Men',
      icon: '👨',
      description: 'Men\'s clothing & accessories',
      color: 'from-blue-500 to-blue-700',
      count: 450
    },
    {
      id: 'women',
      name: 'Women',
      icon: '👩',
      description: 'Women\'s fashion & beauty',
      color: 'from-pink-500 to-rose-600',
      count: 620
    },
    {
      id: 'kids',
      name: 'Kids',
      icon: '👶',
      description: 'Children\'s clothing & toys',
      color: 'from-green-500 to-emerald-600',
      count: 180
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: '👜',
      description: 'Bags, jewelry & more',
      color: 'from-purple-500 to-indigo-600',
      count: 320
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: '📱',
      description: 'Tech gadgets & devices',
      color: 'from-cyan-500 to-teal-600',
      count: 280
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: '🏠',
      description: 'Home decor & furniture',
      color: 'from-orange-500 to-red-600',
      count: 150
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      icon: '⚽',
      description: 'Athletic gear & equipment',
      color: 'from-lime-500 to-green-600',
      count: 190
    }
  ]

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0]

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
      >
        <div className="flex items-center space-x-3">
          <div className={`flex items-center justify-center w-8 h-8 bg-gradient-to-r ${selectedCategoryData.color} rounded-lg text-white`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
            <p className="text-sm text-gray-500">
              {selectedCategoryData.name} • {selectedCategoryData.count} items
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            {categories.length} categories
          </span>
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
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {categories.reduce((sum, cat) => sum + cat.count, 0)}
              </div>
              <div className="text-sm text-blue-700">Total Products</div>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{categories.length}</div>
              <div className="text-sm text-green-700">Categories</div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onChange(category.id)}
                className={`group p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  selectedCategory === category.id
                    ? 'border-indigo-500 bg-indigo-50 shadow-md transform scale-105'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${category.color} rounded-lg text-white text-lg`}>
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {category.name}
                    </div>
                    <div className="text-sm text-gray-500 mb-1">{category.description}</div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-medium text-gray-600">{category.count} items</span>
                      {selectedCategory === category.id && (
                        <svg className="w-4 h-4 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Popular Categories */}
          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <h4 className="text-sm font-medium text-yellow-900">Most Popular</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((category) => (
                  <button
                    key={category.id}
                    onClick={() => onChange(category.id)}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition-colors"
                  >
                    {category.icon} {category.name}
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
