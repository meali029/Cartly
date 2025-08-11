
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import LiveChat from '../chat/LiveChat'
import AccessibilityFab from '../ui/AccessibilityFab'
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
  {/* Mobile bottom spacer so content isn't hidden behind BottomNav */}
  <div className="h-20 md:h-0 bg-gray-900 border-0" />
  {/* Mobile Bottom Navigation (hidden for admin via Navbar null when admin) */}
  {!user?.isAdmin && <BottomNav onOpenAuth={handleOpenAuth} />}
  {/* Live Chat controlled by AccessibilityFab; hide its own toggle */}
  {!user?.isAdmin && <LiveChat showToggle={false} />}
  {/* Unified accessibility button for Chat + Top (mobile only) */}
  {!user?.isAdmin && <AccessibilityFab />}
      {authModal === 'login' && (
        <AuthManager isOpen={true} onClose={handleCloseAuth} />
      )}
    </div>
  )
}

export default MainLayout
