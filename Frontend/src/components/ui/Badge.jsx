const Badge = ({ 
  text, 
  color = 'gray', 
  variant = 'solid', 
  size = 'md', 
  icon = null, 
  pulse = false, 
  removable = false, 
  onRemove = null,
  className = ''
}) => {
  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const colorStyles = {
    gray: {
      solid: 'bg-gray-100 text-gray-800 border-gray-200',
      outline: 'bg-transparent text-gray-700 border-gray-300',
      gradient: 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 border-gray-200',
      ghost: 'bg-gray-50 text-gray-600 border-transparent hover:bg-gray-100',
    },
    red: {
      solid: 'bg-red-100 text-red-700 border-red-200',
      outline: 'bg-transparent text-red-600 border-red-300',
      gradient: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-200',
      ghost: 'bg-red-50 text-red-600 border-transparent hover:bg-red-100',
    },
    green: {
      solid: 'bg-green-100 text-green-700 border-green-200',
      outline: 'bg-transparent text-green-600 border-green-300',
      gradient: 'bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-green-200',
      ghost: 'bg-green-50 text-green-600 border-transparent hover:bg-green-100',
    },
    blue: {
      solid: 'bg-blue-100 text-blue-700 border-blue-200',
      outline: 'bg-transparent text-blue-600 border-blue-300',
      gradient: 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 border-blue-200',
      ghost: 'bg-blue-50 text-blue-600 border-transparent hover:bg-blue-100',
    },
    yellow: {
      solid: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      outline: 'bg-transparent text-yellow-700 border-yellow-300',
      gradient: 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border-yellow-200',
      ghost: 'bg-yellow-50 text-yellow-700 border-transparent hover:bg-yellow-100',
    },
    indigo: {
      solid: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      outline: 'bg-transparent text-indigo-600 border-indigo-300',
      gradient: 'bg-gradient-to-r from-indigo-100 to-indigo-200 text-indigo-700 border-indigo-200',
      ghost: 'bg-indigo-50 text-indigo-600 border-transparent hover:bg-indigo-100',
    },
    purple: {
      solid: 'bg-purple-100 text-purple-700 border-purple-200',
      outline: 'bg-transparent text-purple-600 border-purple-300',
      gradient: 'bg-gradient-to-r from-purple-100 to-purple-200 text-purple-700 border-purple-200',
      ghost: 'bg-purple-50 text-purple-600 border-transparent hover:bg-purple-100',
    },
    pink: {
      solid: 'bg-pink-100 text-pink-700 border-pink-200',
      outline: 'bg-transparent text-pink-600 border-pink-300',
      gradient: 'bg-gradient-to-r from-pink-100 to-pink-200 text-pink-700 border-pink-200',
      ghost: 'bg-pink-50 text-pink-600 border-transparent hover:bg-pink-100',
    },
    success: {
      solid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      outline: 'bg-transparent text-emerald-600 border-emerald-300',
      gradient: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-200',
      ghost: 'bg-emerald-50 text-emerald-600 border-transparent hover:bg-emerald-100',
    },
    warning: {
      solid: 'bg-amber-100 text-amber-800 border-amber-200',
      outline: 'bg-transparent text-amber-700 border-amber-300',
      gradient: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-200',
      ghost: 'bg-amber-50 text-amber-700 border-transparent hover:bg-amber-100',
    },
    error: {
      solid: 'bg-red-100 text-red-700 border-red-200',
      outline: 'bg-transparent text-red-600 border-red-300',
      gradient: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-200',
      ghost: 'bg-red-50 text-red-600 border-transparent hover:bg-red-100',
    },
  }

  const currentColorStyles = colorStyles[color] || colorStyles.gray
  const currentVariantStyles = currentColorStyles[variant] || currentColorStyles.solid

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-full border transition-all duration-200 ${
        sizeStyles[size]
      } ${currentVariantStyles} ${pulse ? 'animate-pulse' : ''} ${
        removable ? 'pr-1' : ''
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{text}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 ml-1 p-0.5 rounded-full hover:bg-black/10 transition-colors duration-200"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export default Badge
