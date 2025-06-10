import { NextResponse } from "next/server";
import { runAgent } from "@/lib/agent";

export async function POST(req: Request) {
  const { message, sessionId } = await req.json();
  const result = await runAgent(message, sessionId);
  return NextResponse.json(result);
}
