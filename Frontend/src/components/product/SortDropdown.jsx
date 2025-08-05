import { useState, useRef, useEffect } from 'react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline'

const SortDropdown = ({ sortOption, onChange }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  const sortOptions = [
    { value: '', label: 'Default' },
    { value: 'priceAsc', label: 'Price: Low to High' },
    { value: 'priceDesc', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
    { value: 'az', label: 'A-Z' },
    { value: 'za', label: 'Z-A' }
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
    <div className="relative w-full" ref={dropdownRef}>
      {/* Dropdown Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 sm:px-4 sm:py-3 text-sm bg-white border rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
      >
        <span className="truncate text-left">Sort: {currentOption.label}</span>
        <ChevronDownIcon
          className={`w-4 h-4 text-gray-400 ml-2 flex-shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 sm:left-0 sm:right-auto sm:w-56 z-1000 mt-1 bg-white border rounded-lg shadow-lg">
          <div className="py-1 max-h-64 overflow-y-auto">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full px-3 py-2 sm:px-4 sm:py-3 text-left text-xs sm:text-sm hover:bg-gray-50 flex items-center justify-between transition-colors ${
                  option.value === sortOption ? 'bg-gray-50 font-medium' : ''
                }`}
              >
                <span className="truncate">{option.label}</span>
                {option.value === sortOption && (
                  <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0 ml-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SortDropdown
