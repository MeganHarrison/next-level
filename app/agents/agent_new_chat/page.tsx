"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Loader2, History, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { askStrategistAgent } from "@/app/actions/strategist-agent-actions"
import {
  getChatHistory,
  saveChatMessage,
  clearChatHistory,
  getConversations,
  createConversation,
  updateConversation,
} from "@/app/actions/chat-history-actions"
import { createClient } from "@/utils/supabase/client"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"


type ChatMessage = {
  id: string
  content: any
  created_at: string
  session_id: string
}

type Conversation = {
  id: string
  title: string | null
  created_at: string
  updated_at: string
  message_count?: number
}

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSessionsDialog, setShowSessionsDialog] = useState(false)
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Check if tables exist and create them if needed
  useEffect(() => {
    async function checkTables() {
      try {
        await fetch("/api/check-chat-tables")
      } catch (error) {
        console.error("Error checking tables:", error)
      }
    }

    checkTables()
  }, [])

  // Load conversations
  useEffect(() => {
    async function loadConversations() {
      try {
        const { data: userData } = await supabase.auth.getUser()
        if (!userData.user) {
          setIsLoadingHistory(false)
          return
        }

        const convos = await getConversations()
        setConversations(convos)

        // If there are conversations, load the most recent one
        if (convos.length > 0) {
          loadChatSession(convos[0].id)
        } else {
          setIsLoadingHistory(false)
        }
      } catch (error) {
        console.error("Error loading conversations:", error)
        setIsLoadingHistory(false)
        toast.error("Failed to load conversations. Please try again later.")
      }
    }

    loadConversations()
  }, [supabase])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Load a specific chat session
  const loadChatSession = async (sessionId: string) => {
    setIsLoadingHistory(true)
    try {
      const history = await getChatHistory(sessionId)
    setMessages(
      history.map((msg) => ({
        id: msg.id,
        content: msg.message,
        created_at: msg.created_at,
        session_id: msg.session_id || "",
      })),
    )
      setCurrentSessionId(sessionId)
    } catch (error) {
      console.error("Error loading chat history:", error)
      toast.error("Failed to load chat history")
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Create a new conversation
  const startNewChat = async () => {
    try {
      const { data: userData } = await supabase.auth.getUser()
      if (!userData.user) {
        toast.error("Authentication Required: Please log in to start a new chat")
        return
      }

      const conversationId = await createConversation("New Conversation")
      setMessages([])
      setCurrentSessionId(conversationId)

      // Refresh conversations list
      const convos = await getConversations()
      setConversations(convos)

      toast.success("New Chat Started: You can now start a new conversation")
    } catch (error) {
      console.error("Error creating new conversation:", error)
      toast.error("Failed to create new conversation")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    const messageId = Date.now().toString()

    // Check if we need to create a new conversation
    if (!currentSessionId) {
      try {
        // Disabled auth check for now to bypass login redirect
        // const { data: userData } = await supabase.auth.getUser()
        // if (!userData.user) {
        //   toast.error("Authentication Required: Please log in to start a new chat")
        //   return
        // }

        const conversationId = await createConversation(`Chat ${new Date().toLocaleString()}`)
        setCurrentSessionId(conversationId)

        // Refresh conversations list
        const convos = await getConversations()
        setConversations(convos)
      } catch (error) {
        console.error("Error creating conversation:", error)
        toast.error("Failed to create conversation")
        return
      }
    }

    // Add user message to chat
    const userMsg = {
      id: messageId,
      content: userMessage,
      created_at: new Date().toISOString(),
      session_id: currentSessionId || "",
    }

    setMessages((prev) => [...prev, userMsg])

      // Add loading message
      const loadingId = `loading-${messageId}`
    setMessages((prev) => [
      ...prev,
      {
        id: loadingId,
        content: "Processing your request...",
        created_at: new Date().toISOString(),
        session_id: currentSessionId || "",
      },
    ])

      setInput("")
      setIsLoading(true)

    try {
      // Save user message to database
      if (currentSessionId) {
        await saveChatMessage({
          content: userMessage,
          session_id: currentSessionId,
        })

        // Update conversation title if this is the first message
        if (messages.length === 0) {
          const truncatedMessage = `${userMessage.substring(0, 30)}...`
          await updateConversation(currentSessionId, truncatedMessage)

          // Refresh conversations list
          const convos = await getConversations()
          setConversations(convos)
        }
      }

      // Query strategist agent with context
      const historyMessages = messages.map((msg) => ({ role: "user" as const, content: msg.content }))
      const result = await askStrategistAgent(userMessage, historyMessages)

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingId))

      if (!result.success) {
        throw new Error(result.error || "Failed to get response")
      }

      // Extract response
      const responseContent = result.answer || "I\'m sorry, I couldn\'t process your request."

      // Add AI response to chat
      const assistantMsg = {
        id: `assistant-${Date.now().toString()}`,
        content: responseContent,
        created_at: new Date().toISOString(),
        session_id: currentSessionId || "",
      }

      setMessages((prev) => [...prev, assistantMsg])

      // Save assistant message to database
      if (currentSessionId) {
        await saveChatMessage({
          content: responseContent,
          session_id: currentSessionId,
        })
      }
    } catch (error) {
      console.error("Error:", error)

      // Remove loading message
      setMessages((prev) => prev.filter((msg) => msg.id !== loadingId))

      // Add error message to chat
      const errorMsg = {
        id: `error-${Date.now().toString()}`,
        content: `Error: ${(error as Error).message || "Failed to send message"}`,
        created_at: new Date().toISOString(),
        session_id: currentSessionId || "",
      }

      setMessages((prev) => [...prev, errorMsg])

      // Save error message to database
      if (currentSessionId) {
        await saveChatMessage({
          content: `Error: ${(error as Error).message || "Failed to send message"}`,
          session_id: currentSessionId,
        })
      }

      toast.error((error as Error).message || "Failed to send message")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearHistory = async () => {
    if (!currentSessionId) return

    try {
      await clearChatHistory(currentSessionId)
      setMessages([])
      toast.success("Chat Cleared: Your chat history has been cleared")
      setClearConfirmOpen(false)

      // Create a new session
      await startNewChat()
    } catch (error) {
      console.error("Error clearing chat history:", error)
      toast.error("Failed to clear chat history")
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-73px)]">
      <div className="flex justify-between items-center px-8 pt-6 pb-2">
        <h1 className="text-3xl font-didot text-[#333333]">Business Expert</h1>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm" onClick={() => setShowSessionsDialog(true)} type="button">
            <History className="h-4 w-4 mr-2" />
            Chat History
          </Button>

          <Button variant="outline" size="sm" onClick={startNewChat} type="button">
            + New Chat
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" type="button">
                <span className="sr-only">Open menu</span>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
                  <path
                    d="M3.625 7.5C3.625 8.12132 3.12132 8.625 2.5 8.625C1.87868 8.625 1.375 8.12132 1.375 7.5C1.375 6.87868 1.87868 6.375 2.5 6.375C3.12132 6.375 3.625 6.87868 3.625 7.5ZM8.625 7.5C8.625 8.12132 8.12132 8.625 7.5 8.625C6.87868 8.625 6.375 8.12132 6.375 7.5C6.375 6.87868 6.87868 6.375 7.5 6.375C8.12132 6.375 8.625 6.87868 8.625 7.5ZM13.625 7.5C13.625 8.12132 13.1213 8.625 12.5 8.625C11.8787 8.625 11.375 8.12132 11.375 7.5C11.375 6.87868 11.8787 6.375 12.5 6.375C13.1213 6.375 13.625 6.87868 13.625 7.5Z"
                    fill="currentColor"
                    fillRule="evenodd"
                    clipRule="evenodd"
                  />
                </svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setClearConfirmOpen(true)}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear Chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8">
        {isLoadingHistory ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-600">
            <p className="max-w-md text-center">
              Ask me anything about business strategy, operations, marketing, or management.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id || `${message.role}-${message.timestamp.getTime()}`}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] ${
                    message.role === "user"
                      ? "bg-gray-100 rounded-2xl px-4 py-3"
                      : message.role === "error"
                        ? "text-red-600"
                        : message.role === "loading"
                          ? "flex items-center space-x-2"
                          : ""
                  }`}
                >
                  {message.role === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      <span>{message.content}</span>
                    </>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div className="p-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything"
              className="resize-none pr-12 py-3 min-h-[56px] max-h-[200px] border border-gray-300 rounded-xl"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 bottom-2 h-10 w-10 p-0 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Chat Sessions Dialog */}
      <Dialog open={showSessionsDialog} onOpenChange={setShowSessionsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chat History</DialogTitle>
            <DialogDescription>Select a previous conversation to continue</DialogDescription>
          </DialogHeader>
          <div className="max-h-[400px] overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No previous conversations found</div>
            ) : (
              <div className="space-y-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 ${currentSessionId === conversation.id ? "bg-gray-100 border border-gray-200" : ""}`}
                    onClick={() => {
                      loadChatSession(conversation.id)
                      setShowSessionsDialog(false)
                    }}
                    type="button"
                  >
                    <div className="font-medium truncate">{conversation.title}</div>
                    <div className="text-xs text-gray-500 flex justify-between">
                      <span>{format(new Date(conversation.created_at), "MMM d, yyyy")}</span>
                      <span>{conversation.message_count || 0} messages</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSessionsDialog(false)} type="button">
              Cancel
            </Button>
            <Button onClick={startNewChat} type="button">
              New Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearConfirmOpen} onOpenChange={setClearConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Chat History</DialogTitle>
            <DialogDescription>
              Are you sure you want to clear this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setClearConfirmOpen(false)} type="button">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleClearHistory} type="button">
              Clear Chat
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
