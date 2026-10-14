import { openai } from "@ai-sdk/openai";
import { experimental_createMCPClient, streamText } from "ai";
import { NextResponse } from "next/server";

export const maxDuration = 30;

export async function POST(req: Request) {
  const sseUrl = process.env.MCP_ZAPIER_SSE_URL;
  if (!sseUrl) {
    return NextResponse.json(
      { error: "MCP_ZAPIER_SSE_URL is not configured" },
      { status: 503 },
    );
  }

  try {
    const { messages } = await req.json();
    const mcpClient = await experimental_createMCPClient({
      transport: {
        type: "sse",
        url: sseUrl,
      },
    });
    const zapierTools = await mcpClient.tools();

    const result = streamText({
      model: openai("gpt-4o"),
      messages,
      tools: zapierTools,
      onFinish: async () => {
        await mcpClient.close();
      },
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error("Zapier MCP route error:", error);
    return NextResponse.json(
      { error: "Failed to connect to the Zapier MCP service" },
      { status: 502 },
    );
  }
}
