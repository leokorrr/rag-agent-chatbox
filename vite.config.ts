import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// import autoprefixer from 'autoprefixer'
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    lib: {
      entry: 'src/widget.tsx',
      name: 'RAGWidget',
      formats: ['iife'], // generates <script> compatible bundle
      fileName: () => 'rag-widget.js',
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
  },
  define: {
    'process.env': {} // <== THIS FIXES IT
  }
})
