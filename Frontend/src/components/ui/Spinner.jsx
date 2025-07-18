const Spinner = ({ 
  size = 'md', 
  color = 'indigo', 
  variant = 'default',
  thickness = 'md',
  speed = 'normal',
  label = 'Loading...',
  center = true,
  className = '' 
}) => {
  const sizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12',
  }

  const thicknesses = {
    sm: 'border-2',
    md: 'border-4',
    lg: 'border-8',
  }

  const speeds = {
    slow: 'animate-spin-slow',
    normal: 'animate-spin',
    fast: 'animate-spin-fast',
  }

  const colors = {
    slate: 'border-slate-500',
    indigo: 'border-slate-500',
    blue: 'border-slate-600',
    green: 'border-emerald-500',
    red: 'border-red-500',
    yellow: 'border-amber-500',
    purple: 'border-slate-700',
    pink: 'border-rose-500',
    gray: 'border-slate-500',
    white: 'border-white',
    black: 'border-slate-900',
  }

  const variants = {
    default: 'rounded-full border-t-transparent',
    dots: 'rounded-full',
    pulse: 'rounded-full',
    bars: 'rounded-none',
  }

  const baseClasses = `${sizes[size]} ${thicknesses[thickness]} ${colors[color]} ${variants[variant]} ${speeds[speed]}`

  // Different spinner variants
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`${sizes[size]} ${colors[color]} rounded-full animate-bounce`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'pulse':
        return (
          <div className={`${sizes[size]} ${colors[color]} rounded-full animate-pulse bg-current opacity-75`} />
        )
      
      case 'bars':
        return (
          <div className="flex space-x-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`w-1 ${sizes[size]} ${colors[color]} bg-current animate-pulse`}
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        )
      
      case 'gradient':
        return (
          <div className={`${sizes[size]} rounded-full animate-spin border-4 border-transparent bg-gradient-to-r from-slate-500 to-slate-700 relative`}>
            <div className={`${sizes[size]} rounded-full bg-white absolute inset-1`}></div>
          </div>
        )
      
      default:
        return <div className={baseClasses} />
    }
  }

  const content = (
    <div className={`flex items-center space-x-3 ${className}`}>
      {renderSpinner()}
      {label && (
        <span className="text-sm font-semibold text-slate-600 animate-pulse">
          {label}
        </span>
      )}
    </div>
  )

  return center ? (
    <div className="flex justify-center items-center">
      {content}
    </div>
  ) : (
    content
  )
}

// Predefined spinner variants
export const LoadingSpinner = ({ text = 'Loading...', ...props }) => (
  <Spinner label={text} {...props} />
)

export const ProcessingSpinner = ({ text = 'Processing...', ...props }) => (
  <Spinner label={text} color="slate" {...props} />
)

export const SavingSpinner = ({ text = 'Saving...', ...props }) => (
  <Spinner label={text} color="green" {...props} />
)

export const DeletingSpinner = ({ text = 'Deleting...', ...props }) => (
  <Spinner label={text} color="red" {...props} />
)

export const DotsSpinner = ({ ...props }) => (
  <Spinner variant="dots" {...props} />
)

export const PulseSpinner = ({ ...props }) => (
  <Spinner variant="pulse" {...props} />
)

export const BarsSpinner = ({ ...props }) => (
  <Spinner variant="bars" {...props} />
)

export default Spinner
