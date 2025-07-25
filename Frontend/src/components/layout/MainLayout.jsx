
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'
import AuthManager from '../auth/AuthManager'


const MainLayout = () => {
  const [authModal, setAuthModal] = useState(null) // 'login' or null
  const { user } = useContext(AuthContext)
  const [key, setKey] = useState(0)

  // Re-render layout when user changes (e.g., after logout)
  useEffect(() => {
    setKey((k) => k + 1)
  }, [user?.isAdmin])

  const handleOpenAuth = (type) => setAuthModal(type)
  const handleCloseAuth = () => setAuthModal(null)

  return (
    <div key={key} className="flex flex-col min-h-screen bg-gray-50">
      <Navbar onOpenAuth={handleOpenAuth} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      {authModal === 'login' && (
        <AuthManager isOpen={true} onClose={handleCloseAuth} />
      )}
    </div>
  )
}

export default MainLayout
