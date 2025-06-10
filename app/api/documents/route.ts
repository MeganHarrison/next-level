import { NextResponse } from "next/server";
import { createClient as createSB } from "@supabase/supabase-js";
import { OpenAIEmbeddings } from "@langchain/openai";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export async function POST(req: Request) {
  const data = await req.json();
  const { content } = data;
  if (!content)
    return NextResponse.json({ error: "no content" }, { status: 400 });

  const sb = createSB(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client: sb,
    tableName: "Documents",
    queryName: "match_documents",
  });

  await vectorStore.addDocuments([{ pageContent: content, metadata: {} }]);

  return NextResponse.json({ status: "ok" });
}
