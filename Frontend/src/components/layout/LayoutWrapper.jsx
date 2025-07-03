import Navbar from './Navbar'
import Footer from './Footer'
import { Outlet } from 'react-router-dom'

const LayoutWrapper = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
      {/* 🔝 Sticky Navbar */}
      <Navbar />

      {/* 📄 Page Content */}
      <main className="flex-grow container mx-auto px-4 py-6">
        <Outlet />
      </main>

      {/* 🔚 Footer */}
      <Footer />
    </div>
  )
}

export default LayoutWrapper
