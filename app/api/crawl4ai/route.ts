import { type NextRequest, NextResponse } from 'next/server';

// URL of the Crawl4AI agent server. Must be defined in the environment.
const { CRAWL4AI_AGENT_URL } = process.env;

export async function POST(req: NextRequest) {
  try {
    // Assume frontend sends { tool: string, args: object }
    const { tool, args } = await req.json();

    const endpoint = CRAWL4AI_AGENT_URL;
    if (!endpoint) {
      return NextResponse.json(
        { error: 'CRAWL4AI_AGENT_URL environment variable not set' },
        { status: 500 }
      );
    }

    // Proxy the request to the Crawl4ai Agent
    const response = await fetch(`${endpoint}/${tool}`, {
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
