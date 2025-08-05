import { BrowserRouter } from 'react-router-dom'
import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollToTopBtn from './components/ui/ScrollToTopButton'
import LiveChat from './components/chat/LiveChat'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider, useToast } from './context/ToastContext'
import { ChatNotificationProvider } from './context/ChatNotificationContext'
import "./index.css";

// Component to handle token expiration messages
const TokenExpirationHandler = () => {
  const { showToast } = useToast()

  useEffect(() => {
    const handleTokenExpired = (event) => {
      showToast(event.detail.message, 'warning', 5000)
    }

    window.addEventListener('token-expired', handleTokenExpired)
    
    return () => {
      window.removeEventListener('token-expired', handleTokenExpired)
    }
  }, [showToast])

  return null
}

function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ChatNotificationProvider>
            <TokenExpirationHandler />
            <ScrollToTop />
            <ScrollToTopBtn />
            <LiveChat />
            <AppRoutes />
          </ChatNotificationProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    </ToastProvider>
  )
}

export default App
