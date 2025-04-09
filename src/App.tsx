import FloatingRAGAgent from './components/RAGAgent/RAGAgent'
import { QueryClient, QueryClientProvider } from 'react-query'

interface RAGConfig {
  apiEndpoint: string
  agentId: string
  shopUrl: string
  shopToken: string
  buttonPosition: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

function App({ config }: { config: RAGConfig }) {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
       <div className="rag-root">
        <div className="rag-container rag-isolate">
          <FloatingRAGAgent
            apiEndpoint={config.apiEndpoint}
            agentId={config.agentId}
            shopUrl={config.shopUrl}
            shopToken={config.shopToken}
            buttonPosition={config.buttonPosition}
          />
        </div>
      </div>
    </QueryClientProvider>
  )
}

export default App
