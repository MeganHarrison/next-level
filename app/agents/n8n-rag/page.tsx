'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Message = {
  id: string;
  role: 'user' | 'assistant' | 'loading';
  content: string;
};

export default function N8nRagPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput || isLoading) return;

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: trimmedInput,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const loadingMessage: Message = {
      id: `${Date.now()}-loading`,
      role: 'loading',
      content: 'Waiting for expert response...',
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      const res = await fetch('/api/n8n-rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmedInput }),
      });

      const data = await res.json();

      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));

      if (!res.ok) {
        throw new Error(data.error || `Error ${res.status}`);
      }

      const assistantMessage: Message = {
        id: `${Date.now()}-assistant`,
        role: 'assistant',
        content: data.response || 'No response received.',
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingMessage.id));
      setMessages((prev) => [
        ...prev,
        {
          id: `${Date.now()}-assistant`,
          role: 'assistant',
          content: `Error: ${(error as Error).message}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.role === 'user' ? 'bg-blue-100' : msg.role === 'assistant' ? 'bg-gray-100' : 'bg-yellow-50'
              }`}
            >
              {msg.role === 'loading' ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{msg.content}</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{msg.content}</div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 bg-white border-t flex items-center space-x-2">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question..."
          className="flex-1 resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button type="submit" disabled={isLoading || !input.trim()} className="h-10 w-10 p-0 rounded-full">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}