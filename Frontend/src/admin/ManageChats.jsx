import { useState, useEffect, useRef, useContext } from 'react'
import { 
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ClockIcon,
  CheckBadgeIcon,
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
  getChatStats, 
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
  const [stats, setStats] = useState({})
  const [selectedChat, setSelectedChat] = useState(null)
  const [selectedChatMessages, setSelectedChatMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [chatLoading, setChatLoading] = useState(false)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    page: 1
  })
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
        const [chatsData, statsData] = await Promise.all([
          getAllChats(filters.status, filters.page),
          getChatStats()
        ])
        setChats(chatsData.chats)
        setStats(statsData)
      } catch (err) {
        console.error('Failed to load chats:', err)
        showToast('Failed to load chats', 'error')
      } finally {
        setLoading(false)
      }
    }

    loadChatsData()
  }, [filters.status, filters.page, showToast])

  const loadChats = async () => {
    try {
      setLoading(true)
      const [chatsData, statsData] = await Promise.all([
        getAllChats(filters.status, filters.page),
        getChatStats()
      ])
      setChats(chatsData.chats)
      setStats(statsData)
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
      setConnected(true);
    },
    'disconnect': () => {
      console.log('❌ Admin socket disconnected');
      setConnected(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading chats...</span>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with Stats */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat Management</h1>
            <p className="text-gray-600 mt-2">Manage customer support conversations</p>
          </div>
          <button
            onClick={loadChats}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalChats || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Chats</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeChats || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingChats || 0}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm border">
            <div className="flex items-center">
              <CheckBadgeIcon className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unreadCount?.totalUnreadAdmin || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-5 gap-6">
        
        {/* Chat List */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Conversations</h2>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="p-8 text-center">
                <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No conversations found</p>
              </div>
            ) : (
              chats.map(chat => (
                <div
                  key={chat._id}
                  onClick={() => loadChat(chat._id)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedChat?._id === chat._id ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <UserCircleIcon className="h-10 w-10 text-gray-400 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-gray-900">
                            {chat.userId?.name || 'Unknown User'}
                          </h3>
                          <StatusBadge status={chat.status} />
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {chat.userId?.email || 'No email'}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          Last activity: {formatTime(chat.lastActivity)}
                        </p>
                      </div>
                    </div>
                    
                    {chat.unreadCount?.admin > 0 && (
                      <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {chat.unreadCount.admin > 9 ? '9+' : chat.unreadCount.admin}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat View */}
        <div className="lg:col-span-3">
          {selectedChat ? (
            <div className="bg-white rounded-xl shadow-sm border h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <UserCircleIcon className="h-10 w-10 text-gray-400" />
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedChat.userId?.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {selectedChat.userId?.email}
                    </p>
                  </div>
                  <StatusBadge status={selectedChat.status} />
                </div>
                
                <div className="flex items-center space-x-2">
                  {selectedChat.status === 'active' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedChat._id, 'closed')}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200 transition-colors"
                    >
                      Close Chat
                    </button>
                  )}
                  {selectedChat.status === 'closed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedChat._id, 'active')}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200 transition-colors"
                    >
                      Reopen Chat
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteChat(selectedChat._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-600">Loading messages...</span>
                  </div>
                ) : selectedChatMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No messages yet</p>
                  </div>
                ) : (
                  selectedChatMessages.map((message, index) => (
                    <div
                      key={message.messageId || index}
                      className={`flex ${message.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
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
                        <p className="text-sm leading-relaxed">{message.message}</p>
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

              {/* Message Input */}
              <div className="p-4 border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your response..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={sending || selectedChat.status === 'closed'}
                  />
                  <button
                    type="submit"
                    disabled={sending || !newMessage.trim() || selectedChat.status === 'closed'}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    {sending ? (
                      <ArrowPathIcon className="h-5 w-5 animate-spin" />
                    ) : (
                      <PaperAirplaneIcon className="h-5 w-5" />
                    )}
                  </button>
                </form>
                {selectedChat.status === 'closed' && (
                  <p className="text-xs text-gray-500 mt-2">
                    This chat is closed. Reopen to continue messaging.
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border h-[600px] flex items-center justify-center">
              <div className="text-center">
                <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">Select a conversation</h3>
                <p className="text-gray-500">Choose a chat from the list to view and respond to messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ManageChats
