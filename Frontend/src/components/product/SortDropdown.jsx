import { useState, useRef, useEffect } from 'react'
import { 
  BarsArrowDownIcon, 
  BarsArrowUpIcon, 
  CurrencyDollarIcon, 
  SparklesIcon, 
  CalendarDaysIcon, 
  StarIcon, 
  FireIcon, 
  ChevronDownIcon, 
  CheckIcon 
} from '@heroicons/react/24/outline'

const SortDropdown = ({ sortOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { value: '', label: 'Default', icon: BarsArrowDownIcon, description: 'Original order' },
    { value: 'priceAsc', label: 'Price: Low to High', icon: CurrencyDollarIcon, description: 'Cheapest first' },
    { value: 'priceDesc', label: 'Price: High to Low', icon: CurrencyDollarIcon, description: 'Most expensive first' },
    { value: 'newest', label: 'Newest', icon: SparklesIcon, description: 'Latest products' },
    { value: 'az', label: 'A-Z', icon: BarsArrowDownIcon, description: 'Alphabetical order' },
    { value: 'za', label: 'Z-A', icon: BarsArrowUpIcon, description: 'Reverse alphabetical' },
    { value: 'rating', label: 'Best Rated', icon: StarIcon, description: 'Highest rated first' },
    { value: 'popular', label: 'Most Popular', icon: FireIcon, description: 'Trending products' }
  ]

  const currentOption = sortOptions.find(option => option.value === sortOption) || sortOptions[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSortChange = (value) => {
    onChange(value)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full sm:w-64 px-4 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg text-white">
            <BarsArrowDownIcon className="w-4 h-4" />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500 font-normal">Sort by</span>
            <span className="text-sm font-semibold text-gray-900">{currentOption.label}</span>
          </div>
        </div>
        <ChevronDownIcon
          className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 z-20 w-full sm:w-72 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden animate-fadeIn">
          <div className="py-2">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-100">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Sort Options
              </h3>
            </div>

            {/* Sort Options */}
            <div className="max-h-64 overflow-y-auto">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSortChange(option.value)}
                  className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between group ${
                    option.value === sortOption
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-r-4 border-indigo-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="option"
                  aria-selected={option.value === sortOption}
                >
                  <div className="flex items-center space-x-3">
                    <option.icon className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500">{option.description}</div>
                    </div>
                  </div>
                  
                  {option.value === sortOption && (
                    <CheckIcon className="w-4 h-4 text-indigo-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
              <p className="text-xs text-gray-500">
                {sortOptions.length} sort options available
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SortDropdown
