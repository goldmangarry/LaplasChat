import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@chakra-ui/react', '@emotion/react'],
          icons: ['lucide-react', 'react-icons']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://dev-apilaplas-backend.onrender.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        timeout: 300000, // 5 minutes
        proxyTimeout: 300000 // 5 minutes
      }
    }
  }
})
