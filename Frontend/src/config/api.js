// API Configuration
const isDevelopment = import.meta.env.DEV
const isProduction = import.meta.env.PROD

// Configure your backend URL here
export const API_BASE_URL = isDevelopment 
  ? '/api'  // Development: uses Vite proxy
  : import.meta.env.VITE_API_BASE_URL || 'https://cartly-production.up.railway.app/api'  // Production: Railway backend

// Helper function to create full API URLs
export const createApiUrl = (endpoint) => {
  // Remove leading slash if present
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  
  if (isDevelopment) {
    return `/api/${cleanEndpoint}`
  }
  
  // For production, use the Railway backend URL
  const backendUrl = import.meta.env.VITE_API_BASE_URL || 'https://cartly-production.up.railway.app/api'
  return `${backendUrl}/${cleanEndpoint}`
}

// Export environment info for debugging
export const config = {
  isDevelopment,
  isProduction,
  apiBaseUrl: API_BASE_URL,
  backendUrl: import.meta.env.VITE_API_BASE_URL || 'https://cartly-production.up.railway.app/api'
}
