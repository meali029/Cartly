import Navbar from './Navbar'
import Footer from './Footer'
import ScrollManager from '../ui/ScrollManager'
import AccessibilityFab from '../ui/AccessibilityFab'
import AuthManager from '../auth/AuthManager'
import LiveChat from '../chat/LiveChat'
import { Outlet } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LayoutWrapper = () => {
  const { user } = useContext(AuthContext)
  
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' or 'register'

  // Auth modal handlers
  const openAuthModal = (mode = 'login') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  const closeAuthModal = () => {
    setShowAuthModal(false)
  }

  // Add customer-layout class to body on mount, remove on unmount
  useEffect(() => {
    document.body.classList.add('customer-layout')
    return () => {
      document.body.classList.remove('customer-layout')
    }
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* Navbar */}
      <Navbar onOpenAuth={openAuthModal} />

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer - only show for non-admin users */}
      {!user?.isAdmin && <Footer />}
      
      {/* Live Chat Widget - only show for non-admin users */}
  {!user?.isAdmin && <LiveChat showToggle={false} />}
      
      {/* Scroll Management */}
      <ScrollManager 
        threshold={400}
        smooth={true}
        showProgress={true}
        size="md"
        position="bottom-right"
        showButton={false}
      />

      {/* Unified accessibility fab for chat + top */}
      {!user?.isAdmin && <AccessibilityFab />}
      
      {/* Auth Modal - Rendered at top level for proper positioning */}
      <AuthManager
        initialMode={authMode}
        isOpen={showAuthModal}
        onClose={closeAuthModal}
      />
    </div>
  )
}

export default LayoutWrapper
