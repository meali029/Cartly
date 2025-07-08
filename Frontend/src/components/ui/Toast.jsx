import { useEffect, useState, useCallback } from 'react'

const Toast = ({ 
  message, 
  type = 'success', 
  duration = 4000,
  position = 'top-right',
  closable = true,
  onClose = () => {},
  icon = null,
  title = null,
  action = null,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const positions = {
    'top-right': 'top-5 right-5',
    'top-left': 'top-5 left-5',
    'top-center': 'top-5 left-1/2 transform -translate-x-1/2',
    'bottom-right': 'bottom-5 right-5',
    'bottom-left': 'bottom-5 left-5',
    'bottom-center': 'bottom-5 left-1/2 transform -translate-x-1/2',
  }

  const typeStyles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      text: 'text-green-800',
      icon: 'text-green-400',
      iconPath: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      text: 'text-red-800',
      icon: 'text-red-400',
      iconPath: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      text: 'text-yellow-800',
      icon: 'text-yellow-400',
      iconPath: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      text: 'text-blue-800',
      icon: 'text-blue-400',
      iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    },
    loading: {
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-800',
      icon: 'text-gray-400',
      iconPath: null
    }
  }

  const currentStyle = typeStyles[type] || typeStyles.info

  const handleClose = useCallback(() => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsVisible(false)
      onClose()
    }, 150)
  }, [onClose])

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, handleClose])

  const renderIcon = () => {
    if (icon) return icon
    
    if (type === 'loading') {
      return (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent" />
      )
    }

    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={currentStyle.iconPath} />
      </svg>
    )
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed z-50 max-w-md transition-all duration-300 ${positions[position]} ${
        isAnimating ? 'opacity-0 transform scale-95' : 'opacity-100 transform scale-100'
      } ${className}`}
    >
      <div className={`rounded-lg border shadow-lg overflow-hidden ${currentStyle.bg}`}>
        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="h-1 bg-gray-200">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-linear"
              style={{ 
                width: '100%', 
                animation: `shrink ${duration}ms linear forwards` 
              }}
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex items-start space-x-3">
            {/* Icon */}
            <div className={`flex-shrink-0 ${currentStyle.icon}`}>
              {renderIcon()}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              {title && (
                <h4 className={`text-sm font-semibold ${currentStyle.text} mb-1`}>
                  {title}
                </h4>
              )}
              <p className={`text-sm ${currentStyle.text} ${title ? 'font-normal' : 'font-medium'}`}>
                {message}
              </p>
              
              {action && (
                <div className="mt-3">
                  {action}
                </div>
              )}
            </div>

            {/* Close button */}
            {closable && (
              <button
                onClick={handleClose}
                className={`flex-shrink-0 rounded-md p-1 transition-colors duration-200 ${currentStyle.icon} hover:bg-black/10`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Predefined toast variants
export const SuccessToast = ({ message, ...props }) => (
  <Toast message={message} type="success" {...props} />
)

export const ErrorToast = ({ message, ...props }) => (
  <Toast message={message} type="error" {...props} />
)

export const WarningToast = ({ message, ...props }) => (
  <Toast message={message} type="warning" {...props} />
)

export const InfoToast = ({ message, ...props }) => (
  <Toast message={message} type="info" {...props} />
)

export const LoadingToast = ({ message, ...props }) => (
  <Toast message={message} type="loading" duration={0} {...props} />
)

export default Toast
