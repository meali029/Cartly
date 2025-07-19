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
  const inputRef = useRef(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
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
            
            return [...prev, data.message];
          } else {
          
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
      // Removed success toast notification
    } catch (err) {
      
      showToast('Failed to send message', err )
      
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-600 to-gray-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChatBubbleLeftRightIcon className="h-12 w-12" />
              <div>
                <h1 className="text-3xl font-bold">Live Support Chat</h1>
                <p className="text-blue-100 mt-1">
                  {connected ? (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                      Connected - Our team is here to help
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-red-400 rounded-full mr-2"></span>
                      Connecting to support...
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              <HomeIcon className="h-5 w-5 mr-2" />
              Home
            </Link>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            
            {/* Chat Messages Area */}
            <div className="h-96 lg:h-[500px] overflow-y-auto bg-gray-50 p-6">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
                  <span className="ml-2 text-gray-600 text-lg">Loading your conversation...</span>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                        <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Live Support!</h3>
                      <p className="text-gray-600 mb-4">
                        Our support team is ready to help you with any questions or concerns.
                      </p>
                      <p className="text-sm text-gray-500">
                        Type your message below to get started.
                      </p>
                    </div>
                  ) : (
                    messages.map((message, index) => (
                      <div
                        key={message.messageId || index}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-xs lg:max-w-2xl px-6 py-4 rounded-2xl shadow-sm ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white rounded-br-md'
                            : 'bg-white text-gray-900 rounded-bl-md border border-gray-200'
                        }`}>
                          {message.sender === 'admin' && (
                            <div className="flex items-center mb-2">
                              <div className="bg-green-500 rounded-full p-1 mr-2">
                                <UserCircleIcon className="h-4 w-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-gray-600">
                                {message.senderName} (Support Team)
                              </span>
                            </div>
                          )}
                          <p className="leading-relaxed">{message.message}</p>
                          <div className={`flex items-center justify-between mt-3 text-xs ${
                            message.sender === 'user' ? 'text-blue-200' : 'text-gray-500'
                          }`}>
                            <div className="flex items-center">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              {formatTime(message.timestamp)}
                            </div>
                            {message.sender === 'user' && (
                              <CheckCircleIcon className={`h-4 w-4 ${
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

            {/* Message Input Area */}
            <div className="border-t border-gray-200 bg-white p-6">
              <form onSubmit={handleSendMessage} className="flex items-end space-x-4">
                <div className="flex-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Message
                  </label>
                  <textarea
                    ref={inputRef}
                    id="message"
                    rows={3}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sending || !connected}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Press Enter to send, Shift+Enter for new line
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || !connected}
                  className="bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors min-w-[60px] flex items-center justify-center"
                >
                  {sending ? (
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-6 w-6" />
                  )}
                </button>
              </form>
              
              {/* Status Indicator */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      connected ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    {connected ? 'Connected to support team' : 'Reconnecting...'}
                  </div>
                  <div className="text-gray-500">
                    Chat Status: {chat?.status || 'Active'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Help Information */}
          <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-5 w-5 text-blue-500 mr-2" />
                <div>
                  <div className="font-medium">Response Time</div>
                  <div>Usually within 5 minutes</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <div className="font-medium">Available 24/7</div>
                  <div>We're always here to help</div>
                </div>
              </div>
              <div className="flex items-center text-gray-600">
                <UserCircleIcon className="h-5 w-5 text-purple-500 mr-2" />
                <div>
                  <div className="font-medium">Expert Support</div>
                  <div>Trained customer service</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
