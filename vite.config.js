import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'force-exit-after-build',
      apply: 'build',
      closeBundle() {
        process.exit(0);
      },
    },
  ],
  build: {
    reportCompressedSize: false,
    chunkSizeWarningLimit: 2000,
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
