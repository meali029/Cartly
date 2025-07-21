import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import ScrollToTop from './components/ui/ScrollToTop'
import ScrollToTopBtn from './components/ui/ScrollToTopBtn'
import LiveChat from './components/ui/LiveChat'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { ToastProvider } from './context/ToastContext'
import { ChatNotificationProvider } from './context/ChatNotificationContext'
import "./index.css";


function App() {
  return (
    <ToastProvider>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ChatNotificationProvider>
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
