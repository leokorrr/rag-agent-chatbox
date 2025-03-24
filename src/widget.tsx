import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
console.log("🔥 React widget script running");
document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ DOM fully loaded')

  if (!window.RAG_CONFIG) {
    console.warn('⚠️ RAG_CONFIG not found')
    return
  }

  // console.log(window.RAG_CONFIG)

  const container = document.createElement('div')
  container.id = 'rag-widget-root'
  document.body.appendChild(container)

  const root = ReactDOM.createRoot(container)
  root.render(<App config={window.RAG_CONFIG} />)
})
