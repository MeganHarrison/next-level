"use client";

import { FormEvent, useEffect, useRef, useState } from 'react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ExpertChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userText = input.trim();
    if (!userText) return;
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userText }]);
    setInput('');
    // Placeholder for assistant
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    const assistantIndex = messages.length + 1;

    try {
      const response = await fetch(
        'https://agents.nextlevelaiagents.com/webhook/trigger-expert-chat',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: userText }),
        }
      );
      if (!response.ok) {
        const err = await response.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex].content = `Error: ${err}`;
          return copy;
        });
      } else if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            setMessages((prev) => {
              const copy = [...prev];
              copy[assistantIndex].content += chunk;
              return copy;
            });
          }
        }
      } else {
        const text = await response.text();
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex].content = text;
          return copy;
        });
      }
    } catch (error: any) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[assistantIndex].content = `Error: ${error.message || error}`;
        return copy;
      });
    }
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto p-4">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 bg-white p-4 rounded-lg shadow"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[70%] whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-lg px-4 py-2 outline-none"
          placeholder="Type your message..."
        />
        <button
          type="submit"
          className="bg-blue-600 text-white rounded-r-lg px-4 py-2 disabled:opacity-50"
          disabled={!input.trim()}
        >
          Send
        </button>
      </form>
    </div>
  );
}