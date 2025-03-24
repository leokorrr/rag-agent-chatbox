  import './index.css'
import { createRoot } from 'react-dom/client'
import App from './App'

    window.mountChatWidget = (config) => {

      const container = document.getElementById(config.containerId);
      if (!container) return;
    
      const root = createRoot(container);
      root.render(
      <App config={config}/>
      );
    };