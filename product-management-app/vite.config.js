import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/PreFinalProj-HaroldWebMarket/',
  server: {
    proxy: {
      '/api/dummyjson': {
        target: 'https://dummyjson.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/dummyjson/, ''),
      },
    },
  },
})
