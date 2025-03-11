import { useState, useCallback, useEffect } from 'react';
import { Message, ModelType } from '../types/chat';

interface UseChatOptions {
  initialMessages?: Message[];
  model?: ModelType;
  temperature?: number;
  maxTokens?: number;
  streamResponse?: boolean;
}

interface UseChatResult {
  messages: Message[];
  input: string;
  setInput: (input: string) => void;
  handleSend: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  selectedFiles: File[];
  handleFileSelect: (files: File[]) => void;
  handleFileRemove: (file: File) => void;
  clearChat: () => void;
}

export function useChat({
  initialMessages = [],
  model = 'mistral-small',
  temperature = 0.7,
  maxTokens = 1000,
  streamResponse = true,
}: UseChatOptions = {}): UseChatResult {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Clean up abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  const handleFileSelect = useCallback((files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
  }, []);

  const handleFileRemove = useCallback((fileToRemove: File) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
  }, []);

  const handleSend = useCallback(async () => {
    if (input.trim() === '' && selectedFiles.length === 0) return;
    
    // Create a new abort controller for this request
    const controller = new AbortController();
    setAbortController(controller);

    try {
      setIsLoading(true);
      setError(null);

      // Create user message
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input,
        timestamp: new Date(),
        attachments: selectedFiles.length > 0 ? [...selectedFiles] : undefined,
        isNew: true,
      };

      // Add user message to state
      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setSelectedFiles([]);

      // Add system message to instruct the model about code formatting
      const systemMessage: Message = {
        id: 'system-1',
        role: 'system',
        content: 'When including code in your responses, always wrap it in triple backticks with the appropriate language identifier. For example: ```python\nprint("Hello World")\n``` or ```javascript\nconsole.log("Hello World");\n```',
        timestamp: new Date(),
      };

      // Prepare messages for API (excluding attachments)
      const apiMessages = [systemMessage, ...messages, userMessage].map(({ id, role, content, timestamp, ...rest }) => ({
        id,
        role,
        content,
        timestamp,
      }));

      // Create placeholder for assistant response
      const assistantMessageId = (Date.now() + 1).toString();
      const assistantMessage: Message = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
        isNew: true,
      };

      // Add empty assistant message if streaming
      if (streamResponse) {
        setMessages(prev => [...prev, assistantMessage]);
      }

      if (streamResponse) {
        // Handle streaming response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
            model: `${model}-latest`,
            temperature,
            maxTokens,
            stream: true,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to send message');
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error('Response body is null');

        const decoder = new TextDecoder();
        let responseText = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk
            .split('\n')
            .filter(line => line.trim() !== '' && line.startsWith('data: '));

          for (const line of lines) {
            const jsonStr = line.replace('data: ', '').trim();
            if (jsonStr === '[DONE]') continue;

            try {
              const json = JSON.parse(jsonStr);
              const content = json.choices[0]?.delta?.content || '';
              if (content) {
                responseText += content;
                // Update the assistant message with the new content
                setMessages(prev => 
                  prev.map(msg => 
                    msg.id === assistantMessageId 
                      ? { ...msg, content: responseText } 
                      : msg
                  )
                );
              }
            } catch (e) {
              console.error('Error parsing JSON from stream:', e);
            }
          }
        }
      } else {
        // Handle non-streaming response
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: apiMessages,
            model: `${model}-latest`,
            temperature,
            maxTokens,
            stream: false,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to send message');
        }

        const data = await response.json();
        const content = data.choices[0].message.content;

        // Add assistant response
        setMessages(prev => [
          ...prev,
          {
            id: assistantMessageId,
            role: 'assistant',
            content,
            timestamp: new Date(),
            isNew: true,
          },
        ]);
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        console.error('Error in chat:', err);
        setError(err.message);
        
        // Remove the empty assistant message if there was an error
        setMessages(prev => prev.filter(msg => msg.content !== ''));
      }
    } finally {
      setIsLoading(false);
      setAbortController(null);
    }
  }, [input, messages, selectedFiles, model, temperature, maxTokens, streamResponse]);

  return {
    messages,
    input,
    setInput,
    handleSend,
    isLoading,
    error,
    selectedFiles,
    handleFileSelect,
    handleFileRemove,
    clearChat,
  };
} 