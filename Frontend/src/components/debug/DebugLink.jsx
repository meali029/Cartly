// Debug Link Component - shows debug link when needed
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const DebugLink = () => {
  const [showDebugLink, setShowDebugLink] = useState(false)

  useEffect(() => {
    // Show debug link in development
    const isDev = import.meta.env.DEV
    
    // Show debug link if on Vercel (to help with deployment issues)
    const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')
    
    // Show if there were recent API errors (you can extend this logic)
    const hasRecentAPIErrors = localStorage.getItem('api-errors') === 'true'
    
    setShowDebugLink(isDev || isVercel || hasRecentAPIErrors)
  }, [])

  if (!showDebugLink) return null

  return (
    <div className="flex items-center gap-2">
      <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
      <Link 
        to="/debug" 
        className="text-slate-500 hover:text-slate-300 text-xs underline transition-colors duration-300"
        title="API Debug Console - Troubleshoot connection issues"
      >
        🔧 API Debug
      </Link>
    </div>
  )
}

export default DebugLink
