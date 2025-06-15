"use server"

import OpenAI from "openai"
import { queryDocumentEmbeddings } from "@/app/actions/document-embedding-actions"

export type SimpleChatMessage = { content: string }

export async function askStrategistAgent(question: string, history: SimpleChatMessage[]) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    // Get embedding for the question
    const embed = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: question,
    })
    const queryEmbedding = embed.data[0].embedding

    // Fetch relevant context from Supabase
    const search = await queryDocumentEmbeddings(queryEmbedding, 5)
    const contextText = search.success && search.data
      ? (search.data as { content: string }[]).map((r) => r.content).join("\n---\n")
      : ""

    // Map simple messages to OpenAI ChatCompletionMessageParam with role
    const messages = [
      {
        role: "system" as const,
        content: contextText
          ? `Use the following context when answering questions:\n${contextText}`
          : "You are a helpful business strategist.",
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
      context: search.data,
    }
  } catch (error) {
    console.error("Error in askStrategistAgent:", error)
    console.error("Error type:", typeof error)
    console.error("Error keys:", Object.keys(error || {}))
    if (error instanceof Error) {
      return { success: false, error: error.message }
    }
    return { success: false, error: JSON.stringify(error) }
  }
}
