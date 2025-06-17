import { openai } from '@ai-sdk/openai';
import { appendResponseMessages, createIdGenerator, streamText } from 'ai';
import { loadChat, saveChat } from '@/utils/chat-store';
import { deleteChatById } from '@/lib/db/queries';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { id, message } = await req.json();

  const previousMessages = await loadChat(id);
  const messages = [...previousMessages, message];

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    experimental_generateMessageId: createIdGenerator({
      prefix: 'msgs',
      size: 16,
    }),
    async onFinish({ response }) {
      await saveChat({
        id,
        messages: appendResponseMessages({
          messages,
          responseMessages: response.messages,
        }),
      });
    },
  });

  return result.toDataStreamResponse();
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return new Response(JSON.stringify({ error: 'id is required' }), {
      status: 400,
    });
  }

  try {
    await deleteChatById({ id });
    return new Response(null, { status: 204 });
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to delete chat' }), {
      status: 500,
    });
  }
}
