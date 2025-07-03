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

  // Load user from sessionStorage
  useEffect(() => {
    const storedUser = JSON.parse(sessionStorage.getItem('cratlyUser'))
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  // 🔐 Login
  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/users/login`, {
        email,
        password
      })

      setUser(res.data)
      sessionStorage.setItem('cratlyUser', JSON.stringify(res.data))
      navigate('/') // redirect to home or profile
    } catch (err) {
      throw err.response?.data?.message || 'Login failed'
    }
  }

  // 🚪 Logout
  const logout = () => {
    setUser(null)
    sessionStorage.removeItem('cratlyUser')
    navigate('/login')
  }

return (
  <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
    {children}
  </AuthContext.Provider>
)

}
