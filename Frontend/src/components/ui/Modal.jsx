import { Fragment, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  persistent = false,
  className = '',
  overlayClassName = '',
  panelClassName = '',
  headerClassName = '',
  bodyClassName = '',
  footerClassName = '',
  footer = null,
  icon = null,
  variant = 'default'
}) => {
  const sizeStyles = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full mx-4',
  }

  const variantStyles = {
    default: 'bg-white border-slate-200',
    success: 'bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200',
    warning: 'bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200',
    error: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
    info: 'bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200',
  }

  const iconColors = {
    default: 'text-slate-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-red-400',
    info: 'text-slate-400',
  }

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleClose = () => {
    if (!persistent) {
      onClose()
    }
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className={`fixed inset-0 z-50 overflow-y-auto ${className}`}
        onClose={closeOnOverlayClick ? handleClose : () => {}}
        static={!closeOnEscape}
      >
        <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Background overlay */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className={`fixed inset-0 bg-gradient-to-br from-black/40 to-slate-900/60 backdrop-blur-md transition-opacity ${overlayClassName}`} />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          {/* Modal panel */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className={`inline-block align-bottom rounded-3xl border shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:w-full ${sizeStyles[size]} ${variantStyles[variant]} ${panelClassName}`}>
              {/* Header */}
              {(title || showCloseButton) && (
                <div className={`px-6 py-4 border-b border-slate-200 ${headerClassName}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {icon && (
                        <div className={`flex-shrink-0 ${iconColors[variant]}`}>
                          {icon}
                        </div>
                      )}
                      {title && (
                        <Dialog.Title as="h3" className="text-lg font-semibold text-slate-900">
                          {title}
                        </Dialog.Title>
                      )}
                    </div>
                    
                    {showCloseButton && (
                      <button
                        type="button"
                        onClick={handleClose}
                        className="rounded-xl p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 transition-all duration-300 group"
                        disabled={persistent}
                      >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className={`px-6 py-4 ${bodyClassName}`}>
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className={`px-6 py-4 bg-slate-50 border-t border-slate-200 rounded-b-3xl ${footerClassName}`}>
                  {footer}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  )
}

// Predefined Modal variants for common use cases
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'warning',
  loading = false 
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title={title}
    variant={variant}
    icon={
      variant === 'warning' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ) : null
    }
    footer={
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-xl hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
        >
          {loading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              <span>Loading...</span>
            </div>
          ) : (
            confirmText
          )}
        </button>
      </div>
    }
  >
    <p className="text-sm text-slate-600">{message}</p>
  </Modal>
)

export { ConfirmationModal }
export default Modal
