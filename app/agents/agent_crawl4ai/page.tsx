'use client';

import React, { useState } from 'react';
import CrawlUrlForm from '../../../components/CrawlUrlForm';

const TOOL_FORMS: { [tool: string]: { label: string; argKey: string }[] } = {
  perform_rag_query: [{ label: 'Query', argKey: 'query' }],
  crawl_single_page: [{ label: 'URL', argKey: 'url' }],
  smart_crawl_url: [{ label: 'URL', argKey: 'url' }],
  get_available_sources: [], // No args
  // Add more tools and their argument structure as needed
};

export default function Crawl4aiAgentPage() {
  const [tool, setTool] = useState('perform_rag_query');
  const [args, setArgs] = useState<{ [key: string]: any }>({});
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setArgs(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/crawl4ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool, args }),
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto', padding: 32 }}>
      <h1>Crawl4ai Agent</h1>
      <CrawlUrlForm />
      <form onSubmit={handleSubmit}>
        <label>
          Tool:
          <select
            value={tool}
            onChange={e => {
              setTool(e.target.value);
              setArgs({});
            }}
          >
            {Object.keys(TOOL_FORMS).map(toolName => (
              <option key={toolName} value={toolName}>
                {toolName}
              </option>
            ))}
          </select>
        </label>
        {TOOL_FORMS[tool]?.map(({ label, argKey }) => (
          <div key={argKey}>
            <label>
              {label}:
              <input
                type="text"
                value={args[argKey] || ''}
                onChange={e => handleInputChange(argKey, e.target.value)}
                required
              />
            </label>
          </div>
        ))}
        <button type="submit" disabled={loading}>
          {loading ? 'Working...' : 'Run Agent'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 32 }}>
          <h2>Result</h2>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}