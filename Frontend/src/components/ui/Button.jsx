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
  pulse = false,
  glow = false,
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
    md: 'rounded-xl',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    full: 'rounded-full',
  }

  const variants = {
    primary: `bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:from-slate-800 hover:to-slate-700 
              focus:ring-slate-500 active:from-slate-700 active:to-slate-600 border-0`,
    secondary: `bg-white text-slate-900 border border-slate-300 hover:bg-slate-50 focus:ring-slate-500 
                active:bg-slate-100 shadow-sm hover:border-slate-400`,
    danger: `bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 
             focus:ring-red-500 active:from-red-700 active:to-red-800 border-0`,
    warning: `bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 
              focus:ring-amber-500 active:from-amber-700 active:to-orange-700 border-0`,
    success: `bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 
              focus:ring-emerald-500 active:from-emerald-700 active:to-emerald-800 border-0`,
    outline: `border-2 border-slate-300 text-slate-700 bg-transparent hover:bg-slate-50 hover:border-slate-400 
              focus:ring-slate-500 active:bg-slate-100`,
    ghost: `text-slate-600 bg-transparent hover:bg-slate-100 hover:text-slate-900 focus:ring-slate-500 
            active:bg-slate-200 border-0`,
    link: `text-slate-600 bg-transparent hover:text-slate-900 hover:underline focus:ring-slate-500 
           active:text-slate-700 border-0`,
    dark: `bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 active:bg-slate-700 border-0`,
    light: `bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500 active:bg-slate-300 border border-slate-200`,
    modern: `bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black 
             focus:ring-slate-500 active:from-black active:to-slate-800 border-0 shadow-xl hover:shadow-2xl`,
    elegant: `bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-900 hover:to-black 
              focus:ring-slate-500 active:from-black active:to-slate-800 border-0 shadow-xl`,
  }

  const baseStyles = `inline-flex items-center justify-center font-semibold transition-all duration-300 
                     focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden`

  const shadowStyles = shadow && !disabled ? 'shadow-xl hover:shadow-2xl' : ''
  const pulseStyles = pulse && !disabled ? 'animate-pulse' : ''
  const glowStyles = glow && !disabled ? 'shadow-xl hover:shadow-2xl' : ''

  return (
    <button
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`group ${baseStyles} ${sizeStyles[size]} ${roundedStyles[rounded]} ${
        variants[variant] || variants.primary
      } ${shadowStyles} ${pulseStyles} ${glowStyles} ${fullWidth ? 'w-full' : ''} ${
        loading ? 'cursor-not-allowed' : ''
      } ${!disabled && !loading ? 'hover:scale-105 active:scale-95' : ''} ${className}`}
      {...props}
    >
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-inherit backdrop-blur-sm">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent shadow-lg"></div>
        </div>
      )}

      {/* Button content */}
      <div className={`flex items-center gap-2.5 ${loading ? 'opacity-50' : ''}`}>
        {leftIcon && !loading && (
          <span className="flex-shrink-0 -ml-1 transition-transform duration-200 group-hover:scale-110">{leftIcon}</span>
        )}
        
        {children && (
          <span className="truncate font-semibold">{children}</span>
        )}
        
        {rightIcon && !loading && (
          <span className="flex-shrink-0 -mr-1 transition-transform duration-200 group-hover:scale-110">{rightIcon}</span>
        )}
      </div>

      {/* Enhanced Shimmer effect */}
      {!disabled && !loading && (
        <div className="absolute inset-0 -top-1 -bottom-1 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
      )}

      {/* Glow effect for special variants */}
      {!disabled && !loading && (variant === 'modern' || variant === 'primary') && (
        <div className="absolute inset-0 rounded-inherit bg-gradient-to-r from-slate-500/20 to-slate-700/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
