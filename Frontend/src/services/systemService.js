import axios from 'axios'

const API = import.meta.env.VITE_API_BASE_URL

// Get system settings
export const getSystemSettings = async () => {
  const res = await axios.get(`${API}/system/settings`)
  return res.data
}

// Update system settings
export const updateSystemSettings = async (section, settings) => {
  const res = await axios.put(`${API}/system/settings/${section}`, settings)
  return res.data
}

// Get system information
export const getSystemInfo = async () => {
  const res = await axios.get(`${API}/system/info`)
  return res.data
}

// Create system backup
export const createSystemBackup = async () => {
  const res = await axios.post(`${API}/system/backup`)
  return res.data
}

// Get system logs
export const getSystemLogs = async (limit = 50) => {
  const res = await axios.get(`${API}/system/logs?limit=${limit}`)
  return res.data
}

// Clear system logs
export const clearSystemLogs = async () => {
  const res = await axios.delete(`${API}/system/logs`)
  return res.data
}

// Test email configuration
export const testEmailConfig = async (emailSettings) => {
  const res = await axios.post(`${API}/system/test-email`, emailSettings)
  return res.data
}

// Mock data for demo purposes
export const getMockSystemSettings = () => {
  return {
    general: {
      siteName: 'Cartly',
      siteDescription: 'Modern E-commerce Platform',
      adminEmail: 'admin@cartly.com',
      timezone: 'UTC',
      language: 'en',
      maintenanceMode: false
    },
    email: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: '587',
      smtpUser: 'noreply@cartly.com',
      smtpPass: '••••••••',
      fromEmail: 'noreply@cartly.com',
      fromName: 'Cartly Store'
    },
    security: {
      sessionTimeout: '30',
      maxLoginAttempts: '5',
      requireEmailVerification: true,
      enableTwoFactor: false,
      allowGuestCheckout: true
    },
    payment: {
      stripePublishableKey: 'pk_test_••••••••',
      stripeSecretKey: 'sk_test_••••••••',
      currency: 'USD',
      taxRate: '8.5'
    },
    notifications: {
      emailNotifications: true,
      orderAlerts: true,
      stockAlerts: true,
      lowStockThreshold: '10'
    }
  }
}

export const getMockSystemInfo = () => {
  return {
    version: '1.0.0',
    uptime: '7 days, 14 hours',
    lastBackup: '2024-01-10 02:30:00',
    database: 'Connected',
    storage: '2.3 GB / 10 GB',
    memory: '1.2 GB / 4 GB',
    cpu: '25%',
    diskUsage: 23,
    memoryUsage: 30,
    nodeVersion: '18.17.0',
    environment: 'production'
  }
}

export const getMockSystemLogs = () => {
  return [
    { id: 1, timestamp: '2024-01-10 14:30:22', level: 'INFO', message: 'User login successful', ip: '192.168.1.100' },
    { id: 2, timestamp: '2024-01-10 14:28:15', level: 'WARNING', message: 'Product stock running low', ip: 'system' },
    { id: 3, timestamp: '2024-01-10 14:25:03', level: 'ERROR', message: 'Payment processing failed', ip: '192.168.1.200' },
    { id: 4, timestamp: '2024-01-10 14:20:44', level: 'INFO', message: 'Order created successfully', ip: '192.168.1.150' },
    { id: 5, timestamp: '2024-01-10 14:15:12', level: 'INFO', message: 'Database backup completed', ip: 'system' },
    { id: 6, timestamp: '2024-01-10 14:10:05', level: 'WARNING', message: 'High CPU usage detected', ip: 'system' },
    { id: 7, timestamp: '2024-01-10 14:05:33', level: 'INFO', message: 'Email notification sent', ip: 'system' },
    { id: 8, timestamp: '2024-01-10 14:00:18', level: 'ERROR', message: 'Database connection timeout', ip: 'system' }
  ]
}
