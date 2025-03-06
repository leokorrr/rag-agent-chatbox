(function() {
    const script = document.currentScript;
  
    const apiEndpoint = script.getAttribute('data-api-endpoint');
    const agentId = script.getAttribute('data-agent-id') || 'default-agent';
    const shopUrl = script.getAttribute('data-shop-url') || window.location.origin;
    const shopToken = script.getAttribute('data-shop-token') || '';
    const position = script.getAttribute('data-position') || 'bottom-right';
    
    // Dodajemy parametr baseUrl, który pozwoli na określenie podstawowego adresu URL
    const baseUrl = script.getAttribute('data-base-url') || 'https://agent.sheldonai.net';
  
    const container = document.createElement('div');
    container.id = 'sheldon-chat-widget-container';
    document.body.appendChild(container);

    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const scriptEl = document.createElement('script');
        scriptEl.src = src;
        scriptEl.defer = true;
        scriptEl.onload = resolve;
        scriptEl.onerror = reject;
        document.body.appendChild(scriptEl);
      });
    };

    // Sprawdzamy, czy React i ReactDOM są już dostępne w oknie
    const reactAlreadyLoaded = typeof window.React !== 'undefined' && typeof window.ReactDOM !== 'undefined';
    
    // Modyfikujemy ścieżkę do pliku widgetu, używając baseUrl
    const widgetScriptUrl = `${baseUrl}/sheldon-chat-widget.iife.js`;

    // Ładujemy React i ReactDOM tylko jeśli nie są już załadowane
    const loadDependencies = reactAlreadyLoaded
      ? Promise.resolve()
      : Promise.all([
          loadScript('https://unpkg.com/react@18/umd/react.production.min.js'),
          loadScript('https://unpkg.com/react-dom@18/umd/react-dom.production.min.js')
        ]);

    loadDependencies
      .then(() => {
        return loadScript(widgetScriptUrl);
      })
      .then(() => {
        if (window.mountChatWidget) {
          window.mountChatWidget({
            containerId: 'sheldon-chat-widget-container',
            apiEndpoint,
            agentId,
            shopUrl,
            shopToken,
            buttonPosition: position
          });
        } else {
          console.error('Funkcja mountChatWidget nie jest dostępna!');
        }
      })
      .catch(error => {
        console.error('Błąd ładowania skryptów:', error);
      });
})();
  
// TODO Zostało zbudowć 
// TODO wrzucic na vercel 
// TODO podpiać link poprawny wyżej