import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    proxy: {
      '/allproducts': 'http://localhost:4000',
      '/removeproduct': 'http://localhost:4000',
      '/orders': 'http://localhost:4000',
      '/users': 'http://localhost:4000',
      '/upload': 'http://localhost:4000',
      '/addproduct': 'http://localhost:4000',
      '/promos': 'http://localhost:4000',
      '/updateproduct': 'http://localhost:4000',
      '/dashboard-stats':'http://localhost:4000',
      '/monthly-revenue':'http://localhost:4000',
    }
  }
})
