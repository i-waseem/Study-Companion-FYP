import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',  
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false, 
    minify: 'esbuild', 
    rollupOptions: {
      output: {
        manualChunks: {
          'ui-libs': ['@emotion/react', '@emotion/styled', '@fortawesome/fontawesome-free']
        }
      }
    }
  },
  define: {
    'process.env': {}
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
})
