import { NavLink, useNavigate } from 'react-router-dom'
import { useContext, useState } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { CartContext } from '../../context/CartContext'
import { useChatNotifications } from '../../context/ChatNotificationContext'
import {
  HomeIcon,
  Squares2X2Icon,
  ClipboardDocumentListIcon,
  UserIcon,
  ShoppingCartIcon,
  ChatBubbleLeftRightIcon,
  ChevronUpDownIcon,
  LockClosedIcon,
  LifebuoyIcon
} from '@heroicons/react/24/outline'

// Mobile bottom navigation with a prominent center Cart button
const BottomNav = ({ onOpenAuth }) => {
  const { user } = useContext(AuthContext)
  const { cartItems } = useContext(CartContext) || { cartItems: [] }
  const { unreadCount: chatUnreadCount, clearNotifications } = useChatNotifications()
  const navigate = useNavigate()
  const [showCatSheet, setShowCatSheet] = useState(false)

  // If user taps protected link and isn't authenticated, open auth modal
  const handleProtectedClick = (path) => (e) => {
    if (!user) {
      e.preventDefault()
      onOpenAuth && onOpenAuth('login')
      return
    }
    navigate(path)
  }

  // Hide on larger screens; fixed at bottom on mobile
  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-[60]"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Bottom Navigation"
    >
      {/* Bar background */}
      <div className="relative mx-auto w-100">
        <div className="rounded-t-2xl border border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/50 shadow-[0_10px_30px_rgba(2,6,23,0.08)]">
          <div className={`grid grid-cols-5 text-[11px] font-medium text-slate-700`}>
            {/* Home */}
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-3 rounded-3xl transition-colors ${
                  isActive ? 'text-slate-900' : 'hover:text-slate-900'
                }`
              }
            >
              <HomeIcon className="h-6 w-6 drop-shadow-sm" />
              <span className="mt-0.5">Home</span>
            </NavLink>

            {/* Categories Picker */}
            <button
              type="button"
              onClick={() => setShowCatSheet((v) => !v)}
              className="relative flex flex-col items-center justify-center py-3 rounded-3xl hover:text-slate-900 transition-colors"
            >
              <Squares2X2Icon className="h-6 w-6 drop-shadow-sm" />
              <span className="mt-0.5 flex items-center gap-0.5">Categories</span>
              <ChevronUpDownIcon className="h-3 w-3 absolute -bottom-1.5 text-slate-500" />
            </button>

            {/* Center spacer to keep items clear of the Cart FAB */}
            <div aria-hidden className="opacity-0 pointer-events-none select-none" />

            {/* Right-side items depend on auth */}
            {user ? (
              <>
                {/* Chat (protected) */}
                <a
                  href="/chat"
                  onClick={(e) => {
                    handleProtectedClick('/chat')(e)
                    if (user) clearNotifications()
                  }}
                  className="relative flex flex-col items-center justify-center py-3 rounded-3xl hover:text-slate-900 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="h-6 w-6 drop-shadow-sm" />
                  <span className="mt-0.5">Chat</span>
                  {chatUnreadCount > 0 && (
                    <span className="absolute top-1 right-6 min-w-4 h-4 px-1 rounded-full bg-red-500 text-[10px] font-bold leading-4 text-white text-center shadow">
                      {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
                    </span>
                  )}
                </a>

                {/* Profile (protected) */}
                <a
                  href="/profile"
                  onClick={handleProtectedClick('/profile')}
                  className="flex flex-col items-center justify-center py-3 rounded-3xl hover:text-slate-900 transition-colors"
                >
                  <UserIcon className="h-6 w-6 drop-shadow-sm" />
                  <span className="mt-0.5">Profile</span>
                </a>
              </>
            ) : (
              // Show login icon when not logged in
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="flex flex-col items-center justify-center py-3 rounded-3xl hover:text-slate-900 transition-colors"
              >
                <LockClosedIcon className="h-6 w-6 drop-shadow-sm" />
                <span className="mt-0.5">Login</span>
              </button>
            )}
            {/* Contact Support visible when logged out */}
            {!user && (
              <NavLink
                to="/contact-support"
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center py-3 rounded-3xl transition-colors ${
                    isActive ? 'text-slate-900' : 'hover:text-slate-900'
                  }`
                }
              >
                <LifebuoyIcon className="h-6 w-6 drop-shadow-sm" />
                <span className="mt-0.5">Support</span>
              </NavLink>
            )}
          </div>
        </div>

        {/* Center Floating Cart Button */}
        <div className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="pointer-events-auto relative">
            <NavLink
              to="/cart"
              className="group block"
              aria-label="Open cart"
            >
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-2xl ring-2 ring-white">
                <ShoppingCartIcon className="h-8 w-8 drop-shadow-sm" />
                {cartItems?.length > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-[10px] font-bold leading-5 text-white text-center shadow">
                    {cartItems.length > 99 ? '99+' : cartItems.length}
                  </span>
                )}
              </div>
            </NavLink>
          </div>
        </div>

        {/* Categories Action Sheet */}
        {showCatSheet && (
          <div className="absolute bottom-20 left-0 right-0 px-6" onClick={() => setShowCatSheet(false)}>
            <div
              className="mx-auto max-w-screen-sm rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="divide-y divide-slate-200">
                {[
                  { key: 'men', label: 'Men', path: '/men' },
                  { key: 'women', label: 'Women', path: '/women' },
                  { key: 'kids', label: 'Kids', path: '/kids' }
                ].map((c) => (
                  <button
                    key={c.key}
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 text-slate-700"
                    onClick={() => {
                      setShowCatSheet(false)
                      navigate(c.path)
                    }}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default BottomNav
