import { openai } from '@ai-sdk/openai';
import { experimental_createMCPClient, streamText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const sseUrl = process.env.MCP_ZAPIER_SSE_URL;
  if (!sseUrl) {
    throw new Error('MCP_ZAPIER_SSE_URL not configured');
  }

  const mcpClient = await experimental_createMCPClient({
    transport: {
      type: 'sse',
      url: sseUrl,
    },
  });

  try {
    const zapierTools = await mcpClient.tools();

    const result = streamText({
      model: openai('gpt-4o'),
      messages,
      tools: zapierTools,
      onFinish: async () => {
        await mcpClient.close();
      },
      maxSteps: 10,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    return new Response('Internal Server Error', { status: 500 });
  }
}
