import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'
import { useContext, useEffect } from 'react'
import { AuthContext } from '../../context/AuthContext'

const LayoutWrapper = () => {
  const { user } = useContext(AuthContext)

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
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* Footer - only show for non-admin users */}
      {!user?.isAdmin && <Footer />}
    </div>
  )
}

export default LayoutWrapper
