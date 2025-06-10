"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessageItem } from "@/components/chat-message";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ExpertChatPage() {
  const [input, setInput] = useState("");
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
      role: "user",
      content: input,
    };
    setMessages((m) => [...m, userMessage]);
    setInput("");
    try {
      const res = await fetch(
        "https://agents.nextlevelaiagents.com/webhook/trigger-expert-chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: userMessage.content }),
        },
      );
      const text = await res.text();
      let content = text;
      try {
        const data = JSON.parse(text);
        content = (data.output ?? data.message ?? text) as string;
      } catch {
        // not JSON, keep text
      }
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
      };
      setMessages((m) => [...m, aiMessage]);
    } catch {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Error fetching response.",
      };
      setMessages((m) => [...m, aiMessage]);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Expert Chat</h1>
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
              user: { name: m.role === "user" ? "You" : "AI" },
            }}
            isOwnMessage={m.role === "user"}
            showHeader
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
    </div>
  );
}
