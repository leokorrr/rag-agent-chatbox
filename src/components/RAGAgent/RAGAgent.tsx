import { useEffect, useState, useRef } from 'react'
import { Send, Loader2, MessageCircle, X } from 'lucide-react'
import { useMutation } from 'react-query'
import { fetcher } from '../../utils/reactQuery/fetcher'
import { useMessages } from './hooks/useMessages'
import '../../style/rag-agent.css'

interface FloatingRAGAgentProps {
  apiEndpoint: string;
  agentId: string;
  shopUrl: string;
  shopToken: string;
  buttonPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
  header?: string;
  footer?: string;
  placeholder?: string;
  initialMessage?: string;
}

const FloatingRAGAgent = ({
  apiEndpoint,
  agentId,
  shopUrl,
  shopToken,
  buttonPosition = 'bottom-right',
  className = '',
  header = 'Sheldon AI - Chat',
  footer = 'New line in the message? Press Shift + Enter',
  placeholder = 'Ask me anything...',
  initialMessage
}: FloatingRAGAgentProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [messagesHeight, setMessagesHeight] = useState<number>(384)
  const { messages, handleNewMessage } = useMessages(initialMessage) 
  
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

  const getButtonPositionClass = () => {
    switch (buttonPosition) {
      case 'bottom-left':
        return 'rag-chat-button-bottom-left';
      case 'top-right':
        return 'rag-chat-button-top-right';
      case 'top-left':
        return 'rag-chat-button-top-left';
      default:
        return 'rag-chat-button-bottom-right';
    }
  };

  return (
    <div className={`rag-wrapper ${className}`}>
      <button
        onClick={() => setIsOpen(true)}
        className={`rag-chat-button ${getButtonPositionClass()} ${isOpen ? 'rag-button-hidden' : 'rag-button-visible'}`}
      >
        <MessageCircle className="rag-button-icon" />
      </button>

      {isOpen && (
        <div
          ref={chatContainerRef}
          className={`rag-chat-container ${isMobile ? 'rag-chat-container-mobile' : 'rag-chat-container-desktop'}`}
        >
          {/* Header */}
          <div 
            ref={headerRef}
            className={`rag-header ${isMobile ? '' : 'rag-header-desktop'}`}
          >
            <div className="rag-header-title-wrapper">
              <div className="rag-header-avatar">
                S
              </div>
              <h3 className="rag-header-title">{header}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rag-close-button"
            >
              <X className="rag-close-icon" />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className={`rag-messages ${isMobile ? '' : 'rag-messages-desktop'}`}
            style={isMobile ? { height: `${messagesHeight}px` } : {}}
          >
            {error ? (
              <div className="rag-error-message">
                {error instanceof Error ? error.message : 'Something went wrong'}
              </div>
            ) : null}

            {messages?.map((message, index) => (
              <div
                key={index}
                className={`rag-message ${message.author === 'user' ? 'rag-message-user' : ''}`}
              >
                <div
                  className={`rag-message-avatar ${
                    message.author === 'user' ? 'rag-message-avatar-user' : 'rag-message-avatar-agent'
                  }`}
                >
                  {message.author === 'user' ? 'U' : 'S'}
                </div>
                <div
                  className={`rag-message-bubble ${
                    message.author === 'user'
                      ? 'rag-message-bubble-user'
                      : 'rag-message-bubble-agent'
                  }`}
                >
                  <p className="rag-message-text">{message.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input form */}
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="rag-form"
          >
            <div className="rag-form-container">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                className="rag-textarea"
                placeholder={placeholder}
              />
              <button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="rag-submit-button"
              >
                {isLoading ? (
                  <Loader2 className="rag-button-icon-small rag-spinner" />
                ) : (
                  <Send className="rag-button-icon-small" />
                )}
              </button>
            </div>
          </form>
          <div 
            ref={footerRef}
            className={`rag-footer ${isMobile ? '' : 'rag-footer-desktop'}`}
          >
            <p className="rag-footer-text">
              {footer}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default FloatingRAGAgent
