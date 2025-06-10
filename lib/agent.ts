import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { createRetrieverTool, DynamicStructuredTool } from "langchain/tools";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { InMemoryChatMessageHistory } from "@langchain/core/chat_history";
import { BufferMemory } from "langchain/memory";
import { z } from "zod";

export async function runAgent(message: string, sessionId: string) {
  const client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const { data: historyRows } = await client
    .from("ChatMessages")
    .select("role, content")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  const history = new InMemoryChatMessageHistory();
  if (historyRows) {
    for (const row of historyRows) {
      if (row.role === "user") {
        await history.addUserMessage(row.content);
      } else {
        await history.addAIChatMessage(row.content);
      }
    }
  }

  const memory = new BufferMemory({
    chatHistory: history,
    returnMessages: true,
    memoryKey: "chat_history",
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "Documents",
    queryName: "match_documents",
  });

  const retrieverTool = createRetrieverTool(vectorStore.asRetriever(), {
    name: "search_documents",
    description: "Searches user uploaded documents for relevant information",
  });

  const summarizerTool = new DynamicStructuredTool({
    name: "summarize",
    description: "Summarize text snippets",
    schema: z.object({ text: z.string() }),
    func: async ({ text }) => {
      const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });
      const res = await llm.invoke(`Summarize the following text:\n\n${text}`);
      return res.content;
    },
  });

  const llm = new ChatOpenAI({ openAIApiKey: process.env.OPENAI_API_KEY });

  const executor = await initializeAgentExecutorWithOptions(
    [retrieverTool, summarizerTool],
    llm,
    {
      agentType: "openai-functions",
      memory,
    },
  );

  const { output } = await executor.invoke({ input: message });

  await client.from("ChatMessages").insert([
    { session_id: sessionId, role: "user", content: message },
    { session_id: sessionId, role: "assistant", content: output },
  ]);

  return { output };
}
