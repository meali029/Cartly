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
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [showQuickMessages, setShowQuickMessages] = useState(true)

  

  // Predefined quick messages with responses
  const quickMessages = [
    {
      id: 'order-status',
      text: '📦 Check my order status',
      userMessage: 'Hi! I want to check my order status',
      response: 'I\'d be happy to help you check your order status! You can view your orders by going to "My Orders" in your account, or I can help you track a specific order. Do you have an order number you\'d like me to look up? 📋'
    },
    {
      id: 'shipping-info',
      text: '🚚 Shipping and delivery info',
      userMessage: 'I need information about shipping and delivery',
      response: 'Here\'s our shipping information:\n\n• Free delivery on orders above PKR 5,000\n• Standard delivery: 3-5 business days\n• Express delivery: 1-2 business days\n• Cash on delivery available\n\nIs there something specific about shipping you\'d like to know? 🚛'
    }
  ]
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
       
        setMessages(chatData.messages || [])
        setConnected(true)
        
        // Show quick messages if chat is empty
        if (!chatData.messages || chatData.messages.length === 0) {
          setShowQuickMessages(true)
        } else {
          setShowQuickMessages(false)
        }
        
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
        // Update unread count and last seen
        
        
        // Stop typing indicator when message is received
        if (data.message.sender === 'admin') {
          setIsTyping(false);
        }
      }
    },
    'chat:typing': (data) => {
      if (data.userId === user?._id && data.sender === 'admin') {
        setIsTyping(data.isTyping);
        if (data.isTyping) {
          // Auto-hide typing indicator after 5 seconds
          setTimeout(() => setIsTyping(false), 5000);
        }
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
      setShowQuickMessages(false) // Hide quick messages after sending
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
    } catch (err) {
      showToast('Failed to send message', err )
      setMessages(prev => prev.filter(msg => msg.messageId !== tempMessageId))
      setNewMessage(messageText)
    } finally {
      setSending(false)
    }
  }

  // Handle quick message selection
  const handleQuickMessage = async (quickMsg) => {
    const userMessageId = Date.now().toString()
    const adminMessageId = (Date.now() + 1).toString()
    
    try {
      setSending(true)
      setShowQuickMessages(false)
      
      // Add user message
      const userMessage = {
        sender: 'user',
        senderName: user.name,
        message: quickMsg.userMessage,
        timestamp: new Date(),
        isRead: false,
        messageId: userMessageId,
        isOptimistic: false
      }
      
      setMessages(prev => {
        const updated = [...prev, userMessage]
        setTimeout(scrollToBottom, 100)
        return updated
      })
      
      // Show typing indicator
      setIsTyping(true)
      
      // Simulate admin response delay
      setTimeout(() => {
        setIsTyping(false)
        
        const adminMessage = {
          sender: 'admin',
          senderName: 'Support Team',
          message: quickMsg.response,
          timestamp: new Date(),
          isRead: false,
          messageId: adminMessageId,
          isOptimistic: false
        }
        
        setMessages(prev => {
          const updated = [...prev, adminMessage]
          setTimeout(scrollToBottom, 100)
          return updated
        })
      }, 1500) // 1.5 second delay for realistic response
      
    } catch (err) {
      showToast('Failed to send message', err)
    } finally {
      setSending(false)
    }
  }

  // Format timestamp with more detailed information
  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffMinutes = Math.floor((now - date) / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)
    
    // For very recent messages (less than 1 minute)
    if (diffMinutes < 1) return 'Just now'
    
    // For messages within an hour
    if (diffMinutes < 60) return `${diffMinutes}m ago`
    
    // For messages within 24 hours
    if (diffHours < 24) return `${diffHours}h ago`
    
    // For messages within a week
    if (diffDays < 7) return `${diffDays}d ago`
    
    // For older messages, show actual date
    return date.toLocaleDateString('en-PK', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Format detailed timestamp for tooltips
  const formatDetailedTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-gray-50 to-slate-200">
      <div className="container mx-auto px-3 md:px-4 pt-2 md:pt-6 pb-24 md:pb-6 max-w-4xl">
        {/* Professional Chat Header */}
        <div className="bg-white rounded-t-2xl shadow-lg border border-slate-200 p-4 md:p-6 sticky top-12 md:static z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-full p-3 shadow-lg">
                  <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                </div>
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Customer Support</h1>
              
              </div>
            </div>
            <div className="flex items-center gap-3">
           
              <Link
                to="/"
                className="flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <HomeIcon className="h-5 w-5 m-2" />
               
              </Link>
            </div>
          </div>
        </div>

        {/* Chat Messages Container */}
        <div className="bg-white shadow-lg border-l border-r border-slate-200 flex flex-col md:h-[70vh]">
          {/* Messages Area */}
          <div ref={messagesContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 pb-28 bg-gradient-to-b from-slate-50 to-white">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-blue-100 rounded-full p-4 mb-4 animate-pulse">
                  <ArrowPathIcon className="h-12 w-12 text-blue-600 animate-spin" />
                </div>
                <span className="text-slate-600 text-lg font-medium">Loading your conversation...</span>
                <span className="text-slate-500 text-sm mt-2">Please wait while we connect you to support</span>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-full p-6 w-20 h-20 mx-auto mb-6 flex items-center justify-center shadow-lg">
                      <ChatBubbleLeftRightIcon className="h-10 w-10 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">Welcome to Cartly Support!</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto leading-relaxed">
                      Our dedicated support team is here to help you. Choose a topic below to get started quickly, or type your own message.
                    </p>
                    
                    {/* Quick Message Options */}
                    {showQuickMessages && (
                      <div className="space-y-3 max-w-lg mx-auto">
                        <h4 className="text-sm font-semibold text-slate-700 mb-4">Quick Help Options:</h4>
                        {quickMessages.map((quickMsg) => (
                          <button
                            key={quickMsg.id}
                            onClick={() => handleQuickMessage(quickMsg)}
                            disabled={sending}
                            className="w-full p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left group shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-slate-800 font-medium group-hover:text-blue-700">
                                {quickMsg.text}
                              </span>
                              <div className="text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                →
                              </div>
                            </div>
                          </button>
                        ))}
                        
                        <div className="mt-6 pt-4 border-t border-slate-200">
                          <p className="text-sm text-slate-500 mb-2">Or start typing your own message below...</p>
                          <div className="flex items-center justify-center space-x-2 text-xs text-slate-400">
                            <span>💬 Custom message</span>
                            <span>•</span>
                            <span>⚡ Instant response</span>
                            <span>•</span>
                            <span>🔒 Secure chat</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={message.messageId || index}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} group`}
                    >
                      <div className={`flex items-end gap-3 max-w-[75%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        {message.sender === 'admin' && (
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 shadow-lg">
                              <UserCircleIcon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                        )}
                        <div className={`relative px-5 py-3 rounded-2xl shadow-sm transition-all duration-200 group-hover:shadow-md
                          ${message.sender === 'user'
                            ? 'bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-br-md shadow-lg'
                            : 'bg-white text-slate-900 rounded-bl-md border border-slate-200 shadow-sm'
                          }`}
                        >
                          {message.sender === 'admin' && (
                            <div className="text-xs font-semibold text-green-600 mb-1">Support Team</div>
                          )}
                          <p className="leading-relaxed break-words">{message.message}</p>
                          <div className={`flex items-center justify-between mt-3 text-xs
                            ${message.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                            <div className="flex items-center" title={formatDetailedTime(message.timestamp)}>
                              <ClockIcon className="h-3 w-3 mr-1" />
                              <span className="mr-2">{formatTime(message.timestamp)}</span>
                              <span className="opacity-75">
                                • Sent {new Date(message.timestamp).toLocaleTimeString('en-PK', { 
                                  hour: '2-digit', 
                                  minute: '2-digit' 
                                })}
                              </span>
                            </div>
                            {message.sender === 'user' && (
                              <div className="flex items-center ml-3">
                                <CheckCircleIcon className={`h-4 w-4 ${message.isRead ? 'text-green-300' : 'text-blue-300'}`} />
                                <span className="ml-1 text-xs">
                                  {message.isRead ? 'Read' : message.isOptimistic ? 'Sending...' : 'Delivered'}
                                </span>
                              </div>
                            )}
                          </div>
                          {message.isOptimistic && (
                            <div className="absolute -bottom-1 -right-1">
                              <ArrowPathIcon className="h-3 w-3 animate-spin text-blue-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex justify-start group">
                    <div className="flex items-end gap-3 max-w-[75%]">
                      <div className="flex-shrink-0">
                        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-full p-2 shadow-lg">
                          <UserCircleIcon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="bg-white text-slate-900 rounded-2xl rounded-bl-md border border-slate-200 shadow-sm px-5 py-3">
                        <div className="text-xs font-semibold text-green-600 mb-1">Support Team</div>
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                          <span className="text-xs text-slate-500 ml-2">typing...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Professional Input Area */}
          <div className="border-t border-slate-200 bg-white p-4 md:p-6">
            {/* Quick Messages Toggle - Show when there are existing messages */}
            {messages.length > 0 && (
              <div className="mb-4">
                <button
                  onClick={() => setShowQuickMessages(!showQuickMessages)}
                  className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <span>{showQuickMessages ? '🔽' : '🔼'}</span>
                  <span>{showQuickMessages ? 'Hide' : 'Show'} Quick Help Options</span>
                </button>
                
                {showQuickMessages && (
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {quickMessages.map((quickMsg) => (
                      <button
                        key={quickMsg.id}
                        onClick={() => handleQuickMessage(quickMsg)}
                        disabled={sending}
                        className="p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span className="text-slate-700 hover:text-blue-700">
                          {quickMsg.text}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div className="flex items-end gap-4">
                <div className="flex-1">
                  <label htmlFor="message" className="sr-only">Type your message</label>
                  <div className="relative">
                    <textarea
                      ref={inputRef}
                      id="message"
                      rows={2}
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                      disabled={sending || !connected}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          handleSendMessage(e)
                        }
                      }}
                    />
                    <div className="absolute bottom-2 right-2 text-xs text-slate-400">
                      Press Enter to send
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim() || !connected}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-xl shadow-lg hover:shadow-xl disabled:bg-slate-300 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 min-w-[60px] flex items-center justify-center"
                >
                  {sending ? (
                    <ArrowPathIcon className="h-6 w-6 animate-spin" />
                  ) : (
                    <PaperAirplaneIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
              
              {/* Status Bar */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center text-slate-600">
                  <span className={`w-2 h-2 rounded-full mr-2 ${connected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                  {connected ? (
                    <span className="flex items-center">
                      <span>Connected to support team</span>
                      <span className="mx-2">•</span>
                      <span className="text-green-600 font-medium">Online</span>
                     
                    </span>
                  ) : (
                    <span className="text-orange-600">Reconnecting to support...</span>
                  )}
                </div>
                <div className="flex items-center text-slate-500">
                 
                
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Professional Footer */}
        <div className="bg-slate-50 rounded-b-2xl shadow-lg border border-slate-200 border-t-0 p-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-4">
              <span>🔒 Secure & Private</span>
              <span>⚡ Real-time Support</span>
              <span>📱 Mobile Optimized</span>
              
            </div>
            <div className="text-right">
              <div className="font-medium">Need immediate help?</div>
              <div className="text-xs">
                Our team typically responds within 2 minutes
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
