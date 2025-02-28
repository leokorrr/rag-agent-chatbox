# RAG Chat Widget

Simple chat widget that can be embedded on any website via iframe.

## Quick Start

Add this code to your website:

```html
<!-- Add widget directly -->
<iframe 
  src="http://localhost:5173?apiEndpoint=YOUR_BACKEND_URL/query&position=bottom-right"
  style="border: none; position: fixed; bottom: 0; right: 0; width: 400px; height: 600px; z-index: 9999;"
></iframe>

<!-- Or use script to add widget automatically -->
<script>
  (function() {
    const iframe = document.createElement('iframe');
    iframe.src = 'http://localhost:5173?apiEndpoint=YOUR_BACKEND_URL/query';
    iframe.style.cssText = 'border: none; position: fixed; bottom: 0; right: 0; width: 400px; height: 600px; z-index: 9999;';
    document.body.appendChild(iframe);
  })();
</script>
```

## Configuration

URL Parameters:
- `apiEndpoint` - Your backend API URL for handling chat queries
- `position` - Widget position (bottom-right, bottom-left, top-right, top-left)

## Development

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Test locally using examples/test.html

## Building

Build for production:
```bash
npm run build
```

The build output will be in the `dist` directory, ready to be deployed to your hosting service.