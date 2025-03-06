import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
        }
      }
    }
  }
})