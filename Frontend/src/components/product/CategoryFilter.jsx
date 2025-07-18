import { useState } from 'react'
import {
  BuildingStorefrontIcon,
  UserIcon,
  HeartIcon,
  SparklesIcon,
  ShoppingBagIcon,
  DevicePhoneMobileIcon,
  HomeIcon,
  PlayIcon,
  ChevronDownIcon,
  CheckCircleIcon,
  StarIcon,
  Squares2X2Icon
} from '@heroicons/react/24/outline'

const CategoryFilter = ({ selectedCategory, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  const categories = [
    {
      id: 'all',
      name: 'All Products',
      icon: BuildingStorefrontIcon,
      description: 'Browse all items',
      color: 'from-gray-500 to-gray-700',
      bgColor: 'bg-gray-50',
      count: 1250
    },
    {
      id: 'men',
      name: 'Men',
      icon: UserIcon,
      description: 'Men\'s clothing & accessories',
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      count: 450
    },
    {
      id: 'women',
      name: 'Women',
      icon: HeartIcon,
      description: 'Women\'s fashion & beauty',
      color: 'from-pink-500 to-rose-600',
      bgColor: 'bg-pink-50',
      count: 620
    },
    {
      id: 'kids',
      name: 'Kids',
      icon: SparklesIcon,
      description: 'Children\'s clothing & toys',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      count: 180
    },
    {
      id: 'accessories',
      name: 'Accessories',
      icon: ShoppingBagIcon,
      description: 'Bags, jewelry & more',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      count: 320
    },
    {
      id: 'electronics',
      name: 'Electronics',
      icon: DevicePhoneMobileIcon,
      description: 'Tech gadgets & devices',
      color: 'from-cyan-500 to-teal-600',
      bgColor: 'bg-cyan-50',
      count: 280
    },
    {
      id: 'home',
      name: 'Home & Garden',
      icon: HomeIcon,
      description: 'Home decor & furniture',
      color: 'from-orange-500 to-red-600',
      bgColor: 'bg-orange-50',
      count: 150
    },
    {
      id: 'sports',
      name: 'Sports & Outdoors',
      icon: PlayIcon,
      description: 'Athletic gear & equipment',
      color: 'from-lime-500 to-green-600',
      bgColor: 'bg-lime-50',
      count: 190
    }
  ]

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory) || categories[0]

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden transform hover:shadow-2xl transition-all duration-500">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-slate-50 transition-all duration-300"
      >
        <div className="flex items-center space-x-4">
          <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl shadow-lg transform hover:scale-110 transition-all duration-300`}>
            <Squares2X2Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">Categories</h3>
            <p className="text-sm text-slate-600 mt-1">
              {selectedCategoryData.name} • {selectedCategoryData.count.toLocaleString()} items
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
            {categories.length} categories
          </span>
          <ChevronDownIcon
            className={`w-5 h-5 text-slate-400 transform transition-transform duration-300 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-4 rounded-3xl border border-slate-200 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-slate-900">
                {categories.reduce((sum, cat) => sum + cat.count, 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600 font-medium">Total Products</div>
            </div>
            <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-3xl border border-slate-300 shadow-lg transform hover:scale-105 transition-all duration-300">
              <div className="text-2xl font-bold text-slate-900">{categories.length}</div>
              <div className="text-sm text-slate-600 font-medium">Categories</div>
            </div>
          </div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 mb-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              const isSelected = selectedCategory === category.id
              
              return (
                <button
                  key={category.id}
                  onClick={() => onChange(category.id)}
                  className={`group p-4 rounded-3xl border-2 transition-all duration-300 text-left transform hover:scale-105 ${
                    isSelected
                      ? 'border-slate-600 bg-slate-50 shadow-xl scale-105'
                      : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r from-slate-600 to-slate-800 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold transition-colors truncate ${
                        isSelected ? 'text-slate-900' : 'text-slate-900 group-hover:text-slate-700'
                      }`}>
                        {category.name}
                      </div>
                      <div className="text-sm text-slate-600 mb-2 truncate">{category.description}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-1 rounded-full">
                          {category.count.toLocaleString()} items
                        </span>
                        {isSelected && (
                          <CheckCircleIcon className="w-5 h-5 text-slate-600 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Popular Categories */}
          <div className="p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-3xl border border-slate-200 shadow-lg">
            <div className="flex items-center space-x-2 mb-3">
              <StarIcon className="w-5 h-5 text-slate-600" />
              <h4 className="text-sm font-semibold text-slate-900">Most Popular</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {categories
                .sort((a, b) => b.count - a.count)
                .slice(0, 3)
                .map((category) => {
                  const IconComponent = category.icon
                  return (
                    <button
                      key={category.id}
                      onClick={() => onChange(category.id)}
                      className="inline-flex items-center space-x-2 px-3 py-2 rounded-full text-xs font-medium bg-slate-100 text-slate-800 hover:bg-slate-200 transition-all duration-300 border border-slate-300 transform hover:scale-105"
                    >
                      <IconComponent className="w-4 h-4" />
                      <span>{category.name}</span>
                    </button>
                  )
                })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CategoryFilter
