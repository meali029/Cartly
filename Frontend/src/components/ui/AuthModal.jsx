import { XMarkIcon } from '@heroicons/react/24/outline'

const AuthModal = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2 sm:p-4">
      {/* Full screen backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />
      
      {/* Modal Container - Fully Responsive */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg max-h-[98vh] sm:max-h-[95vh] overflow-y-auto z-10">
        {/* Glass morphism card */}
        <div className="relative bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/30 overflow-hidden transform transition-all duration-300 hover:shadow-3xl animate-in fade-in-0 zoom-in-95">
          {/* Close button - Responsive positioning */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-6 md:right-6 z-20 p-1.5 sm:p-2 rounded-full bg-slate-100/80 backdrop-blur-sm hover:bg-slate-200/80 transition-all duration-300 group shadow-lg hover:shadow-xl"
          >
            <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 group-hover:text-slate-800" />
          </button>

          {/* Content */}
          {children}
        </div>
      </div>
    </div>
  )
}

export default AuthModal
