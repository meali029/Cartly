import { forwardRef } from 'react'

const Button = forwardRef(({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  leftIcon = null,
  rightIcon = null,
  fullWidth = false,
  rounded = 'md',
  shadow = true,
  className = '',
  ...props
}, ref) => {
  const sizeStyles = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg',
  }

  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  }

  const variants = {
    primary: `bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 
              focus:ring-indigo-500 active:from-indigo-800 active:to-purple-800`,
    secondary: `bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-indigo-500 
                active:bg-gray-100 shadow-sm`,
    danger: `bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 
             focus:ring-red-500 active:from-red-700 active:to-red-800`,
    warning: `bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 
              focus:ring-amber-500 active:from-amber-700 active:to-orange-700`,
    success: `bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 
              focus:ring-green-500 active:from-green-700 active:to-emerald-700`,
    outline: `border-2 border-gray-300 text-gray-700 bg-transparent hover:bg-gray-50 hover:border-gray-400 
              focus:ring-indigo-500 active:bg-gray-100`,
    ghost: `text-gray-600 bg-transparent hover:bg-gray-100 hover:text-gray-900 focus:ring-indigo-500 
            active:bg-gray-200`,
    link: `text-indigo-600 bg-transparent hover:text-indigo-700 hover:underline focus:ring-indigo-500 
           active:text-indigo-800`,
    dark: `bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500 active:bg-gray-700`,
    light: `bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 active:bg-gray-300`,
  }

  const baseStyles = `inline-flex items-center justify-center font-medium transition-all duration-200 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden`

  const shadowStyles = shadow && !disabled ? 'shadow-md hover:shadow-lg' : ''

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${sizeStyles[size]} ${roundedStyles[rounded]} ${
        variants[variant] || variants.primary
      } ${shadowStyles} ${fullWidth ? 'w-full' : ''} ${
        loading ? 'cursor-not-allowed' : ''
      } ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''} ${className}`}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-inherit">
          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
        </div>
      )}

      {/* Button content */}
      <div className={`flex items-center gap-2 ${loading ? 'opacity-50' : ''}`}>
        {leftIcon && !loading && (
          <span className="flex-shrink-0 -ml-1">{leftIcon}</span>
        )}
        
        {children && (
          <span className="truncate">{children}</span>
        )}
        
        {rightIcon && !loading && (
          <span className="flex-shrink-0 -mr-1">{rightIcon}</span>
        )}
      </div>

      {/* Shimmer effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
