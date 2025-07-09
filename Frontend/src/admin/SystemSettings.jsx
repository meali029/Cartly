import { useState } from 'react'
import { useToast } from '../context/ToastContext'
import {
  CogIcon,
  ServerIcon,
  ShieldCheckIcon,
  CircleStackIcon,
  BellIcon,
  EnvelopeIcon,
  CloudIcon,
  DocumentTextIcon,
  UserIcon,
  KeyIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowPathIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
  WrenchScrewdriverIcon,
  ChartBarIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

const SystemSettings = () => {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [systemInfo, setSystemInfo] = useState({
    version: '1.0.0',
    uptime: '7 days, 14 hours',
    lastBackup: '2024-01-10 02:30:00',
    database: 'Connected',
    storage: '2.3 GB / 10 GB',
    memory: '1.2 GB / 4 GB',
    cpu: '25%'
  })

  const [settings, setSettings] = useState({
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
  })

  const [logs, setLogs] = useState([
    { id: 1, timestamp: '2024-01-10 14:30:22', level: 'INFO', message: 'User login successful', ip: '192.168.1.100' },
    { id: 2, timestamp: '2024-01-10 14:28:15', level: 'WARNING', message: 'Product stock running low', ip: 'system' },
    { id: 3, timestamp: '2024-01-10 14:25:03', level: 'ERROR', message: 'Payment processing failed', ip: '192.168.1.200' },
    { id: 4, timestamp: '2024-01-10 14:20:44', level: 'INFO', message: 'Order created successfully', ip: '192.168.1.150' },
    { id: 5, timestamp: '2024-01-10 14:15:12', level: 'INFO', message: 'Database backup completed', ip: 'system' }
  ])

  const handleSettingChange = (section, key, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }))
  }

  const handleSaveSettings = async (section) => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      showToast(`${section} settings saved successfully!`, 'success')
    } catch {
      showToast('Failed to save settings', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackup = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      setSystemInfo(prev => ({
        ...prev,
        lastBackup: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }))
      showToast('Database backup completed successfully!', 'success')
    } catch {
      showToast('Backup failed', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleClearLogs = () => {
    setLogs([])
    showToast('System logs cleared', 'success')
  }

  const tabs = [
    { id: 'general', name: 'General', icon: CogIcon },
    { id: 'email', name: 'Email', icon: EnvelopeIcon },
    { id: 'security', name: 'Security', icon: ShieldCheckIcon },
    { id: 'payment', name: 'Payment', icon: CurrencyDollarIcon },
    { id: 'notifications', name: 'Notifications', icon: BellIcon },
    { id: 'system', name: 'System Info', icon: ServerIcon },
    { id: 'logs', name: 'Logs', icon: DocumentTextIcon }
  ]

  const getLogIcon = (level) => {
    switch (level) {
      case 'ERROR':
        return <XCircleIcon className="h-4 w-4 text-red-500" />
      case 'WARNING':
        return <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
      case 'INFO':
        return <InformationCircleIcon className="h-4 w-4 text-blue-500" />
      default:
        return <InformationCircleIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getLogColor = (level) => {
    switch (level) {
      case 'ERROR':
        return 'bg-red-50 text-red-700'
      case 'WARNING':
        return 'bg-yellow-50 text-yellow-700'
      case 'INFO':
        return 'bg-blue-50 text-blue-700'
      default:
        return 'bg-gray-50 text-gray-700'
    }
  }

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
          <input
            type="email"
            value={settings.general.adminEmail}
            onChange={(e) => handleSettingChange('general', 'adminEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="UTC">UTC</option>
            <option value="EST">Eastern Time</option>
            <option value="PST">Pacific Time</option>
            <option value="CST">Central Time</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.general.language}
            onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
      <div className="flex items-center">
        <input
          type="checkbox"
          checked={settings.general.maintenanceMode}
          onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
          className="mr-2"
        />
        <label className="text-sm text-gray-700">Enable Maintenance Mode</label>
      </div>
      <button
        onClick={() => handleSaveSettings('general')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save General Settings'}
      </button>
    </div>
  )

  const renderEmailSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Host</label>
          <input
            type="text"
            value={settings.email.smtpHost}
            onChange={(e) => handleSettingChange('email', 'smtpHost', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Port</label>
          <input
            type="text"
            value={settings.email.smtpPort}
            onChange={(e) => handleSettingChange('email', 'smtpPort', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Username</label>
          <input
            type="text"
            value={settings.email.smtpUser}
            onChange={(e) => handleSettingChange('email', 'smtpUser', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">SMTP Password</label>
          <input
            type="password"
            value={settings.email.smtpPass}
            onChange={(e) => handleSettingChange('email', 'smtpPass', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Email</label>
          <input
            type="email"
            value={settings.email.fromEmail}
            onChange={(e) => handleSettingChange('email', 'fromEmail', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Name</label>
          <input
            type="text"
            value={settings.email.fromName}
            onChange={(e) => handleSettingChange('email', 'fromName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <button
        onClick={() => handleSaveSettings('email')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Email Settings'}
      </button>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            value={settings.security.sessionTimeout}
            onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.requireEmailVerification}
            onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Require Email Verification</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.enableTwoFactor}
            onChange={(e) => handleSettingChange('security', 'enableTwoFactor', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Enable Two-Factor Authentication</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.security.allowGuestCheckout}
            onChange={(e) => handleSettingChange('security', 'allowGuestCheckout', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Allow Guest Checkout</label>
        </div>
      </div>
      <button
        onClick={() => handleSaveSettings('security')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Security Settings'}
      </button>
    </div>
  )

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Publishable Key</label>
          <input
            type="text"
            value={settings.payment.stripePublishableKey}
            onChange={(e) => handleSettingChange('payment', 'stripePublishableKey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Stripe Secret Key</label>
          <input
            type="password"
            value={settings.payment.stripeSecretKey}
            onChange={(e) => handleSettingChange('payment', 'stripeSecretKey', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
          <select
            value={settings.payment.currency}
            onChange={(e) => handleSettingChange('payment', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="USD">USD - US Dollar</option>
            <option value="EUR">EUR - Euro</option>
            <option value="GBP">GBP - British Pound</option>
            <option value="JPY">JPY - Japanese Yen</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
          <input
            type="number"
            step="0.1"
            value={settings.payment.taxRate}
            onChange={(e) => handleSettingChange('payment', 'taxRate', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
      <button
        onClick={() => handleSaveSettings('payment')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Payment Settings'}
      </button>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Enable Email Notifications</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.orderAlerts}
            onChange={(e) => handleSettingChange('notifications', 'orderAlerts', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Order Alerts</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={settings.notifications.stockAlerts}
            onChange={(e) => handleSettingChange('notifications', 'stockAlerts', e.target.checked)}
            className="mr-2"
          />
          <label className="text-sm text-gray-700">Stock Alerts</label>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Low Stock Threshold</label>
        <input
          type="number"
          value={settings.notifications.lowStockThreshold}
          onChange={(e) => handleSettingChange('notifications', 'lowStockThreshold', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>
      <button
        onClick={() => handleSaveSettings('notifications')}
        disabled={loading}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Notification Settings'}
      </button>
    </div>
  )

  const renderSystemInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">System Information</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Version:</span>
              <span className="font-medium">{systemInfo.version}</span>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <span className="font-medium">{systemInfo.uptime}</span>
            </div>
            <div className="flex justify-between">
              <span>Database:</span>
              <span className="font-medium text-green-600">{systemInfo.database}</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Resource Usage</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Storage:</span>
              <span className="font-medium">{systemInfo.storage}</span>
            </div>
            <div className="flex justify-between">
              <span>Memory:</span>
              <span className="font-medium">{systemInfo.memory}</span>
            </div>
            <div className="flex justify-between">
              <span>CPU:</span>
              <span className="font-medium">{systemInfo.cpu}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Backup Information</h4>
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <p>Last Backup: {systemInfo.lastBackup}</p>
          </div>
          <button
            onClick={handleBackup}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            <CircleStackIcon className="h-4 w-4" />
            <span>{loading ? 'Backing up...' : 'Backup Now'}</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">System Logs</h4>
        <button
          onClick={handleClearLogs}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          <TrashIcon className="h-4 w-4" />
          <span>Clear Logs</span>
        </button>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No logs available
            </div>
          ) : (
            logs.map((log) => (
              <div key={log.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getLogIcon(log.level)}
                    <span className={`text-xs px-2 py-1 rounded-full ${getLogColor(log.level)}`}>
                      {log.level}
                    </span>
                    <span className="text-sm text-gray-900">{log.message}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {log.timestamp} | {log.ip}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <CogIcon className="h-8 w-8 text-indigo-600" />
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <ServerIcon className="h-4 w-4" />
            <span>System Status: Online</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        {activeTab === 'general' && renderGeneralSettings()}
        {activeTab === 'email' && renderEmailSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'payment' && renderPaymentSettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'system' && renderSystemInfo()}
        {activeTab === 'logs' && renderLogs()}
      </div>
    </div>
  )
}

export default SystemSettings
