import { useState, useEffect, useRef, useContext } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  HomeIcon
} from '@heroicons/react/24/outline'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { useChatNotifications } from '../context/ChatNotificationContext'
import { getUserChat, sendMessage } from '../services/chatService'
import { useSocket } from '../hooks/useSocket'

const Chat = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const { clearNotifications } = useChatNotifications()
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom of messages container only
  const scrollToBottom = () => {
    setTimeout(() => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
    }, 50)
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Load chat
  useEffect(() => {
    const loadChatData = async () => {
      if (!user) return
      
      try {
        setLoading(true)
        const chatData = await getUserChat()
        setChat(chatData)
        setMessages(chatData.messages || [])
        setConnected(true)
        
        // Clear notifications when user opens chat
        clearNotifications()
        
        setTimeout(() => inputRef.current?.focus(), 100)
      } catch (err) {
        showToast('Failed to load chat', err)
      } finally {
        setLoading(false)
      }
    }

    loadChatData()
  }, [user, showToast, clearNotifications])

  // Real-time chat updates with user context
  useSocket({
    'chat:message': (data) => {
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
              setTimeout(scrollToBottom, 100)
              return prev.map(msg => 
                msg.isOptimistic && msg.message === data.message.message
                  ? { ...data.message, isOptimistic: false }
                  : msg
              );
            }
          }
          // Enhanced duplicate prevention for all messages
          const messageExists = prev.some(msg => 
            msg.messageId === data.message.messageId ||
            (msg.message === data.message.message && 
             msg.sender === data.message.sender &&
             Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 5000)
          );
          if (!messageExists) {
            setTimeout(scrollToBottom, 100)
            return [...prev, data.message];
          } else {
            setTimeout(scrollToBottom, 100)
            return prev;
          }
        });
        // Update unread count
        setChat(prev => prev ? { 
          ...prev, 
          unreadCount: data.unreadCount 
        } : null);
        // Only show notification for admin messages (removed toast spam)
        if (data.message.sender === 'admin') {
          // Removed toast notification to reduce spam
        }
      }
    },
    'chat:update': (data) => {
      
      if (data.userId === user?._id) {
        setChat(prev => prev ? { ...prev, ...data } : null);
      }
    },
    'connect': () => {
     
      setConnected(true);
    },
    'disconnect': () => {
     
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
        isOptimistic: true
      }
      setMessages(prev => {
        const updated = [...prev, tempMessage]
        setTimeout(scrollToBottom, 0)
        return updated
      })
      // Send to server
      const response = await sendMessage(messageText)
      setMessages(prev => {
        const updated = prev.map(msg =>
          msg.messageId === tempMessageId
            ? { ...response.newMessage, isOptimistic: false }
            : msg
        )
        setTimeout(scrollToBottom, 0)
        return updated
      })
      setChat(response.chat)
    } catch (err) {
      showToast('Failed to send message', err )
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-xl p-8">
          <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login</h2>
          <p className="text-gray-600 mb-6">
            You need to be logged in to access the chat feature.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <HomeIcon className="h-5 w-5 mr-2" />
            Go to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-slate-100 flex items-center justify-center py-0 sm:py-0 ">
      <div className="relative w-full max-w-2xl mx-auto">
        {/* Floating Chat Header */}
        <div className="absolute left-0 right-0 -top-8 sm:-top-1 z-10 flex items-center justify-between px-4 py-3 bg-white rounded-2xl shadow-lg border border-slate-200">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 rounded-full p-2">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">Live Support</h1>
              <span className="flex items-center text-xs text-slate-500">
                <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                {connected ? 'Online' : 'Connecting...'}
              </span>
            </div>
          </div>
          <Link
            to="/"
            className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <HomeIcon className="h-5 w-5 " />
            
          </Link>
        </div>

        {/* Chat Card */}
        <div className="pt-16 sm:pt-24 pb-20 sm:pb-24">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col h-[70vh] sm:h-[60vh] overflow-hidden">
            {/* Messages */}
            <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-2 sm:px-6 py-4 bg-gradient-to-br from-blue-50 via-white to-slate-100">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600 text-lg">Loading your conversation...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <div className="bg-blue-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to Live Support!</h3>
                      <p className="text-gray-600 mb-2">
                        Our support team is ready to help you with any questions or concerns.
                      </p>
                      <p className="text-xs text-gray-500">
                        Type your message below to get started.
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={message.messageId || index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                          {message.sender === 'admin' && (
                            <div className="bg-green-500 rounded-full p-1">
                              <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                          )}
                          <div className={`max-w-xs px-4 py-3 rounded-2xl shadow-sm
                            ${message.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-br-md'
                              : 'bg-slate-50 text-slate-900 rounded-bl-md border border-slate-200'
                            }`}
                          >
                            <p className="leading-relaxed break-words">{message.message}</p>
                            <div className={`flex items-center justify-between mt-2 text-xs
                              ${message.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                              <div className="flex items-center">
                                <ClockIcon className="h-3 w-3 mr-1" />
                                {formatTime(message.timestamp)}
                              </div>
                              {message.sender === 'user' && (
                                <CheckCircleIcon className={`h-4 w-4 ${message.isRead ? 'text-green-300' : 'text-blue-300'}`} />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input Bar - now relative, not absolute, so scroll area includes it */}
            <div className="border-t border-slate-200 bg-white px-2 sm:px-6 py-3">
              <form onSubmit={handleSendMessage} className="flex items-end gap-2">
                <div className="flex-1">
                  <textarea
                    ref={inputRef}
                    id="message"
                    rows={2}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sending || !connected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || !connected}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-3 rounded-full shadow-lg hover:scale-105 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all min-w-[48px] flex items-center justify-center"
                >
                  {sending ? (
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-6 w-6" />
                  )}
                </button>
              </form>
              <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
                <div className="flex items-center">
                  <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {connected ? 'Connected to support team' : 'Reconnecting...'}
                </div>
                <span>Chat Status: {chat?.status || 'Active'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
