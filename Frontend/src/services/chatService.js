import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 💬 Get user's chat
// Simple in-memory cache and in-flight deduplication
const _cache = new Map()
const _inflight = new Map()
const setCache = (key, data, ttlMs = 10000) => {
  _cache.set(key, { data, expires: Date.now() + ttlMs })
}
const getCache = (key) => {
  const entry = _cache.get(key)
  if (!entry) return null
  if (Date.now() > entry.expires) {
    _cache.delete(key)
    return null
  }
  return entry.data
}

export const getUserChat = async ({ force = false, ttlMs = 10000 } = {}) => {
  const key = 'my-chat'
  if (!force) {
    const cached = getCache(key)
    if (cached) return cached
  }
  if (_inflight.has(key)) return _inflight.get(key)
  const req = axios
    .get(`${API}/chat/my-chat`, { headers: getAuthHeaders() })
    .then((res) => {
      setCache(key, res.data, ttlMs)
      _inflight.delete(key)
      return res.data
    })
    .catch((err) => {
      _inflight.delete(key)
      throw err
    })
  _inflight.set(key, req)
  return req
}

// 📤 Send message
export const sendMessage = async (message, attachments = []) => {
  const res = await axios.post(`${API}/chat/message`, 
    { message, attachments }, 
    { headers: getAuthHeaders() }
  )
  return res.data
}

// Admin Chat Services
// 📋 Get all chats (admin only)
export const getAllChats = async (status = 'all', page = 1, limit = 20, { force = false, ttlMs = 5000 } = {}) => {
  const key = `admin-all:${status}:${page}:${limit}`
  if (!force) {
    const cached = getCache(key)
    if (cached) return cached
  }
  if (_inflight.has(key)) return _inflight.get(key)
  const req = axios
    .get(`${API}/chat/admin/all`, {
      params: { status, page, limit },
      headers: getAuthHeaders()
    })
    .then((res) => {
      setCache(key, res.data, ttlMs)
      _inflight.delete(key)
      return res.data
    })
    .catch((err) => {
      _inflight.delete(key)
      throw err
    })
  _inflight.set(key, req)
  return req
}

// 🔍 Get specific chat (admin only)
export const getChatById = async (chatId) => {
  const res = await axios.get(`${API}/chat/admin/${chatId}`, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 📊 Get chat statistics (admin only)
export const getChatStats = async () => {
  const res = await axios.get(`${API}/chat/admin/stats`, {
    headers: getAuthHeaders()
  })
  return res.data
}

// ✏️ Update chat status (admin only)
export const updateChatStatus = async (chatId, updateData) => {
  const res = await axios.put(`${API}/chat/admin/${chatId}`, updateData, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 🗑️ Delete chat (admin only)
export const deleteChat = async (chatId) => {
  const res = await axios.delete(`${API}/chat/admin/${chatId}`, {
    headers: getAuthHeaders()
  })
  return res.data
}

// 📤 Send message as admin to specific user
export const sendAdminMessage = async (userId, message, attachments = []) => {
  const res = await axios.post(`${API}/chat/message`, 
    { userId, message, attachments }, 
    { headers: getAuthHeaders() }
  )
  return res.data
}
