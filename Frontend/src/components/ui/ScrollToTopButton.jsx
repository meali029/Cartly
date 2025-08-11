import { useState } from 'react'
import { ChevronUpIcon } from '@heroicons/react/24/outline'
import useScrollToTop from '../../hooks/useScrollToTop'

const ScrollToTopButton = ({ 
  threshold = 300,
  smooth = true,
  showProgress = true,
  className = '',
  size = 'md',
  position = 'bottom-right'
}) => {
  const { isVisible, scrollProgress, scrollToTop } = useScrollToTop(threshold)
  const [isClicked, setIsClicked] = useState(false)

  const sizeStyles = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-14 h-14'
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  const positionStyles = {
    // On mobile, lift above BottomNav; on larger screens keep original spacing
    'bottom-right': 'bottom-[92px] right-4 sm:bottom-6 sm:right-6',
    'bottom-left': 'bottom-[92px] left-4 sm:bottom-6 sm:left-6',
    'bottom-center': 'bottom-[92px] left-1/2 transform -translate-x-1/2 sm:bottom-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  }

  const handleClick = () => {
    setIsClicked(true)
    scrollToTop(smooth)
    setTimeout(() => setIsClicked(false), 300)
  }

  if (!isVisible) return null

  return (
    <div className={`fixed ${positionStyles[position]} z-[70] ${className}`}>
      <button
        onClick={handleClick}
        className={`relative ${sizeStyles[size]} bg-gradient-to-r from-slate-600 to-slate-800 text-white rounded-full shadow-xl hover:from-slate-700 hover:to-slate-900 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
          isClicked ? 'scale-95' : ''
        }`}
        aria-label="Scroll to top"
        title="Back to top"
      >
        {/* Progress Ring */}
        {showProgress && (
          <svg 
            className="absolute inset-0 w-full h-full transform -rotate-90" 
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="4"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="rgba(255,255,255,0.8)"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 45}`}
              strokeDashoffset={`${2 * Math.PI * 45 * (1 - scrollProgress / 100)}`}
              className="transition-all duration-300 ease-out"
            />
          </svg>
        )}
        
        <div className="flex items-center justify-center relative z-10">
          <ChevronUpIcon className={`${iconSizes[size]} group-hover:animate-bounce`} />
        </div>
        
        {/* Ripple effect */}
        <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-200"></div>
      </button>
    </div>
  )
}

export default ScrollToTopButton
