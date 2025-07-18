import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { registerUser, verifyEmailOTP, resendEmailVerification } from '../services/authService'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  EyeIcon, 
  EyeSlashIcon, 
  EnvelopeIcon, 
  LockClosedIcon,
  UserIcon,
  ArrowRightIcon,
  UserPlusIcon,
  ShieldCheckIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

const Register = () => {
  const { setUser } = useContext(AuthContext)
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState({})
  const [verificationStep, setVerificationStep] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [resendingOtp, setResendingOtp] = useState(false)
  const [countdown, setCountdown] = useState(0)

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null
    if (countdown > 0) {
      interval = setInterval(() => {
        setCountdown(countdown - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [countdown])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true })
  }

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '' }
    
    let strength = 0
    let label = ''
    
    if (password.length >= 6) strength++
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    if (strength <= 2) label = 'Weak'
    else if (strength <= 4) label = 'Medium'
    else label = 'Strong'
    
    return { strength, label }
  }

  const passwordStrength = getPasswordStrength(formData.password)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validate password confirmation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    // Validate password strength
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      setLoading(false)
      return
    }

    try {
      const { confirmPassword: _, ...userData } = formData
      const response = await registerUser(userData)
      
      // Check if email verification is required
      if (response.requiresVerification) {
        setVerificationStep(true)
        setCountdown(60) // Start 60 second countdown
        showToast('📧 Verification email sent! Please check your inbox.')
      } else {
        // Direct registration (development mode)
        const { token, ...userData } = response
        setUser(userData)
        localStorage.setItem('cratlyUser', JSON.stringify(userData))
        localStorage.setItem('cratlyToken', token)
        
        // Set axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        
        showToast('🎉 Account created successfully!')
        navigate('/')
      }
    } catch (err) {
      console.error('Register error:', err)
      setError(err?.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const data = await verifyEmailOTP(formData.email, otpCode)
      const { token, ...userData } = data
      setUser(userData)
      localStorage.setItem('cratlyUser', JSON.stringify(userData))
      localStorage.setItem('cratlyToken', token)
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      showToast('✅ Email verified successfully! Welcome to Cartly!')
      navigate('/')
    } catch (err) {
      console.error('Verification error:', err)
      setError(err?.response?.data?.message || 'Invalid verification code')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setResendingOtp(true)
    setError('')

    try {
      await resendEmailVerification(formData.email)
      setCountdown(60) // Reset countdown
      showToast('📧 Verification email sent again!')
    } catch (err) {
      console.error('Resend error:', err)
      setError(err?.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResendingOtp(false)
    }
  }

  // Email verification step
  if (verificationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform hover:shadow-3xl transition-all duration-500">
            {/* Header */}
            <div className="text-center px-8 py-8">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-4 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                  <EnvelopeIcon className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-slate-900 mb-2">Verify Your Email</h2>
              <p className="text-slate-600 text-lg">Enter the code sent to {formData.email}</p>
            </div>

            {/* Verification Form */}
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

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                {/* OTP Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    className="block w-full px-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 text-center text-xl font-mono tracking-widest hover:border-slate-300"
                    placeholder="000000"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    maxLength="6"
                    required
                  />
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Enter the 6-digit code from your email
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Verify Email
                    </>
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center">
                  <p className="text-sm text-slate-600 mb-2">
                    Didn't receive the code?
                  </p>
                  {countdown > 0 ? (
                    <p className="text-sm text-slate-500 flex items-center justify-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      Resend in {countdown}s
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={resendingOtp}
                      className="text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors"
                    >
                      {resendingOtp ? 'Sending...' : 'Resend Code'}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform hover:shadow-3xl transition-all duration-500">
          {/* Header */}
          <div className="text-center px-8 py-8">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-4 rounded-2xl transform hover:scale-105 transition-transform duration-300">
                <UserPlusIcon className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 mb-2">Join Cartly</h2>
            <p className="text-slate-600 text-lg">Create your account to get started</p>
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {touched.name && !formData.name && (
                  <p className="text-red-500 text-xs mt-1">Name is required</p>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    className="block w-full pl-10 pr-3 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                </div>
                {touched.email && !formData.email && (
                  <p className="text-red-500 text-xs mt-1">Email is required</p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-12 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-slate-500">Password strength:</span>
                      <span className={`text-xs font-medium ${
                        passwordStrength.strength <= 2 ? 'text-red-500' : 
                        passwordStrength.strength <= 4 ? 'text-yellow-500' : 
                        'text-green-500'
                      }`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="flex gap-1">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < passwordStrength.strength
                              ? passwordStrength.strength <= 2
                                ? 'bg-red-500'
                                : passwordStrength.strength <= 4
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-slate-500 mt-2">
                  Password must be at least 6 characters long
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="group">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="w-5 h-5 text-slate-400 group-focus-within:text-slate-600 transition-colors" />
                  </div>
                  <input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="block w-full pl-10 pr-12 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-600 focus:border-transparent transition-all duration-300 placeholder-slate-400 text-slate-900 hover:border-slate-300"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-slate-50 rounded-r-xl transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-slate-400 hover:text-slate-600 transition-colors" />
                    )}
                  </button>
                </div>
                {touched.confirmPassword && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">Passwords do not match</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-slate-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <UserPlusIcon className="w-5 h-5" />
                    Create Account
                  </>
                )}
              </button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{' '}
                <Link to="/login" className="text-slate-900 hover:text-slate-700 font-medium transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register
