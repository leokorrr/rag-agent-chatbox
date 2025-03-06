import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'production')
    }
  },
  css: {
    postcss: './postcss.config.cjs'
  },
  build: {
    lib: {
      entry: './src/main.tsx', 
      name: 'SheldonChatWidget',
      fileName: 'sheldon-chat-widget',
      formats: ['iife']
    },
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') return 'sheldon-chat-widget.css';
          return assetInfo.name!;
        },
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    }
  }
})