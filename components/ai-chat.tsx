"use client"

import { useState } from "react"
import { BotIcon, X } from "lucide-react"
import { cn } from "@/lib/utils" // Tailwind class helper

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 rounded-full bg-black text-white p-4 shadow-lg hover:scale-105 transition-transform"
      >
        {isOpen ? <X className="w-5 h-5" /> : <BotIcon className="w-5 h-5" />}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[500px] bg-white border border-gray-200 rounded-xl shadow-2xl z-40 flex flex-col overflow-hidden">
          {/* Replace this with your actual chat component */}
          <div className="flex-1 p-4 overflow-y-auto">Hello! How can I help?</div>
          <div className="p-4 border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>
      )}
    </>
  )
}