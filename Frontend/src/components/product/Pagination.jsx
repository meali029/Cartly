import { ChevronLeftIcon, ChevronRightIcon, ChevronDoubleLeftIcon, ChevronDoubleRightIcon } from '@heroicons/react/24/outline'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  const generatePageNumbers = () => {
    const pages = []
    const maxVisible = 7
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 4) {
        // Show first few pages
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        // Show last few pages
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // Show middle pages
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  const pages = generatePageNumbers()

  return (
    <div className="flex flex-col items-center space-y-4 mt-8">
      {/* Page Info */}
      <div className="text-sm text-slate-600">
        Showing page <span className="font-semibold text-slate-900">{currentPage}</span> of{' '}
        <span className="font-semibold text-slate-900">{totalPages}</span>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-1">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="hidden sm:flex items-center justify-center w-9 h-9 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          title="First page"
        >
          <ChevronDoubleLeftIcon className="w-4 h-4" />
        </button>

        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-9 h-9 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          title="Previous page"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        {pages.map((page, index) => (
          <div key={index}>
            {page === '...' ? (
              <span className="flex items-center justify-center w-9 h-9 text-sm font-medium text-slate-400 bg-white">
                ...
              </span>
            ) : (
              <button
                onClick={() => onPageChange(page)}
                className={`flex items-center justify-center w-9 h-9 text-sm font-medium rounded-xl transition-all duration-300 transform hover:scale-105 ${
                  page === currentPage
                    ? 'text-white bg-slate-900 shadow-lg'
                    : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm hover:shadow-md'
                }`}
                title={`Go to page ${page}`}
              >
                {page}
              </button>
            )}
          </div>
        ))}

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-9 h-9 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          title="Next page"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="hidden sm:flex items-center justify-center w-9 h-9 text-slate-500 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 hover:text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md"
          title="Last page"
        >
          <ChevronDoubleRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Jump (for large datasets) */}
      {totalPages > 10 && (
        <div className="flex items-center space-x-2 text-sm">
          <span className="text-slate-600">Jump to page:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            placeholder={currentPage}
            className="w-20 px-3 py-1 text-center text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-slate-500 transition-all duration-300 shadow-sm"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page)
                  e.target.value = ''
                }
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Pagination
