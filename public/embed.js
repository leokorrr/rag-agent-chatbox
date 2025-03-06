(function() {
    const script = document.currentScript;
  
    const apiEndpoint = script.getAttribute('data-api-endpoint');
    const agentId = script.getAttribute('data-agent-id') || 'default-agent';
    const shopUrl = script.getAttribute('data-shop-url') || window.location.origin;
    const shopToken = script.getAttribute('data-shop-token') || '';
    const position = script.getAttribute('data-position') || 'bottom-right';
  
    const container = document.createElement('div');
    container.id = 'sheldon-chat-widget-container';
    document.body.appendChild(container);
  
    const scriptEl = document.createElement('script');
    scriptEl.src = '/sheldon-chat-widget.js';
    scriptEl.defer = true;
    scriptEl.onload = () => {
      if (window.mountChatWidget) {
        window.mountChatWidget({
          containerId: 'sheldon-chat-widget-container',
          apiEndpoint,
          agentId,
          shopUrl,
          shopToken,
          buttonPosition: position
        });
      }
    };
    document.body.appendChild(scriptEl);
})();
  
// TODO Zostało zbudowć 
// TODO wrzucic na vercel 
// TODO podpiać link poprawny wyżej