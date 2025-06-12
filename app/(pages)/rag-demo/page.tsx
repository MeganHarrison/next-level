// app/rag-demo/page.tsx

'use client';

import React, { useState } from 'react';

export default function RagDemoPage() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setAnswer(null);
    setSources([]);
    try {
      const res = await fetch('https://cloud.digitalocean.com/gen-ai/agents/1f161778-24dd-11f0-bf8f-4e013e2ddde4', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error('Failed to get answer');
      const data = await res.json();
      setAnswer(data.answer);
      setSources(data.sources || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-center">RAG Demo (Supabase + OpenAI)</h1>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-3 border rounded-xl"
          type="text"
          placeholder="Ask me anything..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <button
          className="px-4 py-2 bg-black text-white rounded-xl"
          type="submit"
          disabled={loading || !question.trim()}
        >
          {loading ? 'Thinking...' : 'Ask'}
        </button>
      </form>

      {error && (
        <div className="bg-red-100 text-red-600 p-3 rounded-xl">{error}</div>
      )}

      {answer && (
        <div>
          <h2 className="font-semibold mb-1">Answer</h2>
          <div className="p-3 border rounded-xl bg-gray-50">{answer}</div>
        </div>
      )}

      {sources.length > 0 && (
        <div>
          <h2 className="font-semibold mb-1">Sources</h2>
          <ul className="space-y-2">
            {sources.map((src, idx) => (
              <li key={src.id || idx} className="p-2 border rounded bg-gray-100">
                <div className="font-mono text-xs text-gray-500 mb-1">
                  Source ID: {src.id}
                </div>
                <div>{src.content}</div>
                {src.metadata && (
                  <div className="mt-1 text-xs text-gray-400">
                    {JSON.stringify(src.metadata)}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}