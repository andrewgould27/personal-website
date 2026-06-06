import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['recharts'],
  },
  server: {
    host: true,
    port: 5173,
    allowedHosts: ['localhost', 'andrewgould.dev', 'www.andrewgould.dev'],
    proxy: {
      '/api': process.env.API_URL ?? 'http://localhost:8000',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    globals: true,
  },
})
