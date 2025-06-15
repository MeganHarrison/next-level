"use server"

import OpenAI from "openai"
import { createClient } from "@/utils/supabase/server"

export type ChatMessage = { role: "user" | "assistant"; content: string }

/**
 * Query the crawled_pages table using OpenAI embeddings and return an answer.
 */
export async function askDocumentationAgent(
  question: string,
  history: ChatMessage[] = [],
  matchCount = 5
) {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const supabase = createClient()

    // Create embedding for the question
    const embed = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: question,
    })
    const queryEmbedding = embed.data[0].embedding

    // Query Supabase for relevant chunks
    const { data: matches, error } = await supabase.rpc("match_crawled_pages", {
      query_embedding: queryEmbedding,
      match_count: matchCount,
    })
    if (error) throw error

    const contextText = matches
      ? (matches as any[]).map((r) => r.content).join("\n---\n")
      : ""

    const messages = [
      {
        role: "system" as const,
        content: contextText
          ? `Use the following context to answer user questions:\n${contextText}`
          : "You are a documentation assistant.",
      },
      ...history,
      { role: "user" as const, content: question },
    ]

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.3,
      max_tokens: 500,
    })

    return {
      success: true,
      answer: completion.choices[0].message.content,
      context: matches,
    }
  } catch (error) {
    console.error("askDocumentationAgent error", error)
    return { success: false, error: (error as Error).message }
  }
}

/**
 * Trigger the Crawl4AI MCP server to crawl a website.
 * The server URL should be provided via the CRAWL4AI_MCP_URL env variable.
 */
export async function crawlWebsite(url: string) {
  try {
    const endpoint = process.env.CRAWL4AI_MCP_URL
    if (!endpoint) {
      throw new Error("CRAWL4AI_MCP_URL environment variable not set")
    }

    const res = await fetch(`${endpoint}/smart_crawl_url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`Server error: ${text}`)
    }

    const data = await res.json()
    return { success: true, data }
  } catch (error) {
    console.error("crawlWebsite error", error)
    return { success: false, error: (error as Error).message }
  }
}
