// JWT Token utilities for client-side token management

/**
 * Decode JWT token payload (without verification)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded payload or null if invalid
 */
export const decodeToken = (token) => {
  try {
    if (!token) return null
    
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const payload = parts[1]
    const decoded = JSON.parse(atob(payload))
    return decoded
  } catch (error) {
    console.error('Error decoding token:', error)
    return null
  }
}

/**
 * Check if JWT token is expired
 * @param {string} token - JWT token
 * @returns {boolean} - True if expired, false if valid
 */
export const isTokenExpired = (token) => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true
  
  const currentTime = Math.floor(Date.now() / 1000)
  return decoded.exp < currentTime
}

/**
 * Get token expiration time in milliseconds
 * @param {string} token - JWT token
 * @returns {number|null} - Expiration timestamp or null
 */
export const getTokenExpiration = (token) => {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return null
  
  return decoded.exp * 1000 // Convert to milliseconds
}

/**
 * Get time remaining until token expires
 * @param {string} token - JWT token
 * @returns {number} - Time remaining in milliseconds (0 if expired)
 */
export const getTimeUntilExpiration = (token) => {
  const expiration = getTokenExpiration(token)
  if (!expiration) return 0
  
  const timeRemaining = expiration - Date.now()
  return Math.max(0, timeRemaining)
}

/**
 * Format time duration for display
 * @param {number} milliseconds - Duration in milliseconds
 * @returns {string} - Formatted string like "1 day, 2 hours"
 */
export const formatTimeRemaining = (milliseconds) => {
  if (milliseconds <= 0) return 'Expired'
  
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) {
    const remainingHours = hours % 24
    return `${days} day${days > 1 ? 's' : ''}${remainingHours > 0 ? `, ${remainingHours} hour${remainingHours > 1 ? 's' : ''}` : ''}`
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60
    return `${hours} hour${hours > 1 ? 's' : ''}${remainingMinutes > 0 ? `, ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}` : ''}`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''}`
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''}`
  }
}
