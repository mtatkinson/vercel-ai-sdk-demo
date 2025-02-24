"use client"

import { useCompletion } from "@ai-sdk/react"
import { SendHorizontal } from "lucide-react"
import { useRef } from "react"
import ReactMarkdown from 'react-markdown'

export function SummarizeDemo() {
  const { completion, input, handleInputChange, handleSubmit, isLoading } =
    useCompletion({
      api: "/api/summarize",
      onError: (err) => {
        console.error("Error:", err);
      },
    })

  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {completion ? (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2 text-muted-foreground prose prose-sm dark:prose-invert max-w-none">
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
                {completion}
              </ReactMarkdown>
            </div>
          </div>
        ) : isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2 text-muted-foreground">
              Generating summary...
            </div>
          </div>
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col border-t p-4"
      >
        <textarea
          className="mb-4 flex-1 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={input}
          onChange={handleInputChange}
          placeholder="Paste your text here to summarize..."
          rows={6}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <SendHorizontal className="mr-2 h-5 w-5" />
          Summarize
        </button>
      </form>
    </div>
  )
} 