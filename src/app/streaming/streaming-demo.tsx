"use client"

import { useChat } from "ai/react"
import { SendHorizontal } from "lucide-react"
import { useRef } from "react"
import ReactMarkdown from 'react-markdown'

export function StreamingDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/streaming",
  })
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, i) => (
          <div
            key={message.id}
            className={`mb-4 flex ${
              message.role === "assistant"
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === "assistant"
                  ? "bg-muted text-muted-foreground prose prose-sm dark:prose-invert max-w-none"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.role === "assistant" ? (
                <ReactMarkdown
                  components={{
                    ul: ({ children }) => (
                      <ul className="list-disc pl-4 space-y-2">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="marker:text-muted-foreground pl-1">{children}</li>
                    ),
                    p: ({ children }) => (
                      <p className="mb-2">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-foreground">{children}</strong>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
              {isLoading && i === messages.length - 1 && (
                <span className="inline-block animate-pulse">▊</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center border-t p-4"
      >
        <input
          className="flex-1 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={input}
          onChange={handleInputChange}
          placeholder="Ask something..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Send message</span>
        </button>
      </form>
    </div>
  )
} 