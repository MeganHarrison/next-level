'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatMessageItem } from '@/components/chat-message';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Crawl4aiChat() {
  const [sessionId] = useState(() => {
    if (typeof crypto !== 'undefined') return crypto.randomUUID();
    return Math.random().toString(36);
  });
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
    };
    setMessages((m) => [...m, userMessage]);
    setInput('');
    try {
      const res = await fetch('/api/crawl4ai/chat', {
        method: 'POST',
        body: JSON.stringify({ message: userMessage.content, session_id: sessionId }),
      });
      const data = await res.json();
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.output || data.response || data.message || '',
      };
      setMessages((m) => [...m, aiMessage]);
    } catch (err) {
      console.error(err);
    }
  };

  const submitUrl = async () => {
    if (!url.trim()) return;
    try {
      await fetch('/api/crawl4ai/crawl', {
        method: 'POST',
        body: JSON.stringify({ url }),
      });
      setUrl('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-xl font-semibold">Crawl4ai Chat</h2>
      <div
        ref={containerRef}
        className="flex flex-col gap-2 flex-1 overflow-y-auto h-80 border p-2 rounded"
      >
        {messages.map((m) => (
          <ChatMessageItem
            key={m.id}
            message={{
              id: m.id,
              content: m.content,
              createdAt: new Date().toISOString(),
              user: { name: m.role === 'user' ? 'You' : 'AI' },
            }}
            isOwnMessage={m.role === 'user'}
            showHeader={true}
          />
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Say something..."
        />
        <Button onClick={sendMessage}>Send</Button>
      </div>
      <div className="flex gap-2 items-end">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL to crawl"
        />
        <Button onClick={submitUrl}>Crawl</Button>
      </div>
    </div>
  );
}

