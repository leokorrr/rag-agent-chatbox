import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

console.log("🔥 React widget script running");

// Create container element in advance
const container = document.createElement('div')
container.id = 'rag-widget-root'
document.body.appendChild(container)

// Function to initialize the React app
const initializeWidget = (config) => {
  console.log('🚀 Initializing widget with config:', config)
  
  const root = ReactDOM.createRoot(container)
  root.render(<App config={config} />)
}

// Check if config is already available
if (window.RAG_CONFIG) {
  console.log('📌 RAG_CONFIG already available')
  
  // If the config promise exists, wait for it
  if (window.RAG_CONFIG_READY) {
    window.RAG_CONFIG_READY.then(config => {
      initializeWidget(config)
    })
  } else {
    // Otherwise use what we have
    initializeWidget(window.RAG_CONFIG)
  }
} else {
  console.log('⏳ Waiting for RAG_CONFIG...')
  
  // Listen for the config loaded event
  document.addEventListener('rag_config_loaded', function(event) {
    console.log('✅ Config loaded via event')
    const config = event.detail
    initializeWidget(config)
  })
  
  // Set a timeout as a fallback
  setTimeout(() => {
    if (!window.RAG_CONFIG) {
      console.warn('⚠️ Timeout: RAG_CONFIG not found after waiting')
      // Initialize with empty config as fallback
      initializeWidget({})
    }
  }, 5000) // Wait 5 seconds as fallback
}