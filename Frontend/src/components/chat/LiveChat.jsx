import { useState, useEffect, useRef, useContext } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import { AuthContext } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { useChatNotifications } from '../../context/ChatNotificationContext'
import { getUserChat, sendMessage } from '../../services/chatService'
import { useSocket } from '../../hooks/useSocket'

const LiveChat = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const { clearNotifications, unreadCount: chatUnreadCount } = useChatNotifications()
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadChatData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const chatData = await getUserChat()
        setChat(chatData)
        setMessages(chatData.messages || [])
        setConnected(true)
      } catch (err) {
        console.error('Failed to load chat:', err)
        showToast('Failed to load chat', 'error')
      } finally {
        setLoading(false)
      }
    }

    if (user && isOpen) {
      loadChatData()
    }
  }, [user, isOpen, showToast])

  // Real-time chat updates with user context
  useSocket({
    'chat:message': (data) => {
      console.log('📨 Received real-time message:', data);
      if (data.userId === user?._id) {
        setMessages(prev => {
          // Skip if this is a user message and we already have an optimistic version
          if (data.message.sender === 'user') {
            const hasOptimistic = prev.some(msg => 
              msg.isOptimistic && 
              msg.message === data.message.message &&
              Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 10000
            );
            
            if (hasOptimistic) {
              console.log('🔄 Replacing optimistic user message with real one in LiveChat');
              return prev.map(msg => 
                msg.isOptimistic && msg.message === data.message.message
                  ? { ...data.message, isOptimistic: false }
                  : msg
              );
            }
          }
          
          // Enhanced duplicate prevention
          const messageExists = prev.some(msg => 
            msg.messageId === data.message.messageId ||
            (msg.message === data.message.message && 
             msg.sender === data.message.sender &&
             Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 5000)
          );
          
          if (!messageExists) {
            console.log('➕ Adding new message to LiveChat');
            return [...prev, data.message];
          } else {
            console.log('⚠️ Message already exists in LiveChat, skipping duplicate');
            return prev;
          }
        });
        
        // Update unread count
        setChat(prev => prev ? { 
          ...prev, 
          unreadCount: data.unreadCount 
        } : null);
        
        // Show notification only if chat is closed and it's from admin (reduced notification spam)
        if (!isOpen && data.message.sender === 'admin') {
          // Only show toast if widget is closed to avoid spam
          console.log('📢 Admin message received while chat closed');
        }
      }
    },
    'chat:update': (data) => {
      console.log('📝 Received chat update:', data);
      if (data.userId === user?._id) {
        setChat(prev => prev ? { ...prev, ...data } : null);
      }
    },
    'connect': () => {
      console.log('🔌 Socket connected in LiveChat');
      setConnected(true);
    },
    'disconnect': () => {
      console.log('❌ Socket disconnected in LiveChat');
      setConnected(false);
    }
  }, user)

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending) return
    
    const messageText = newMessage.trim()
    const tempMessageId = Date.now().toString()
    
    try {
      setSending(true)
      setNewMessage('')
      
      // Optimistic update with flag
      const tempMessage = {
        sender: 'user',
        senderName: user.name,
        message: messageText,
        timestamp: new Date(),
        isRead: false,
        messageId: tempMessageId,
        isOptimistic: true // Flag to identify optimistic messages
      }
      
      setMessages(prev => [...prev, tempMessage])
      
      // Send to server
      const response = await sendMessage(messageText)
      
      // Replace optimistic message with server response
      setMessages(prev => 
        prev.map(msg => 
          msg.messageId === tempMessageId 
            ? { ...response.newMessage, isOptimistic: false }
            : msg
        )
      )
      
      setChat(response.chat)
      // Removed any success toast notifications
    } catch (err) {
      console.error('Failed to send message:', err)
      showToast('Failed to send message', 'error')
      
      // Remove optimistic message on error and restore text
      setMessages(prev => prev.filter(msg => msg.messageId !== tempMessageId))
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))
    
    if (diffMinutes < 1) return 'Just now'
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h ago`
    
    return date.toLocaleDateString()
  }

  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      // Clear notifications when opening chat
      clearNotifications()
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  if (!user) {
    return null // Don't show chat for non-logged in users
  }

  return (
    <div className="fixed bottom-20 right-5 z-50">
      {/* Chat Widget */}
      {isOpen && (
        <div className="mb-4 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Live Support</h3>
                <p className="text-sm text-blue-100">
                  {connected ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Online
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Connecting...
                    </span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="text-white hover:bg-white/20 p-1 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="h-96 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600" />
                <span className="ml-2 text-gray-600">Loading chat...</span>
              </div>
            ) : (
              <div className="p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Start a conversation with our support team!</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.messageId || index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border'
                      }`}>
                        {message.sender === 'admin' && (
                          <div className="flex items-center mb-1">
                            <UserCircleIcon className="h-4 w-4 text-gray-500 mr-1" />
                            <span className="text-xs font-medium text-gray-600">
                              {message.senderName}
                            </span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed">{message.message}</p>
                        <div className={`flex items-center justify-end mt-1 text-xs ${
                          message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatTime(message.timestamp)}
                          {message.sender === 'user' && (
                            <CheckCircleIcon className={`h-3 w-3 ml-1 ${
                              message.isRead ? 'text-green-300' : 'text-blue-300'
                            }`} />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={sending || !connected}
              />
              <button
                type="submit"
                disabled={sending || !newMessage.trim() || !connected}
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {sending ? (
                  <ArrowPathIcon className="h-5 w-5 animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="h-5 w-5" />
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Chat Toggle Button */}
      <button
        onClick={toggleChat}
        className={`bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-200 transform relative ${
          isOpen ? 'scale-95' : 'scale-100 hover:scale-105'
        }`}
      >
        <ChatBubbleLeftRightIcon className="h-6 w-6" />
        
        {/* Unread indicator */}
        {chatUnreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center shadow-lg animate-pulse">
            {chatUnreadCount > 9 ? '9+' : chatUnreadCount}
          </span>
        )}
      </button>
    </div>
  )
}

export default LiveChat
