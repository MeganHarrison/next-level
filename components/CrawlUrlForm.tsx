'use client';

import { useState, type FormEvent } from 'react';

export default function CrawlUrlForm({ onComplete }: { onComplete?: (res: unknown) => void }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    setError(null);

    const res = await fetch('/api/crawl4ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool: 'smart_crawl_url', args: { url } }),
    });

    const data = await res.json();
    if (res.ok) {
      setResult(data);
      onComplete?.(data);
    } else {
      setError(data.error || 'Unknown error');
    }
    setLoading(false);
    setUrl('');
  };

  return (
    <div style={{ marginBottom: 32 }}>
      <h2>Crawl a New Website</h2>
      <form onSubmit={handleSubmit}>
        <label>
          URL to Crawl:
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com"
            required
            style={{ marginLeft: 8 }}
          />
        </label>
        <button type="submit" disabled={loading || !url}>
          {loading ? 'Crawling...' : 'Crawl'}
        </button>
      </form>
      {result && (
        <div style={{ marginTop: 16, color: 'green' }}>
          <strong>Success:</strong> {JSON.stringify(result)}
        </div>
      )}
      {error && (
        <div style={{ marginTop: 16, color: 'red' }}>
          <strong>Error:</strong> {error}
        </div>
      )}
    </div>
  );
}