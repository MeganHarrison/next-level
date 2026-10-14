import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const webhookUrl = process.env.N8N_RAG_URL;
  if (!webhookUrl) {
    return NextResponse.json(
      { error: "N8N_RAG_URL is not configured" },
      { status: 503 },
    );
  }

  try {
    const body = await req.json();

    const n8nRes = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.N8N_API_KEY
          ? { N8N_API_KEY: process.env.N8N_API_KEY }
          : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await n8nRes.json();

    return NextResponse.json(data, { status: n8nRes.status });
  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
