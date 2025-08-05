import { createContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

// Create context
export const AuthContext = createContext()

// Provider
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('cratlyUser')
    const storedToken = localStorage.getItem('cratlyToken')
    
    if (storedUser && storedToken) {
      try {
        const userData = JSON.parse(storedUser)
        
        // Import token utilities to check if token is expired
        import('../utils/tokenUtils').then(({ isTokenExpired }) => {
          if (isTokenExpired(storedToken)) {
            console.log('Stored token is expired, clearing storage')
            localStorage.removeItem('cratlyUser')
            localStorage.removeItem('cratlyToken')
            setLoading(false)
            return
          }
          
          setUser(userData)
          // Set axios default authorization header
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          
          // If user is admin and on home page, redirect to dashboard
          if (userData.isAdmin && window.location.pathname === '/') {
            navigate('/admin/dashboard', { replace: true })
          }
          
          setLoading(false)
        }).catch((err) => {
          console.error('Error loading token utilities:', err)
          setUser(userData)
          axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
          setLoading(false)
        })
      } catch (err) {
        // If parsing fails, clear the storage
        console.error('Failed to parse user data:', err)
        localStorage.removeItem('cratlyUser')
        localStorage.removeItem('cratlyToken')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [navigate])

  // Set up axios interceptor for token expiration
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid, logout user
          setUser(null)
          localStorage.removeItem('cratlyUser')
          localStorage.removeItem('cratlyToken')
          delete axios.defaults.headers.common['Authorization']
          
          // Show expiration message to user
          if (typeof window !== 'undefined' && window.dispatchEvent) {
            window.dispatchEvent(new CustomEvent('token-expired', {
              detail: { message: 'Your session has expired. Please log in again.' }
            }))
          }
          
          navigate('/')
        }
        return Promise.reject(error)
      }
    )

    return () => {
      axios.interceptors.response.eject(interceptor)
    }
  }, [navigate])

  // 🔐 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        email,
        password
      })

      const { token, ...userData } = res.data
      
      setUser(userData)
      localStorage.setItem('cratlyUser', JSON.stringify(userData))
      localStorage.setItem('cratlyToken', token)
      
      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      // Navigate based on user type - always redirect admins to dashboard
      if (userData.isAdmin) {
        navigate('/admin/dashboard', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      // Handle email verification requirement
      if (err.response?.data?.requiresEmailVerification) {
        throw new Error('Please verify your email before logging in. Check your inbox for the verification code.')
      }
      
      const errorMessage = err.response?.data?.message || 'Login failed'
      throw new Error(errorMessage)
    }
  }

  // 🚪 Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('cratlyUser')
    localStorage.removeItem('cratlyToken')
    
    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization']
    
    navigate('/')
  }

  // Check if token is valid (optional - for enhanced security)
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('cratlyToken')
    if (!token) return false

    try {
      // Import token utilities
      const { isTokenExpired } = await import('../utils/tokenUtils')
      
      // Check if token is expired on client-side first
      if (isTokenExpired(token)) {
        console.log('Token expired on client-side, logging out')
        logout()
        return false
      }
      
      // You can add a server-side token validation endpoint here
      // For now, we'll just check if token exists and is not expired
      return true
    } catch (error) {
      // Token is invalid, logout user
      console.error('Token validation failed:', error)
      logout()
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading, checkTokenValidity }}>
      {children}
    </AuthContext.Provider>
  )

}
