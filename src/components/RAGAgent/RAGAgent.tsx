import { useEffect, useState, useRef } from 'react'
import { Send, Loader2, MessageCircle, X } from 'lucide-react'
import { useMutation } from 'react-query'
import { fetcher } from '../../utils/reactQuery/fetcher'
import { getButtonPosition } from '../../utils/getButtonPosition'
import { cn } from '../../utils/cn'
import { useMessages } from './hooks/useMessages'

interface FloatingRAGAgentProps {
  apiEndpoint: string;
  agentId: string;
  shopUrl: string;
  shopToken: string;
  buttonPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

const FloatingRAGAgent = ({
  apiEndpoint,
  agentId,
  shopUrl,
  shopToken,
  buttonPosition = 'bottom-right',
  className = ''
}: FloatingRAGAgentProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [messagesHeight, setMessagesHeight] = useState<number>(384)
  const { messages, handleNewMessage } = useMessages()
  
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkIsMobile()
    
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])
  
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, isMobile])

  useEffect(() => {
    if (!isOpen) return;

    const calculateMessagesHeight = () => {
      if (isMobile && chatContainerRef.current && headerRef.current && formRef.current && footerRef.current) {
        const chatHeight = chatContainerRef.current.clientHeight;
        const headerHeight = headerRef.current.clientHeight;
        const formHeight = formRef.current.clientHeight;
        const footerHeight = footerRef.current.clientHeight;
        
        const availableHeight = chatHeight - headerHeight - formHeight - footerHeight;
        
        setMessagesHeight(availableHeight);
      } else {
        setMessagesHeight(384); // 384px = h-96
      }
    };

    const timer = setTimeout(calculateMessagesHeight, 100);
    
    window.addEventListener('resize', calculateMessagesHeight);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateMessagesHeight);
    };
  }, [isOpen, isMobile, messages.length]);

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
          ref={chatContainerRef}
          className={cn(
            'fixed border border-gray-300 bg-white shadow-xl transition-all duration-300 transform z-99999',
            isMobile 
              ? 'inset-0 w-full h-full rounded-none' 
              : 'right-4 bottom-4 w-96 max-w-[calc(100vw-2rem)] rounded-2xl'
          )}
        >
          {/* Header */}
          <div 
            ref={headerRef}
            className={cn(
              'flex justify-between items-center p-4 bg-black border-b',
              isMobile ? '' : 'rounded-t-2xl'
            )}
          >
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
            className={cn(
              'overflow-y-auto p-4 bg-white scroll-smooth',
              isMobile ? '' : 'h-96'
            )}
            style={isMobile ? { height: `${messagesHeight}px` } : {}}
          >
            {error ? (
              <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-lg'>
                {error instanceof Error ? error.message : 'Something went wrong'}
              </div>
            ) : null}

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
            ref={formRef}
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
          <div 
            ref={footerRef}
            className={cn(
              'px-4 py-3 border-t border-gray-200 bg-gray-100', 
              isMobile ? '' : 'rounded-b-2xl'
            )}
          >
            <p className='text-sm text-gray-500 text-center'>
              New line in the message? Press Shift + Enter
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingRAGAgent
