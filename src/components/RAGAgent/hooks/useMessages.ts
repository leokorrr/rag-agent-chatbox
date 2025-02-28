import { useState } from 'react'
import dayjs from 'dayjs'

type TMessage = {
  message: string
  author: 'agent' | 'user' // Restrict author to 'agent' or 'user'
  timestamp: string
}

export const useMessages = () => {
  const [messages, setMessages] = useState<TMessage[]>([
    {
      message: '👋 Hi! I am Sheldon AI, ask me anything about Chatbase!',
      author: 'agent',
      timestamp: dayjs().format('HH:mm')
    },
  ])

  const handleNewMessage = ({
    message,
    author
  }: {
    message: string
    author: 'agent' | 'user'
  }) => {
    const newMessage: TMessage = {
      message,
      author,
      timestamp: dayjs().format('HH:mm')
    }

    setMessages((prev) => [...prev, newMessage])
  }
  return {
    messages,
    setMessages,
    handleNewMessage
  }
}
