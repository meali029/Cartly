import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('cratlyToken')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// 💬 Get user's chat
export const getUserChat = async () => {
  const res = await axios.get(`${API}/chat/my-chat`, {
    headers: getAuthHeaders()
  })
  return res.data
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
export const getAllChats = async (status = 'all', page = 1, limit = 20) => {
  const res = await axios.get(`${API}/chat/admin/all`, {
    params: { status, page, limit },
    headers: getAuthHeaders()
  })
  return res.data
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
