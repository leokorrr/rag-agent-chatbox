import { useEffect, useState, useRef } from 'react'
import { Send, Loader2, MessageCircle, X } from 'lucide-react'
import { useMutation } from 'react-query'
import { fetcher } from '../../utils/reactQuery/fetcher'
import { getButtonPosition } from '../../utils/getButtonPosition'
import { cn } from '../../utils/cn'
import { useMessages } from './hooks/useMessages'
const FloatingRAGAgent = ({
  apiEndpoint,
  agentId,
  shopUrl,
  shopToken,
  buttonPosition = 'bottom-right',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const { messages, handleNewMessage } = useMessages()
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  const {
    mutate: sendMessage,
    isLoading,
    error
  } = useMutation({
    mutationFn: (formData: { message: string }) =>
      fetcher(`${apiEndpoint}?agentId=${agentId}&shopUrl=${shopUrl}`, {
        method: 'POST',
        body: JSON.stringify({ message: formData.message, sessionId: Date.now() }),
        headers: {
          Authorization: `Bearer ${shopToken}`
        }
      }),
    onSuccess: (data) => {
      handleNewMessage({ message: data?.data?.message, author: 'agent' })
    },
    onError: (error) => {
      console.log(error)
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() !== '') {
      handleNewMessage({ message: query.trim(), author: 'user' })
      sendMessage({ message: query.trim() })
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (query.trim()) {
        handleSubmit(e)
      }
    }
  }

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current
      setTimeout(() => {
        container.scrollTop = container.scrollHeight
      }, 50)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen) {
      window.parent.postMessage({ type: 'open-chat', source: 'iframe' }, '*')
    } else {
      window.parent.postMessage({ type: 'close-chat', source: 'iframe' }, '*')
    }
  }, [isOpen])

  return (
    <div className={className}>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed z-99999 p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-900 transition-all duration-300',
          getButtonPosition(buttonPosition),
          isOpen ? 'scale-0' : 'scale-100'
        )}
      >
        <MessageCircle className='w-6 h-6' />
      </button>

      {isOpen && (
        <div
          className='fixed right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)]
        border rounded-2xl border-gray-300 bg-white shadow-xl transition-all duration-300 transform z-99999'
        >
          {/* Header */}
          <div className='flex justify-between items-center rounded-t-2xl p-4 bg-black border-b'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 rounded-full bg-white flex items-center justify-center text-black font-bold'>
                S
              </div>
              <h3 className='font-medium text-white'>Sheldon AI - Chat</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className='p-1 hover:bg-gray-800 rounded-full text-white'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className='h-96 overflow-y-auto p-4 bg-white scroll-smooth'
          >
            {error && (
              <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-lg'>
                {error instanceof Error ? error.message : 'Something went wrong'}
              </div>
            )}

            {messages?.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-2 mb-4 ${
                  message.author === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center
                justify-center ${
                  message.author === 'user' ? 'bg-gray-600' : 'bg-black'
                } text-white`}
                >
                  {message.author === 'user' ? 'U' : 'S'}
                </div>
                <div
                  className={`px-4 py-2  max-w-[80%]  ${
                    message.author === 'user'
                      ? 'rounded-tl-xl rounded-b-xl'
                      : 'rounded-tr-xl rounded-b-xl'
                  } ${message.author === 'user' ? 'bg-gray-100' : 'bg-gray-100'}`}
                >
                  <p className='whitespace-pre-wrap'>{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form
            onSubmit={handleSubmit}
            className='p-4 border-t border-gray-200'
          >
            <div className='flex items-center space-x-2'>
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className='flex-1 px-3 py-2 resize-none bg-transparent text-wrap break-all outline-none transition-all min-h-[40px] max-h-[120px]'
                placeholder='Ask me anything...'
              />
              <button
                type='submit'
                disabled={isLoading || !query.trim()}
                className='p-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
              >
                {isLoading ? (
                  <Loader2 className='w-5 h-5 animate-spin text-black' />
                ) : (
                  <Send className='w-5 h-5 text-black' />
                )}
              </button>
            </div>
          </form>
          <div className='px-4 py-2.5 border-t border-gray-200 bg-gray-100 rounded-b-2xl'>
            <p className='text-sm text-gray-500'>
              New line in the message? Press Shift + Enter
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingRAGAgent
