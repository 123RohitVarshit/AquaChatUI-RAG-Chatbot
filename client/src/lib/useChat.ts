import { useState, useCallback, useRef, useEffect } from "react";
import { type Message } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { nanoid } from "nanoid";

interface UseChatOptions {
  apiEndpoint?: string;
}

export function useChat({ apiEndpoint = '/api/chat' }: UseChatOptions = {}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const streamingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const simulateStreaming = useCallback((text: string, messageId: string) => {
    const words = text.split(' ');
    let currentIndex = 0;
    let currentText = '';

    streamingIntervalRef.current = setInterval(() => {
      if (currentIndex < words.length) {
        currentText += (currentIndex > 0 ? ' ' : '') + words[currentIndex];
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: currentText, isStreaming: true }
              : msg
          )
        );
        
        currentIndex++;
      } else {
        if (streamingIntervalRef.current) {
          clearInterval(streamingIntervalRef.current);
          streamingIntervalRef.current = null;
        }
        
        setMessages(prev => 
          prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
        
        setIsLoading(false);
      }
    }, 50);
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    setError(null);
    
    const userMessage: Message = {
      id: nanoid(),
      content: content.trim(),
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    const botMessageId = nanoid();
    const botMessage: Message = {
      id: botMessageId,
      content: '',
      role: 'bot',
      timestamp: new Date(),
      isStreaming: true,
    };

    setMessages(prev => [...prev, botMessage]);

    try {
      const res = await apiRequest(
        'POST',
        apiEndpoint,
        { query: content.trim() }
      );

      const response = await res.json() as { answer: string; status: string };

      if (response.answer) {
        simulateStreaming(response.answer, botMessageId);
      } else {
        throw new Error('No response received from server');
      }
    } catch (err: any) {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
        streamingIntervalRef.current = null;
      }

      const errorMessage = err.message || 'Failed to get response. Please try again.';
      setError(errorMessage);
      
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId
            ? {
                ...msg,
                content: `Sorry, I encountered an error: ${errorMessage}`,
                isStreaming: false,
              }
            : msg
        )
      );
      
      setIsLoading(false);
    }
  }, [isLoading, apiEndpoint, simulateStreaming]);

  const retryLastMessage = useCallback(() => {
    if (messages.length >= 2) {
      const lastUserMessage = [...messages].reverse().find(msg => msg.role === 'user');
      if (lastUserMessage) {
        const userMessageContent = lastUserMessage.content;
        setMessages(prev => prev.filter(msg => msg.timestamp < lastUserMessage.timestamp));
        setError(null);
        sendMessage(userMessageContent);
      }
    }
  }, [messages, sendMessage]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
    setIsLoading(false);
    if (streamingIntervalRef.current) {
      clearInterval(streamingIntervalRef.current);
      streamingIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (streamingIntervalRef.current) {
        clearInterval(streamingIntervalRef.current);
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    retryLastMessage,
    clearMessages,
    messagesEndRef,
  };
}
