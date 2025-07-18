const Badge = ({ 
  text, 
  color = 'gray', 
  variant = 'solid', 
  size = 'md', 
  icon = null, 
  pulse = false, 
  removable = false, 
  onRemove = null,
  animate = false,
  className = ''
}) => {
  const sizeStyles = {
    xs: 'px-2 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  const colorStyles = {
    gray: {
      solid: 'bg-slate-100 text-slate-800 border-slate-200',
      outline: 'bg-transparent text-slate-700 border-slate-300',
      gradient: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-200',
      ghost: 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100',
    },
    slate: {
      solid: 'bg-slate-100 text-slate-800 border-slate-200',
      outline: 'bg-transparent text-slate-700 border-slate-300',
      gradient: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-800 border-slate-200',
      ghost: 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100',
    },
    red: {
      solid: 'bg-red-100 text-red-700 border-red-200',
      outline: 'bg-transparent text-red-600 border-red-300',
      gradient: 'bg-gradient-to-r from-red-100 to-red-200 text-red-700 border-red-200',
      ghost: 'bg-red-50 text-red-600 border-transparent hover:bg-red-100',
    },
    green: {
      solid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      outline: 'bg-transparent text-emerald-600 border-emerald-300',
      gradient: 'bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-700 border-emerald-200',
      ghost: 'bg-emerald-50 text-emerald-600 border-transparent hover:bg-emerald-100',
    },
    blue: {
      solid: 'bg-slate-100 text-slate-700 border-slate-200',
      outline: 'bg-transparent text-slate-600 border-slate-300',
      gradient: 'bg-gradient-to-r from-slate-100 to-slate-200 text-slate-700 border-slate-200',
      ghost: 'bg-slate-50 text-slate-600 border-transparent hover:bg-slate-100',
    },
    yellow: {
      solid: 'bg-amber-100 text-amber-800 border-amber-200',
      outline: 'bg-transparent text-amber-700 border-amber-300',
      gradient: 'bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 border-amber-200',
      ghost: 'bg-amber-50 text-amber-700 border-transparent hover:bg-amber-100',
    },
    indigo: {
      solid: 'bg-slate-200 text-slate-800 border-slate-300',
      outline: 'bg-transparent text-slate-700 border-slate-400',
      gradient: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 border-slate-300',
      ghost: 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200',
    },
    purple: {
      solid: 'bg-slate-200 text-slate-800 border-slate-300',
      outline: 'bg-transparent text-slate-700 border-slate-400',
      gradient: 'bg-gradient-to-r from-slate-200 to-slate-300 text-slate-800 border-slate-300',
      ghost: 'bg-slate-100 text-slate-700 border-transparent hover:bg-slate-200',
    },
    pink: {
      solid: 'bg-rose-100 text-rose-700 border-rose-200',
      outline: 'bg-transparent text-rose-600 border-rose-300',
      gradient: 'bg-gradient-to-r from-rose-100 to-rose-200 text-rose-700 border-rose-200',
      ghost: 'bg-rose-50 text-rose-600 border-transparent hover:bg-rose-100',
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
      className={`inline-flex items-center gap-1.5 font-medium rounded-xl border transition-all duration-300 ${
        sizeStyles[size]
      } ${currentVariantStyles} ${pulse ? 'animate-pulse' : ''} ${
        animate ? 'hover:scale-105 transform' : ''
      } ${
        removable ? 'pr-1' : ''
      } ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate font-semibold">{text}</span>
      {removable && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 ml-1 p-1 rounded-xl hover:bg-black/20 transition-all duration-300 group"
          aria-label="Remove badge"
        >
          <svg className="w-3 h-3 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  )
}

export default Badge
