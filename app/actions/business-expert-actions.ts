"use server"

import OpenAI from "openai"
import { createClient } from "@/utils/supabase/server"

export type SimpleChatMessage = { content: string }

export async function askBusinessExpert(
  question: string,
  history: SimpleChatMessage[],
) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const embed = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    })
    const queryEmbedding = embed.data[0].embedding

    const supabase = createClient()
    const { data: matches, error } = await supabase.rpc("match_documents", {
      query_embedding: queryEmbedding,
      match_count: 5,
    })
    if (error) throw error

    const contextText = matches
      ? (matches as { content: string }[]).map((r) => r.content).join("\n---\n")
      : ""

    const messages = [
      {
        role: "system" as const,
        content: contextText
          ? `Use the following context to answer user questions:\n${contextText}`
          : "You are a helpful business expert.",
      },
      ...history.map((msg) => ({ role: "user" as const, content: msg.content })),
      { role: "user" as const, content: question },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    return {
      success: true,
      answer: completion.choices[0].message.content,
      context: matches,
    }
  } catch (error) {
    console.error("Error in askBusinessExpert:", error)
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: JSON.stringify(error) }
  }
}
