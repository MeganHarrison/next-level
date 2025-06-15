"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Copy, Download, ThumbsUp, ThumbsDown, Send, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { getCurrentTimestamp, type ChatMessage } from "@/lib/api"
import { LoadingDots } from "@/components/loading-dots"

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "agent",
      content: "Hello, I am a generative AI agent. How may I assist you today?",
      timestamp: getCurrentTimestamp(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    // Reset error state
    setError(null)

    // Add user message
    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: getCurrentTimestamp(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // Try the improved API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
        }),
      })

      const data = await response.json()

      // If the response is not OK, throw an error
      if (!response.ok) {
        throw new Error(data.error || `Error: ${response.status}`)
      }

      // Extract the message from the response
      const responseMessage = data.response || "No response from agent"

      // Add agent response
      const agentMessage: ChatMessage = {
        role: "agent",
        content: responseMessage,
        timestamp: getCurrentTimestamp(),
      }

      setMessages((prev) => [...prev, agentMessage])
    } catch (error) {
      console.error("Error sending message:", error)

      // Set error state
      setError(error instanceof Error ? error.message : "Unknown error occurred")

      // Handle error
      const errorMessage: ChatMessage = {
        role: "agent",
        content:
          error instanceof Error
            ? `Sorry, I encountered an error: ${error.message}`
            : "Sorry, I encountered an error while processing your request. Please try again later.",
        timestamp: getCurrentTimestamp(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {error && (
        <div className="bg-destructive/10 text-destructive p-3 text-sm font-light flex items-center">
          <AlertCircle className="h-4 w-4 mr-2" />
          Error: {error}
        </div>
      )}
      <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.map((message) => (
            <div key={message.timestamp} className={cn("flex gap-4 max-w-[90%]", message.role === "user" ? "ml-auto" : "")}>
              {message.role === "agent" && (
                <div className="h-8 w-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center">
                  <span className="text-xs font-light text-background">AI</span>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-light tracking-wide">
                    {message.role === "agent" ? "GENERATIVE" : "USER"}
                  </span>
                  <span className="text-xs text-muted-foreground font-light">{message.timestamp}</span>
                </div>
                <div className={cn("p-4 rounded-sm", message.role === "agent" ? "bg-accent" : "bg-secondary")}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap font-light">{message.content}</p>
                </div>
                {message.role === "agent" && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-sm"
                      onClick={() => navigator.clipboard.writeText(message.content)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-sm">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 max-w-[90%]">
              <div className="h-8 w-8 rounded-full bg-foreground flex-shrink-0 flex items-center justify-center">
                <span className="text-xs font-light text-background">AI</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-light tracking-wide">GENERATIVE</span>
                  <span className="text-xs text-muted-foreground font-light">{getCurrentTimestamp()}</span>
                </div>
                <div className="p-4 rounded-sm bg-accent flex items-center">
                  <LoadingDots className="mr-2" />
                  <p className="text-sm font-light">Thinking...</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-6 border-t border-border">
        <div className="flex gap-3 max-w-3xl mx-auto">
          <Textarea
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            className="min-h-[44px] max-h-32 bg-accent border-0 focus-visible:ring-1 focus-visible:ring-ring rounded-sm font-light"
          />
          <Button
            className="px-6 rounded-sm font-light"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? <LoadingDots /> : <Send className="h-4 w-4 mr-2" />}
            {isLoading ? "" : "Send"}
          </Button>
        </div>
      </div>
    </div>
  )
}
