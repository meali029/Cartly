import { useState, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import AuthModal from '../components/ui/AuthModal'
import { 
  sendPasswordResetOTP, 
  verifyPasswordResetOTP, 
  resetPassword 
} from '../services/authService'
import { Link } from 'react-router-dom'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  ArrowRightIcon,
  UserCircleIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const Login = ({ isOpen, onClose, onSwitchToRegister }) => {
  const { login } = useContext(AuthContext)
  const { showToast } = useToast()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [forgotPasswordStep, setForgotPasswordStep] = useState(1) // 1: email, 2: OTP, 3: new password
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login(email, password)
      showToast('✅ Logged in successfully')
      if (onClose) onClose() // Close modal on successful login
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err.message || 'Login failed'
      setError(errorMessage)
      
      // Show specific toast for email verification
      if (errorMessage.includes('verify your email')) {
        showToast(errorMessage, 'error', 6000)
      } else {
        showToast('❌ ' + errorMessage, 'error')
      }
    } finally {
      setLoading(false)
    }
  }  // Handle forgot password - send OTP
  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    setError('')

    try {
      const response = await sendPasswordResetOTP(forgotEmail)
      
      if (response.development) {
        // Development mode - show the OTP and helpful info
        if (response.otp) {
          showToast(`🔐 Development Mode: Your OTP is ${response.otp}`)
        } else {
          showToast('🔐 OTP generated - check server console')
        }
        
        if (response.info) {
          console.warn(response.info)
        }
      } else {
        showToast('🔐 OTP sent to your email')
      }
      
      setForgotPasswordStep(2)
    } catch (err) {
      console.error('Forgot password error:', err)
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Handle OTP verification
  const handleOTPVerification = async (e) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    setError('')

    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit OTP')
      setForgotPasswordLoading(false)
      return
    }

    try {
      await verifyPasswordResetOTP(forgotEmail, otpCode)
      showToast('✅ OTP verified successfully')
      setForgotPasswordStep(3)
    } catch (err) {
      console.error('OTP verification error:', err)
      setError(err.response?.data?.message || 'Invalid OTP. Please check and try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  // Handle password reset
  const handlePasswordReset = async (e) => {
    e.preventDefault()
    setForgotPasswordLoading(true)
    setError('')

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match')
      setForgotPasswordLoading(false)
      return
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long')
      setForgotPasswordLoading(false)
      return
    }

    try {
      await resetPassword(forgotEmail, otpCode, newPassword)
      showToast('🎉 Password reset successfully! Please login with your new password')
      
      // Reset all forgot password states
      setShowForgotPassword(false)
      setForgotPasswordStep(1)
      setForgotEmail('')
      setOtpCode('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Auto-fill email field
      setEmail(forgotEmail)
    } catch (err) {
      console.error('Password reset error:', err)
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.')
    } finally {
      setForgotPasswordLoading(false)
    }
  }

  const resetForgotPassword = () => {
    setShowForgotPassword(false)
    setForgotPasswordStep(1)
    setForgotEmail('')
    setOtpCode('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
  }

  return (
    <AuthModal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-[90vh] overflow-y-auto">
        {/* Main Login Card */}
        {!showForgotPassword && (
          <>
            {/* Header - Responsive */}
            <div className="text-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-3 sm:p-4 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <UserCircleIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">Welcome Back</h2>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg">Sign in to your Cartly account</p>
            </div>

            {/* Form - Responsive */}
            <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShieldCheckIcon className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Email Field - Responsive */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    </div>
                    <input
                      type="email"
                      className="block w-full pl-8 sm:pl-10 pr-3 py-3 sm:py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300 text-sm sm:text-base"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field - Responsive */}
                <div className="group">
                  <label className="block text-xs sm:text-sm font-semibold text-slate-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
                      <LockClosedIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="block w-full pl-8 sm:pl-10 pr-10 sm:pr-12 py-3 sm:py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300 text-sm sm:text-base"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeSlashIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                      ) : (
                        <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link - Responsive */}
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                  >
                    Forgot your password?
                  </button>
                </div>

                {/* Login Button - Responsive */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm sm:text-base">Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span className="text-sm sm:text-base">Sign In</span>
                      <ArrowRightIcon className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Register Link - Responsive */}
              <div className="mt-6 sm:mt-8 text-center">
                <p className="text-slate-600 text-sm sm:text-base">
                  Don't have an account?{' '}
                  <button 
                    onClick={onSwitchToRegister}
                    className="font-semibold text-slate-900 hover:text-slate-700 transition-colors text-sm sm:text-base"
                  >
                    Create one now
                  </button>
                </p>
              </div>
            </div>
          </>
        )}

        {/* Forgot Password Modal - Responsive */}
        {showForgotPassword && (
          <>
            {/* Header - Responsive */}
            <div className="text-center px-4 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8">
              <div className="flex items-center justify-center mb-4 sm:mb-6">
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-3 sm:p-4 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <LockClosedIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 mb-1 sm:mb-2">
                {forgotPasswordStep === 1 && 'Reset Password'}
                {forgotPasswordStep === 2 && 'Verify OTP'}
                {forgotPasswordStep === 3 && 'New Password'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg">
                {forgotPasswordStep === 1 && 'Enter your email to receive a reset code'}
                {forgotPasswordStep === 2 && 'Enter the 6-digit code sent to your email'}
                {forgotPasswordStep === 3 && 'Create a new password for your account'}
              </p>
            </div>

            {/* Form */}
            <div className="px-8 pb-8">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 animate-pulse">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShieldCheckIcon className="w-5 h-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Email */}
              {forgotPasswordStep === 1 && (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <EnvelopeIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                        placeholder="Enter your email address"
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={resetForgotPassword}
                      className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                    >
                      Back to Login
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="flex-1 bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {forgotPasswordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Sending...
                        </>
                      ) : (
                        'Send OTP'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 2: OTP */}
              {forgotPasswordStep === 2 && (
                <form onSubmit={handleOTPVerification} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength="6"
                      className="block w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 text-center text-lg font-mono tracking-widest hover:border-slate-300"
                      placeholder="000000"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <p className="text-xs text-slate-500 mt-2 text-center">
                      Code sent to {forgotEmail}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordStep(1)}
                      className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="flex-1 bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {forgotPasswordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Verifying...
                        </>
                      ) : (
                        'Verify OTP'
                      )}
                    </button>
                  </div>
                </form>
              )}

              {/* Step 3: New Password */}
              {forgotPasswordStep === 3 && (
                <form onSubmit={handlePasswordReset} className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LockClosedIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                      </div>
                      <input
                        type="password"
                        className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setForgotPasswordStep(2)}
                      className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl hover:bg-slate-200 transition-all duration-300 transform hover:scale-105"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={forgotPasswordLoading}
                      className="flex-1 bg-slate-900 text-white font-semibold py-3 px-4 rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                    >
                      {forgotPasswordLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Resetting...
                        </>
                      ) : (
                        'Reset Password'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </AuthModal>
  )
}

export default Login
