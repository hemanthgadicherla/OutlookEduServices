import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui':    ['framer-motion', 'bootstrap', 'react-bootstrap', 'swiper'],
          'vendor-forms': ['react-hook-form', 'react-toastify'],
          'vendor-icons': ['react-icons', 'lucide-react'],
          'vendor-media': ['@supabase/supabase-js', 'tus-js-client'],
        }
      }
    }
  }
})