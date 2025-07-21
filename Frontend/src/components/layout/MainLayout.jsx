
import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'
import AuthManager from '../auth/AuthManager'


const MainLayout = () => {
  const [authModal, setAuthModal] = useState(null) // 'login' or null

  const handleOpenAuth = (type) => setAuthModal(type)
  const handleCloseAuth = () => setAuthModal(null)

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
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
