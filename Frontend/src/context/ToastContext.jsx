import { createContext, useState, useContext } from 'react'
import Toast from '../components/ui/Toast'
export const ToastContext = createContext()

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success', duration = 3000) => {
    setToast({ message, type })

    setTimeout(() => {
      setToast(null)
    }, duration)
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
