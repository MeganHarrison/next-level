
"use server"

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import util from "node:util"

// Define types for chat messages and conversations
type ChatMessage = {
  id: string
  created_at: string
  session_id: string
  message: any
}

type Conversation = {
  id: string
  title: string | null
  created_at: string
  updated_at: string
  message_count?: number
}

// Function to get chat history for a session
export async function getChatHistory(sessionId: string): Promise<ChatMessage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true })

    if (error) {
      console.error("Error fetching chat history:", util.inspect(error, { showHidden: true, depth: null }))
      throw new Error(error.message || JSON.stringify(error))
    }

    return data || []
  } catch (error) {
    console.error("Error getting chat history:", error)
    return []
  }
}

// Function to save a chat message
export async function saveChatMessage(message: {
  content: any
  session_id: string
}) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("messages").insert({
      message: message.content,
      session_id: message.session_id,
    })

    if (error) {
      console.error("Error saving chat message:", util.inspect(error, { showHidden: true, depth: null }))
      throw new Error(error.message || JSON.stringify(error))
    }

    revalidatePath("/chat")
  } catch (error) {
    console.error("Error saving chat message:", error)
    throw error
  }
}

// Function to clear chat history for a session
export async function clearChatHistory(sessionId: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from("messages").delete().eq("session_id", sessionId)

    if (error) {
      console.error("Error clearing chat history:", util.inspect(error, { showHidden: true, depth: null }))
      throw new Error(error.message || JSON.stringify(error))
    }

    revalidatePath("/chat")
  } catch (error) {
    console.error("Error clearing chat history:", error)
    throw error
  }
}

// Function to get conversations
export async function getConversations(): Promise<Conversation[]> {
  try {
    const supabase = await createClient()

    const { data: conversations, error } = await supabase
      .from("conversations")
      .select("*")
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching conversations:", util.inspect(error, { showHidden: true, depth: null }))
      throw new Error(error.message || JSON.stringify(error))
    }

    if (!conversations || conversations.length === 0) {
      return []
    }

    // Count messages for each conversation
    const conversationsWithCounts: Conversation[] = await Promise.all(
      conversations.map(async (conversation) => {
        const { count, error: countError } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("session_id", conversation.id)

        if (countError) {
          console.error(`Error counting messages for conversation ${conversation.id}:`, countError)
          return { ...conversation, message_count: 0 }
        }

        return { ...conversation, message_count: count || 0 }
      }),
    )

    return conversationsWithCounts
  } catch (error) {
    console.error("Error getting conversations:", error)
    return []
  }
}

// Function to create a new conversation
export async function createConversation(title: string): Promise<string> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("conversations")
      .insert({ title: title })
      .select("id")
      .single()

    if (error) {
      console.error("Error creating conversation:", util.inspect(error, { showHidden: true, depth: null }))
      const errorMessage = error.message || JSON.stringify(error, Object.getOwnPropertyNames(error)) || "Unknown error creating conversation"
      throw new Error(errorMessage)
    }

    revalidatePath("/chat")
    return data.id
  } catch (error) {
    console.error("Error creating conversation:", error)
    throw error
  }
}

// Function to update a conversation
export async function updateConversation(conversationId: string, title: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from("conversations")
      .update({ title: title, updated_at: new Date().toISOString() })
      .eq("id", conversationId)

    if (error) {
      console.error("Error updating conversation:", error)
      throw new Error(error.message || JSON.stringify(error))
    }

    revalidatePath("/chat")
  } catch (error) {
    console.error("Error updating conversation:", error)
    throw error
  }
}
