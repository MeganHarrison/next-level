"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChatMessageItem } from "@/components/chat-message";
import { useInfiniteQuery } from "@/hooks/use-infinite-query";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AgentPage() {
  const [sessionId] = useState(() => {
    if (typeof crypto !== "undefined") return crypto.randomUUID();
    return Math.random().toString(36);
  });
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const docs = useInfiniteQuery<{ id: string; content: string }>({
    tableName: "Documents",
    columns: "id, content",
    pageSize: 10,
    trailingQuery: (q) => q.order("created_at", { ascending: false }),
  });

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
    const res = await fetch("/api/agent", {
      method: "POST",
      body: JSON.stringify({ message: userMessage.content, sessionId }),
    });
    const data = await res.json();
    const aiMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: data.output,
    };
    setMessages((m) => [...m, aiMessage]);
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">AI Agent</h1>
      <div
        ref={containerRef}
        className="flex flex-col gap-2 flex-1 overflow-y-auto h-80 border p-2 rounded"
      >
        {messages.map((m, idx) => (
          <ChatMessageItem
            key={m.id}
            message={{
              id: m.id,
              content: m.content,
              createdAt: new Date().toISOString(),
              user: { name: m.role === "user" ? "You" : "AI" },
            }}
            isOwnMessage={m.role === "user"}
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
      <div className="mt-8">
        <h2 className="font-semibold mb-2">Uploaded Documents</h2>
        <ul className="space-y-1">
          {docs.data.map((doc) => (
            <li key={doc.id} className="text-sm border-b pb-1">
              {doc.content.slice(0, 60)}
            </li>
          ))}
        </ul>
        {docs.hasMore && (
          <Button
            onClick={docs.fetchNextPage}
            disabled={docs.isFetching}
            className="mt-2"
          >
            Load more
          </Button>
        )}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="file"
            accept="text/plain"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const text = await file.text();
              await fetch("/api/documents", {
                method: "POST",
                body: JSON.stringify({ content: text }),
              });
              docs.fetchNextPage();
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
