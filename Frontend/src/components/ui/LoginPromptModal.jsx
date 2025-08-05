import { useState } from 'react'
import { 
  XMarkIcon, 
  ShoppingCartIcon, 
  UserCircleIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  HeartIcon,
  TruckIcon
} from '@heroicons/react/24/outline'
import Login from '../../auth/Login'
import Register from '../../auth/Register'

const LoginPromptModal = ({ isOpen, onClose }) => {
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

  if (!isOpen) return null

  const handleClose = () => {
    setShowLogin(false)
    setShowRegister(false)
    onClose()
  }

  // If login or register modal is shown, render those instead
  if (showLogin) {
    return (
      <Login 
        isOpen={true} 
        onClose={handleClose}
        onSwitchToRegister={() => {
          setShowLogin(false)
          setShowRegister(true)
        }}
      />
    )
  }

  if (showRegister) {
    return (
      <Register 
        isOpen={true} 
        onClose={handleClose}
        onSwitchToLogin={() => {
          setShowRegister(false)
          setShowLogin(true)
        }}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <div className="relative transform overflow-hidden rounded-3xl bg-white shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <XMarkIcon className="w-5 h-5 text-gray-600" />
          </button>

          {/* Header */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 px-6 py-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <ShoppingCartIcon className="w-12 h-12 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Almost There!
            </h3>
            <p className="text-white/80 text-lg">
              Login to complete your order
            </p>
          </div>

          {/* Content */}
          <div className="px-6 py-8">
            {/* Benefits */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-slate-900 mb-4 text-center">
                Why create an account?
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <TruckIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Track Your Orders</p>
                    <p className="text-sm text-slate-600">Get real-time updates on your purchases</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <HeartIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Save Favorites</p>
                    <p className="text-sm text-slate-600">Create wishlists and save items</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="bg-slate-100 p-2 rounded-lg">
                    <ShieldCheckIcon className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">Secure Checkout</p>
                    <p className="text-sm text-slate-600">Faster, safer ordering experience</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setShowLogin(true)}
                className="w-full bg-slate-900 text-white font-semibold py-4 px-6 rounded-xl hover:bg-slate-800 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Login to Continue</span>
                <ArrowRightIcon className="w-4 h-4" />
              </button>

              <div className="text-center text-sm text-slate-600">
                Don't have an account?
              </div>

              <button
                onClick={() => setShowRegister(true)}
                className="w-full bg-white border-2 border-slate-300 text-slate-900 font-semibold py-4 px-6 rounded-xl hover:bg-slate-50 hover:border-slate-400 transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105"
              >
                <span>Create Account</span>
              </button>
            </div>

            {/* Security Note */}
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-green-800">100% Secure</span>
              </div>
              <p className="text-xs text-green-700">
                Your personal information is encrypted and protected. We never share your data with third parties.
              </p>
            </div>

            {/* Continue as Guest Option */}
            <div className="mt-6 text-center">
              <button
                onClick={handleClose}
                className="text-sm text-slate-500 hover:text-slate-700 transition-colors underline"
              >
                Continue filling order details (Login required to place order)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPromptModal
