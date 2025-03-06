// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )
import { createRoot } from 'react-dom/client'
import FloatingRAGAgent from './components/RAGAgent/RAGAgent'

window.mountChatWidget = (config) => {
  const { containerId, apiEndpoint, agentId, shopUrl, shopToken, buttonPosition } = config;
  const container = document.getElementById(containerId);
  if (!container) return;

  const root = createRoot(container);
  root.render(
    <FloatingRAGAgent
      apiEndpoint={apiEndpoint}
      agentId={agentId}
      shopUrl={shopUrl}
      shopToken={shopToken}
      buttonPosition={buttonPosition}
    />
  );
};