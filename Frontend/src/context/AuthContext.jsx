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
        setUser(userData)
        // Set axios default authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`
      } catch (err) {
        // If parsing fails, clear the storage
        console.error('Failed to parse user data:', err)
        localStorage.removeItem('cratlyUser')
        localStorage.removeItem('cratlyToken')
      }
    }
    setLoading(false)
  }, [])

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
          navigate('/login')
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
      
      // Navigate based on user type
      if (userData.isAdmin) {
        navigate('/admin/dashboard')
      } else {
        navigate('/')
      }
    } catch (err) {
      throw err.response?.data?.message || 'Login failed'
    }
  }

  // 🚪 Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('cratlyUser')
    localStorage.removeItem('cratlyToken')
    
    // Remove axios default authorization header
    delete axios.defaults.headers.common['Authorization']
    
    navigate('/login')
  }

  // Check if token is valid (optional - for enhanced security)
  const checkTokenValidity = async () => {
    const token = localStorage.getItem('cratlyToken')
    if (!token) return false

    try {
      // You can add a token validation endpoint here
      // For now, we'll just check if token exists
      return !!token
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
