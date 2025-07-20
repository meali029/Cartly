import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('react-router-dom')) {
              return 'vendor-router'
            }
            if (id.includes('@heroicons')) {
              return 'vendor-icons'
            }
            if (id.includes('axios')) {
              return 'vendor-axios'
            }
            return 'vendor'
          }
          
          // Admin components chunk
          if (id.includes('/src/admin/') || id.includes('/src/services/adminService')) {
            return 'admin'
          }
          
          // Chat components chunk
          if (id.includes('/src/components/chat/') || 
              id.includes('/src/services/chatService') ||
              id.includes('/src/pages/Chat.jsx') ||
              id.includes('/src/context/ChatNotificationContext')) {
            return 'chat'
          }
        }
      }
    },
    
    // Enable minification and compression
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true
      }
    },
    
    // Enable source maps for debugging (optional)
    sourcemap: false
  },
  
  // Development server optimization
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: false
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      '@heroicons/react'
    ]
  }
})
