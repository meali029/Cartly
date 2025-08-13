import { useState, useEffect, useRef, useContext, useMemo } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  ClockIcon,
  XCircleIcon,
  EyeIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ArrowPathIcon,
  UserCircleIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { AuthContext } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { 
  getAllChats, 
  getChatById, 
  updateChatStatus, 
  deleteChat,
  sendAdminMessage 
} from '../services/chatService'
import { useSocket } from '../hooks/useSocket'

const ManageChats = () => {
  const { user } = useContext(AuthContext)
  const { showToast } = useToast()
  const [chats, setChats] = useState([])
  // const [stats, setStats] = useState({}) // removed in simplified view
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedChatMessages, setSelectedChatMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  // const [connected, setConnected] = useState(false) // not used in simplified view
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1,
    showUnreadOnly: false
  })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll to bottom with debounce
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest',
        inline: 'nearest'
      })
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(scrollToBottom, 100)
    return () => clearTimeout(timeoutId)
  }, [selectedChatMessages])

    // Load data
    useEffect(() => {
      const loadChatsData = async () => {
        try {
          setLoading(true)
          // Use cached result within TTL to reduce server load
          const chatsData = await getAllChats(filters.status, filters.page, 20)
          setChats(chatsData.chats)
        } catch (err) {
          showToast('Failed to load chats', err)
        } finally {
          setLoading(false)
        }
      }

      loadChatsData()
    }, [filters.status, filters.page, showToast])

  const loadChats = async () => {
    try {
      setLoading(true)
  const chatsData = await getAllChats(filters.status, filters.page, 20, { force: true })
  setChats(chatsData.chats)
    } catch (err) {
      console.error('Failed to load chats:', err)
      showToast('Failed to load chats', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Load specific chat
  const loadChat = async (chatId) => {
    try {
      setChatLoading(true)
      const chatData = await getChatById(chatId)
      setSelectedChat(chatData)
      setSelectedChatMessages(chatData.messages || [])
      setTimeout(() => inputRef.current?.focus(), 100)
  setIsChatOpen(true)
    } catch (err) {
      console.error('Failed to load chat:', err)
      showToast('Failed to load chat', 'error')
    } finally {
      setChatLoading(false)
    }
  }

  // Real-time updates with admin context
  const socket = useSocket({
    'chat:message': (data) => {
      console.log('📨 Admin received real-time message:', data);
      
      // Update chat list
      setChats(prev => prev.map(chat => 
        chat._id === data.chatId 
          ? { ...chat, lastActivity: new Date(), unreadCount: data.unreadCount }
          : chat
      ))
      
      // Update selected chat if viewing
      if (selectedChat && selectedChat._id === data.chatId) {
        setSelectedChatMessages(prev => {
          // Skip if this is an admin message and we already have an optimistic version
          if (data.message.sender === 'admin') {
            const hasOptimistic = prev.some(msg => 
              msg.isOptimistic && 
              msg.message === data.message.message &&
              Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 10000 // Within 10 seconds
            );
            
            if (hasOptimistic) {
              console.log('🔄 Replacing optimistic admin message with real one');
              // Replace optimistic message with real one
              return prev.map(msg => 
                msg.isOptimistic && msg.message === data.message.message
                  ? { ...data.message, isOptimistic: false }
                  : msg
              );
            }
          }
          
          // For user messages or admin messages without optimistic versions
          const messageExists = prev.some(msg => 
            msg.messageId === data.message.messageId ||
            (msg.message === data.message.message && 
             msg.sender === data.message.sender &&
             Math.abs(new Date(msg.timestamp) - new Date(data.message.timestamp)) < 5000)
          );
          
          if (!messageExists) {
            console.log('➕ Adding new message to selected chat');
            return [...prev, data.message];
          } else {
            console.log('⚠️ Message already exists, skipping duplicate');
            return prev;
          }
        });
      }
      
      // Show notification only for user messages
      if ((!selectedChat || selectedChat._id !== data.chatId) && data.message.sender === 'user') {
        showToast(`New message from ${data.message.senderName}`, 'info');
      }
      
      // Note: Removed automatic stats refreshing to prevent unwanted refreshes
    },
    'chat:update': (data) => {
      console.log('📝 Admin received chat update:', data);
      setChats(prev => prev.map(chat => 
        chat._id === data.chatId 
          ? { ...chat, ...data }
          : chat
      ))
      
      if (selectedChat && selectedChat._id === data.chatId) {
        setSelectedChat(prev => ({ ...prev, ...data }))
      }
    },
    'connect': () => {
      console.log('🔌 Admin socket connected - joining admin room');
    },
    'disconnect': () => {
      console.log('❌ Admin socket disconnected');
    }
  }, user)

  // Join admin room when socket connects
  useEffect(() => {
    if (socket && user?.isAdmin) {
      socket.emit('join-admin-room');
      console.log('👨‍💼 Joined admin room');
    }
  }, [socket, user])

  // Send message as admin
  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!newMessage.trim() || sending || !selectedChat) return
    
    const messageText = newMessage.trim()
    const tempMessageId = Date.now().toString()
    
    try {
      setSending(true)
      setNewMessage('')
      
      // Optimistic update
      const tempMessage = {
        sender: 'admin',
        senderName: 'Admin',
        message: messageText,
        timestamp: new Date(),
        isRead: false,
        messageId: tempMessageId,
        isOptimistic: true // Flag to identify optimistic messages
      }
      
      setSelectedChatMessages(prev => [...prev, tempMessage])
      
      // Send to server
      const response = await sendAdminMessage(selectedChat.userId._id, messageText)
      
      // Replace optimistic message with real message from server
      setSelectedChatMessages(prev => 
        prev.map(msg => 
          msg.messageId === tempMessageId 
            ? { ...response.newMessage, isOptimistic: false }
            : msg
        )
      )
      
      // Removed the success toast notification
    } catch (err) {
      console.error('Failed to send message:', err)
      showToast('Failed to send message', 'error')
      setNewMessage(messageText)
      
      // Remove optimistic message on error
      setSelectedChatMessages(prev => 
        prev.filter(msg => msg.messageId !== tempMessageId)
      )
    } finally {
      setSending(false)
    }
  }

  // Update chat status
  const handleUpdateStatus = async (chatId, status) => {
    try {
      await updateChatStatus(chatId, { status })
      showToast(`Chat ${status} successfully`, 'success')
      // Removed loadChats() - real-time updates will handle UI changes
      
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(prev => ({ ...prev, status }))
      }
    } catch (err) {
      console.error('Failed to update chat:', err)
      showToast('Failed to update chat', 'error')
    }
  }

  // Delete chat
  const handleDeleteChat = async (chatId) => {
    if (!confirm('Are you sure you want to delete this chat?')) return
    
    try {
      await deleteChat(chatId)
      showToast('Chat deleted successfully', 'success')
      // Removed loadChats() - real-time updates will handle UI changes
      
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(null)
        setSelectedChatMessages([])
  setIsChatOpen(false)
      }
    } catch (err) {
      console.error('Failed to delete chat:', err)
      showToast('Failed to delete chat', 'error')
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

  // Status badge component
  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Filtered chats (client-side search)
  const filteredChats = useMemo(() => {
    const term = filters.search.trim().toLowerCase()
    const byStatus = (c) => filters.status === 'all' ? true : c.status === filters.status
    const byUnread = (c) => !filters.showUnreadOnly ? true : (c.unreadCount?.admin || 0) > 0
    if (!term) return chats.filter(c => byStatus(c) && byUnread(c))
    return chats.filter(c => {
      if (!byStatus(c)) return false
      if (!byUnread(c)) return false
      const name = c.userId?.name?.toLowerCase() || ''
      const email = c.userId?.email?.toLowerCase() || ''
      return name.includes(term) || email.includes(term)
    })
  }, [chats, filters.status, filters.search, filters.showUnreadOnly])

  // Removed copy transcript as requested

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading chats...</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Chats</h1>
          <p className="text-gray-600 mt-1 text-sm">View and manage chats in a single view</p>
        </div>
        <button
          onClick={loadChats}
          className="flex items-center px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
        >
          <ArrowPathIcon className="h-5 w-5 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={filters.showUnreadOnly}
              onChange={(e) => setFilters(prev => ({ ...prev, showUnreadOnly: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Unread only
          </label>
          <div className="relative w-full sm:w-80">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Chats list */}
      <div className="grid grid-cols-1 gap-3">
        {filteredChats.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-8 text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <div className="text-gray-600">No conversations found</div>
          </div>
        ) : (
          filteredChats.map(chat => (
            <div key={chat._id} className="bg-white rounded-xl shadow-sm border p-3 sm:p-4 flex items-start justify-between">
              <div className="flex items-start gap-3 min-w-0">
                <UserCircleIcon className="h-10 w-10 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold text-gray-900 truncate max-w-[200px] sm:max-w-[260px]">
                      {chat.userId?.name || 'Unknown User'}
                    </div>
                    <StatusBadge status={chat.status} />
                    {chat.unreadCount?.admin > 0 && (
                      <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {chat.unreadCount.admin > 9 ? '9+' : chat.unreadCount.admin}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[260px]">{chat.userId?.email || 'No email'}</div>
                  <div className="text-xs text-gray-500 mt-1">Last activity: {formatTime(chat.lastActivity)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {chat.status === 'active' ? (
                  <button
                    onClick={() => handleUpdateStatus(chat._id, 'closed')}
                    className="inline-flex items-center px-2 py-1 border border-red-200 rounded-md text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100"
                    title="Close chat"
                  >
                    Close
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(chat._id, 'active')}
                    className="inline-flex items-center px-2 py-1 border border-green-200 rounded-md text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100"
                    title="Reopen chat"
                  >
                    Reopen
                  </button>
                )}
                <button
                  onClick={() => loadChat(chat._id)}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-1" />
                  Open
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Chat modal */}
      {isChatOpen && selectedChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsChatOpen(false)} />
          <div className="relative bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="px-4 sm:px-5 py-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <UserCircleIcon className="h-8 w-8 text-gray-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="font-semibold text-gray-900 truncate">{selectedChat.userId?.name}</div>
                  <div className="text-xs text-gray-600 truncate">{selectedChat.userId?.email}</div>
                </div>
                <StatusBadge status={selectedChat.status} />
              </div>
              <div className="flex items-center gap-2">
                {selectedChat.status === 'active' ? (
                  <button
                    onClick={() => handleUpdateStatus(selectedChat._id, 'closed')}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs sm:text-sm hover:bg-red-200"
                  >
                    Close Chat
                  </button>
                ) : (
                  <button
                    onClick={() => handleUpdateStatus(selectedChat._id, 'active')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs sm:text-sm hover:bg-green-200"
                  >
                    Reopen Chat
                  </button>
                )}
                <button
                  onClick={() => handleDeleteChat(selectedChat._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg"
                >
                  <XCircleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="h-[60vh] sm:h-[70vh] flex flex-col">
              <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 sm:space-y-3">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600 text-sm">Loading messages...</span>
                  </div>
                ) : selectedChatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No messages yet</p>
                  </div>
                ) : (
                  selectedChatMessages.map((message, index) => (
                    <div
                      key={message.messageId || index}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85vw] sm:max-w-md px-3 sm:px-4 py-2 rounded-2xl ${
                        message.sender === 'admin'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                      }`}>
                        <div className="flex items-center mb-1">
                          <UserCircleIcon className="h-4 w-4 mr-1" />
                          <span className={`text-xs font-medium ${
                            message.sender === 'admin' ? 'text-blue-200' : 'text-gray-600'
                          }`}>
                            {message.senderName}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm leading-relaxed">{message.message}</p>
                        <div className={`flex items-center justify-end mt-1 text-xs ${
                          message.sender === 'admin' ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          <ClockIcon className="h-3 w-3 mr-1" />
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
              <div className="p-2 sm:p-3 border-t flex items-center gap-2">
                <form onSubmit={handleSendMessage} className="flex-1 flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder={selectedChat.status === 'closed' ? 'Chat is closed' : 'Type your response...'}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    disabled={sending || selectedChat.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim() || selectedChat.status === 'closed'}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
          </div>
        </div>
      )}
    </div>
  )
}

export default ManageChats
