import { useContext, useState } from 'react'
import { ChatBubbleLeftRightIcon, ChevronUpIcon, XMarkIcon, LifebuoyIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import { useChatNotifications } from '../../context/ChatNotificationContext'
import { AuthContext } from '../../context/AuthContext'
import { Link } from 'react-router-dom'

const AccessibilityFab = () => {
  const { unreadCount } = useChatNotifications()
  const { user } = useContext(AuthContext)
  const [open, setOpen] = useState(false)

  const scrollTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    setOpen(false)
  }

  const toggleChat = () => {
    window.dispatchEvent(new Event('livechat:toggle'))
    setOpen(false)
  }

  return (
    <div className="fixed right-[-1px] sm:right-5 z-[75] bottom-[110px] sm:bottom-20 md:hidden">
      <div className="relative w-5 h-5">
        {/* Action: Chat or Support */}
        {user && !user.isAdmin ? (
          <button
            onClick={toggleChat}
            aria-label="Open live chat"
            className={`absolute right-0 bottom-0 p-2 border-[2px] border-gray-800 rounded-full bg-blue-600 text-slate-700 shadow-xl ring-1 ring-slate-200 transition-all duration-300 ease-out ${
              open ? '-translate-y-[50px] -translate-x-2 opacity-100' : 'translate-y-0 opacity-0 pointer-events-none'
            }`}
          >
            <span className="relative block">
              <ChatBubbleLeftRightIcon className="h-6 w-6 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 min-w-4 px-1 flex items-center justify-center shadow">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </span>
          </button>
        ) : (
          <Link
            to="/contact-support"
            aria-label="Contact support"
            className={`absolute right-0 bottom-0 p-2 rounded-full bg-white text-slate-700 shadow-xl ring-1 ring-slate-200 transition-all duration-300 ease-out ${
              open ? '-translate-y-[50px] -translate-x-2 opacity-100' : 'translate-y-0 opacity-0 pointer-events-none'
            }`}
          >
            <ChatBubbleLeftRightIcon className="h-6 w-6" />
          </Link>
        )}

        {/* Action: Scroll to top */}
        <button
          onClick={scrollTop}
          aria-label="Scroll to top"
          className={`absolute right-0 bottom-0 p-2 border-[3px] border-gray-800 rounded-full bg-white text-slate-700 shadow-xl ring-1 ring-slate-200 transition-all duration-300 ease-out ${
            open ? '-translate-y-[9px] -translate-x-11 opacity-100 delay-75' : 'translate-y-0 opacity-0 pointer-events-none'
          }`}
        >
          <ChevronUpIcon className="h-6 w-6" />
        </button>

        {/* Main FAB */}
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Accessibility menu"
          aria-expanded={open}
          className={`absolute right-0 bottom-0 bg-gradient-to-br from-slate-600 to-slate-800 text-white p-2 rounded-s-full shadow-2xl ring-2 ring-white transition-all ${
            open ? 'scale-95' : 'scale-99'
          }`}
        >
          {open ? (
            <XMarkIcon className="h-5 w-5" />
          ) : (
           <InformationCircleIcon className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )
}

export default AccessibilityFab
