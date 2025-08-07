// API Configuration
const isProduction = import.meta.env.PROD
const isVercel = typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')

// Configure your backend URL here
const RAILWAY_BACKEND_URL = 'https://cartly-production.up.railway.app'

// Force production mode if we're on Vercel
const isActuallyProduction = isProduction || isVercel || (typeof window !== 'undefined' && window.location.hostname !== 'localhost')

export const API_BASE_URL = !isActuallyProduction 
  ? '/api'  // Development: uses Vite proxy
  : import.meta.env.VITE_API_BASE_URL || `${RAILWAY_BACKEND_URL}/api`  // Production: Railway backend

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  // Use proxy for development
  if (!isActuallyProduction) {
    return `/api/${cleanEndpoint}`
  }
  
  // For production, always use the full Railway backend URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || RAILWAY_BACKEND_URL
  const baseUrl = backendUrl.endsWith('/api') ? backendUrl : `${backendUrl}/api`
  return `${baseUrl}/${cleanEndpoint}`
}

// Helper function to safely parse JSON responses
export const parseJsonResponse = async (response) => {
  const contentType = response.headers.get('content-type')
  
  if (!contentType || !contentType.includes('application/json')) {
    await response.text() // Consume the response
    throw new Error(`Server returned ${response.status}: ${response.statusText}. Expected JSON response but got ${contentType}`)
  }
  
  try {
    return await response.json()
  } catch {
    throw new Error('Invalid JSON response from server')
  }
}

// Enhanced fetch with better error handling
export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint)
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }
  
  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      // Try to get error message from response
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`
      try {
        const errorData = await parseJsonResponse(response)
        errorMessage = errorData.message || errorMessage
      } catch {
        // If we can't parse the error response, use the status text
      }
      throw new Error(errorMessage)
    }
    
    return await parseJsonResponse(response)
  } catch (error) {
    console.error(`API request failed for ${url}:`, error)
    throw error
  }
}
