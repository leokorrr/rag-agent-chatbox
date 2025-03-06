import FloatingRAGAgent from './components/RAGAgent/RAGAgent'
import { QueryClient, QueryClientProvider } from 'react-query'

function App({ config }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
     <FloatingRAGAgent
          apiEndpoint={config.apiEndpoint}
          agentId={config.agentId}
          shopUrl={config.shopUrl}
          shopToken={config.shopToken}
          buttonPosition={config.buttonPosition}
        />
    </QueryClientProvider>
  )
}

export default App
