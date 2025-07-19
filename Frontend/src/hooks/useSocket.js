import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export const useSocket = (onEvents = {}, user = null) => {
  const socketRef = useRef(null)
  const currentUserIdRef = useRef(null)
  const eventHandlersRef = useRef(onEvents)
  
  // Update event handlers ref on changes
  useEffect(() => {
    eventHandlersRef.current = onEvents
  }, [onEvents])
  
  useEffect(() => {
    // Only create socket if we have a user and don't already have one for this user
    if (!user || !user._id) {
      return
    }
    
    // If we already have a socket for this user, don't recreate
    if (socketRef.current && currentUserIdRef.current === user._id) {
      return
    }
    
    // Clean up existing socket if user changed
    if (socketRef.current && currentUserIdRef.current !== user._id) {
      
      socketRef.current.disconnect()
      socketRef.current = null
    }
    
    
    
    const socket = io(SOCKET_URL, {
      transports: ['websocket'],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000,
    })
    
    socketRef.current = socket
    currentUserIdRef.current = user._id
    
    // Handle connection events
    socket.on('connect', () => {
     
      
      // Join user's personal room for targeted messages
      socket.emit('join-user-room', user._id)
      
      // If user is admin, also join admin room
      if (user.isAdmin) {
        socket.emit('join-admin-room')
       
      }
      
      // Call connect handler if provided
      if (eventHandlersRef.current.connect) {
        eventHandlersRef.current.connect()
      }
    })
    
    socket.on('disconnect', (reason) => {
     
      
      // Call disconnect handler if provided
      if (eventHandlersRef.current.disconnect) {
        eventHandlersRef.current.disconnect()
      }
    })
    
    socket.on('connect_error', (error) => {
   
      
      // Call error handler if provided
      if (eventHandlersRef.current.connect_error) {
        eventHandlersRef.current.connect_error(error)
      }
    })
    
    // Register custom event listeners
    Object.entries(eventHandlersRef.current).forEach(([eventName]) => {
      // Skip built-in events we handle separately
      if (['connect', 'disconnect', 'connect_error'].includes(eventName)) {
        return
      }
      
      socket.on(eventName, (data) => {
        // Use current handler from ref to always get latest version
        const currentHandler = eventHandlersRef.current[eventName]
        if (currentHandler) {
          currentHandler(data)
        }
      })
     
    })
    
    // Cleanup function
    return () => {
      if (socket && socket.connected) {
       
        socket.disconnect()
      }
    }
  }, [user]) // Only depend on user object
  
  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (socketRef.current) {
       
        socketRef.current.disconnect()
        socketRef.current = null
        currentUserIdRef.current = null
      }
    }
  }, [])
  
  return socketRef.current
}
