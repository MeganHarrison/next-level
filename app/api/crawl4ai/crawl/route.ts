import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.text();
  const res = await fetch('https://agent-crawl4ai-rag.onrender.com/crawl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  });
  const data = await res.json();
  return NextResponse.json(data);
}
