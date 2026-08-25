import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // 🚀 This explicitly maps "react-is" to prevent the esbuild resolution error
      'react-is': 'react-is/cjs/react-is.development.js',
    },
  },
  optimizeDeps: {
    // 🚀 Forces Vite to pre-bundle these dependencies together
    include: ['react-is', 'recharts', 'react-joyride'],
    force: true 
  },
  server: {
    // Optional: ensures the dev server remains stable
    watch: {
      usePolling: true,
    }
  }
})