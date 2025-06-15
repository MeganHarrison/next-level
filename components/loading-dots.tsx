import React from "react";

export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <span className="sr-only">Loading...</span>
      <div className="h-2 w-2 rounded-full bg-current animate-bounce" />
      <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-150" />
      <div className="h-2 w-2 rounded-full bg-current animate-bounce delay-300" />
    </div>
  );
}