import React from "react";

export function TypingIndicator() {
  return (
    <div className="flex items-center space-x-1 px-4 py-2">
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce animation-delay-0" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce animation-delay-200" />
      <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce animation-delay-400" />
    </div>
  );
}
