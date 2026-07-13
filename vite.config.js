import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/kazumon/',
  plugins: [react()],
  server: {
    host: true, // Expose to local network
  }
})
