import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // SEO and Performance optimizations
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
    
    // Enable minification with esbuild (default, faster than terser)
    minify: 'esbuild',
    
    // Remove console logs in production for better performance
    esbuild: {
      drop: ['console', 'debugger'],
    },
    
    // Generate source maps for debugging (disable in production for better performance)
    sourcemap: false,
    
    // Better asset optimization
    assetsInlineLimit: 4096,
    
    // CSS optimization
    cssCodeSplit: true,
    
    // Preload module directives
    modulePreload: {
      polyfill: true
    }
  },
  
  // Development server optimization
  server: {
    port: 5173,
    open: true,
    hmr: {
      overlay: false
    },
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
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
    ],
    exclude: ['fsevents']
  },

  // Preview server configuration (for production builds)
  preview: {
    port: 4173,
    host: true
  }
})
