import { forwardRef, useState } from 'react'

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  onFocus,
  onBlur,
  error = '',
  success = false,
  required = false,
  disabled = false,
  readOnly = false,
  autoComplete = 'off',
  autoFocus = false,
  maxLength,
  minLength,
  pattern,
  leftIcon = null,
  rightIcon = null,
  leftAddon = null,
  rightAddon = null,
  size = 'md',
  variant = 'default',
  helpText = '',
  showPasswordToggle = false,
  className = '',
  inputClassName = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-sm',
    lg: 'px-4 py-4 text-base',
  }

  const variantStyles = {
    default: 'border-slate-300 focus:border-slate-500 focus:ring-slate-500 bg-white',
    filled: 'border-slate-200 bg-slate-50 focus:border-slate-500 focus:ring-slate-500 focus:bg-white',
    flushed: 'border-0 border-b-2 border-slate-300 rounded-none focus:border-slate-500 focus:ring-0 px-0 bg-transparent',
    unstyled: 'border-0 focus:ring-0 px-0 bg-transparent',
    modern: 'border-slate-200 bg-gradient-to-r from-slate-50 to-white focus:border-slate-400 focus:ring-slate-400 focus:from-slate-50 focus:to-white',
  }

  const handleFocus = (e) => {
    setIsFocused(true)
    onFocus?.(e)
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    onBlur?.(e)
  }

  const inputType = type === 'password' && showPassword ? 'text' : type
  const hasError = error && error.length > 0
  const hasSuccess = success && !hasError

  const borderColor = hasError 
    ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
    : hasSuccess 
    ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
    : variantStyles[variant]

  const iconColor = hasError 
    ? 'text-red-500' 
    : hasSuccess 
    ? 'text-emerald-500' 
    : isFocused 
    ? 'text-slate-500' 
    : 'text-slate-400'

  return (
    <div className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
            hasError ? 'text-red-700' : hasSuccess ? 'text-emerald-700' : 'text-slate-700'
          }`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Addon */}
        {leftAddon && (
          <div className="absolute left-0 inset-y-0 flex items-center">
            <span className="bg-slate-50 border border-r-0 border-slate-300 rounded-l-lg px-3 text-slate-500 text-sm">
              {leftAddon}
            </span>
          </div>
        )}

        {/* Input */}
        <input
          ref={ref}
          id={name}
          name={name}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          maxLength={maxLength}
          minLength={minLength}
          pattern={pattern}
          className={`w-full border rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100 placeholder-slate-400 ${
            sizeStyles[size]
          } ${borderColor} ${
            leftIcon || leftAddon ? 'pl-10' : ''
          } ${
            rightIcon || rightAddon || (type === 'password' && showPasswordToggle) ? 'pr-10' : ''
          } ${
            isFocused ? 'shadow-xl transform scale-[1.02]' : 'shadow-sm'
          } ${inputClassName}`}
          {...props}
        />

        {/* Left Icon */}
        {leftIcon && !leftAddon && (
          <div className="absolute left-3 inset-y-0 flex items-center pointer-events-none">
            <span className={`transition-colors duration-200 ${iconColor}`}>
              {leftIcon}
            </span>
          </div>
        )}

        {/* Right Icon or Password Toggle */}
        {(rightIcon || (type === 'password' && showPasswordToggle)) && !rightAddon && (
          <div className="absolute right-3 inset-y-0 flex items-center">
            {type === 'password' && showPasswordToggle ? (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`transition-colors duration-200 hover:text-slate-600 ${iconColor}`}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            ) : (
              <span className={`transition-colors duration-200 ${iconColor}`}>
                {rightIcon}
              </span>
            )}
          </div>
        )}

        {/* Right Addon */}
        {rightAddon && (
          <div className="absolute right-0 inset-y-0 flex items-center">
            <span className="bg-slate-50 border border-l-0 border-slate-300 rounded-r-lg px-3 text-slate-500 text-sm">
              {rightAddon}
            </span>
          </div>
        )}

        {/* Status Icons */}
        {(hasError || hasSuccess) && !rightIcon && !rightAddon && !(type === 'password' && showPasswordToggle) && (
          <div className="absolute right-3 inset-y-0 flex items-center pointer-events-none">
            {hasError ? (
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        )}
      </div>

      {/* Help Text */}
      {helpText && !hasError && (
        <p className="text-xs text-slate-500 mt-1">{helpText}</p>
      )}

      {/* Error Message */}
      {hasError && (
        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}

      {/* Success Message */}
      {hasSuccess && (
        <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Input looks good!
        </p>
      )}

      {/* Character Count */}
      {maxLength && (
        <p className="text-xs text-slate-500 mt-1 text-right">
          {value?.length || 0}/{maxLength}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
