"use client";
import React, { useState, type KeyboardEvent, type ChangeEvent } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
  isHtml?: boolean;
};

export default function RagChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");

    setMessages((msgs) => [...msgs, { role: "user", content: input }]);
    try {
      const res = await fetch("/api/rag-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: input }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "No answer found.");
      setMessages((msgs) => [
        ...msgs,
        {
          role: "assistant",
          content:
            data.results?.map(
              (r: { content: string; url: string }, i: number) =>
                `<div key=${i}><b>Result ${i + 1}:</b> ${r.content}<br/><small>Source: <a href="${r.url}" target="_blank">${r.url}</a></small></div>`
            ).join("<hr/>") || "No answer found.",
          isHtml: true,
        },
      ]);
    } catch (err: unknown) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
    setInput("");
    setLoading(false);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value);
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div>
      <div style={{ minHeight: 200, border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
        {messages.map((msg, i) =>
          msg.isHtml ? (
            <div key={i} dangerouslySetInnerHTML={{ __html: msg.content }} />
          ) : (
            <div key={i} style={{ textAlign: msg.role === "user" ? "right" : "left" }}>
              <b>{msg.role === "user" ? "You" : "RAG"}:</b> {msg.content}
            </div>
          )
        )}
        {loading && <div><i>Loading...</i></div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
      </div>
      <input
        value={input}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={loading}
        style={{ width: "80%" }}
        placeholder="Ask a question about the docs..."
      />
      <button type="button" onClick={sendMessage} disabled={loading || !input.trim()}>
        Send
      </button>
    </div>
  );
}
