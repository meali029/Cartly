// Backup API configuration that forces Railway URL on Vercel
export const getBackendUrl = () => {
  // Check if we're on Vercel by looking at the hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname
    
    // If we're on Vercel (any .vercel.app domain), force Railway backend
    if (hostname.includes('vercel.app')) {
      console.log('🚀 Detected Vercel deployment, using Railway backend')
      return 'https://cartly-production.up.railway.app/api'
    }
    
    // If we're on localhost, use proxy
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      console.log('🏠 Detected localhost, using proxy')
      return '/api'
    }
  }
  
  // Default to Railway for any other case
  console.log('🌐 Using Railway backend as default')
  return 'https://cartly-production.up.railway.app/api'
}

export const createBackupApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const baseUrl = getBackendUrl()
  const fullUrl = `${baseUrl}/${cleanEndpoint}`
  
  console.log('🔗 Backup API URL:', {
    endpoint,
    baseUrl,
    fullUrl,
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server'
  })
  
  return fullUrl
}

// Backup API request function
export const backupApiRequest = async (endpoint, options = {}) => {
  const url = createBackupApiUrl(endpoint)
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }
  
  console.log(`🔄 Making backup API request to: ${url}`)
  
  const response = await fetch(url, defaultOptions)
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`)
  }
  
  const contentType = response.headers.get('content-type')
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error(`Expected JSON but received: ${contentType}`)
  }
  
  return await response.json()
}
