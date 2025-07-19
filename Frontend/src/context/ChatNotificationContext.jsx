import { createContext, useContext, useState, useEffect } from 'react'
import { AuthContext } from './AuthContext'
import { getUserChat } from '../services/chatService'
import { useSocket } from '../hooks/useSocket'

const ChatNotificationContext = createContext()

export const useChatNotifications = () => {
  const context = useContext(ChatNotificationContext)
  if (!context) {
    throw new Error('useChatNotifications must be used within ChatNotificationProvider')
  }
  return context
}

export const ChatNotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext)
  const [unreadCount, setUnreadCount] = useState(0)
  const [adminUnreadCount, setAdminUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Load initial unread count
  useEffect(() => {
    const loadUnreadCount = async () => {
      if (!user) {
        setUnreadCount(0)
        setAdminUnreadCount(0)
        return
      }

      try {
        setIsLoading(true)
        
        if (user.isAdmin) {
          // For admin users, get total unread messages from all chats
          const { getChatStats } = await import('../services/chatService')
          const statsData = await getChatStats()
          setAdminUnreadCount(statsData?.unreadCount?.totalUnreadAdmin || 0)
        } else {
          // For regular users, get their personal chat unread count
          const chatData = await getUserChat()
          setUnreadCount(chatData?.unreadCount?.user || 0)
        }
      } catch (error) {
        setUnreadCount(0)
        setAdminUnreadCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    loadUnreadCount()
  }, [user])

  // Real-time socket updates for chat notifications
  useSocket({
    'chat:message': (data) => {
      if (user?.isAdmin) {
        // Admin receives notification for any user message
        if (data.message.sender === 'user') {
          setAdminUnreadCount(prev => prev + 1)
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New customer message', {
              body: `${data.message.senderName}: ${data.message.message.substring(0, 100)}...`,
              icon: '/vite.svg',
              badge: '/vite.svg'
            })
          }
        }
      } else {
        // Regular user receives notification only for their messages from admin
        if (data.userId === user?._id && data.message.sender === 'admin') {
          setUnreadCount(data.unreadCount?.user || 0)
          
          // Show browser notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('New message from support', {
              body: data.message.message.substring(0, 100) + '...',
              icon: '/vite.svg',
              badge: '/vite.svg'
            })
          }
        }
      }
    },
    'chat:update': (data) => {
      if (user?.isAdmin) {
        // Admin might need to update counts based on chat updates
        if (data.unreadCount) {
          // This is a simplified approach - in production you might want to refetch stats
          setAdminUnreadCount(prev => Math.max(0, prev))
        }
      } else if (data.userId === user?._id && data.unreadCount) {
        setUnreadCount(data.unreadCount.user || 0)
      }
    }
  }, user)

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  // Clear notifications when user visits chat
  const clearNotifications = () => {
    if (user?.isAdmin) {
      setAdminUnreadCount(0)
    } else {
      setUnreadCount(0)
    }
  }

  // Manually update unread count (for when user reads messages)
  const updateUnreadCount = (count) => {
    if (user?.isAdmin) {
      setAdminUnreadCount(count)
    } else {
      setUnreadCount(count)
    }
  }

  const value = {
    unreadCount: user?.isAdmin ? adminUnreadCount : unreadCount,
    adminUnreadCount,
    userUnreadCount: unreadCount,
    isLoading,
    clearNotifications,
    updateUnreadCount
  }

  return (
    <ChatNotificationContext.Provider value={value}>
      {children}
    </ChatNotificationContext.Provider>
  )
}
