import { useState } from 'react'
import Login from '../../auth/Login'
import Register from '../../auth/Register'

const AuthManager = ({ initialMode = 'login', isOpen, onClose }) => {
  const [currentMode, setCurrentMode] = useState(initialMode) // 'login' or 'register'

  const switchToLogin = () => setCurrentMode('login')
  const switchToRegister = () => setCurrentMode('register')

  if (currentMode === 'register') {
    return (
      <Register
        isOpen={isOpen}
        onClose={onClose}
        onSwitchToLogin={switchToLogin}
      />
    )
  }

  return (
    <Login
      isOpen={isOpen}
      onClose={onClose}
      onSwitchToRegister={switchToRegister}
    />
  )
}

export default AuthManager
