import { type NextRequest, NextResponse } from 'next/server';

// TODO: change to the correct URL
const CRAWL4AI_AGENT_URL = 'https://agent-crawl4ai-rag-1.onrender.com';

export async function POST(req: NextRequest) {
  try {
    // Assume frontend sends { tool: string, args: object }
    const { tool, args } = await req.json();

    // Proxy the request to the Crawl4ai Agent
    const response = await fetch(`${CRAWL4AI_AGENT_URL}/${tool}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Agent error: ${error}` }, { status: 500 });
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}