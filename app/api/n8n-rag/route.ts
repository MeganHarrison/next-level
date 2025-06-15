import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const n8nRes = await fetch('https://agents.nextlevelaiagents.com/webhook/trigger-expert-chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'N8N_API_KEY': process.env.N8N_API_KEY as string,
      },
      body: JSON.stringify(body),
    });

    const data = await n8nRes.json();

    return NextResponse.json(data, { status: n8nRes.status });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}