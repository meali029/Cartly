import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = 'http://localhost:5000'

export const useSocket = (onEvents = {}) => {
  const socketRef = useRef(null)

  useEffect(() => {
    socketRef.current = io(SOCKET_URL, { transports: ['websocket'] })

    // Register event listeners
    Object.entries(onEvents).forEach(([event, handler]) => {
      socketRef.current.on(event, handler)
    })

    return () => {
      // Cleanup listeners and disconnect
      Object.entries(onEvents).forEach(([event, handler]) => {
        socketRef.current.off(event, handler)
      })
      socketRef.current.disconnect()
    }
  }, [])

  return socketRef.current
}
