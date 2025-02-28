import { useEffect } from 'react'
import RAGAgent from './components/RAGAgent/RAGAgent'
import { QueryClient, QueryClientProvider } from 'react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <RAGAgent></RAGAgent>
    </QueryClientProvider>
  )
}

export default App
