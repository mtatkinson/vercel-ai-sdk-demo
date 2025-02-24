"use client"

import { useChat } from "ai/react"
import { SendHorizontal } from "lucide-react"
import { useRef } from "react"

export function ToolCallingDemo() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/tool-calling",
  })
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, i) => {
          // Handle tool execution messages
          if (message.role === "assistant" && message.content.startsWith("```json")) {
            try {
              const jsonContent = JSON.parse(
                message.content.replace(/```json\n?|\n?```/g, "")
              )
              return (
                <div key={i} className="mb-4 flex justify-center">
                  <div className="w-3/4 rounded-lg border bg-muted/50 p-4">
                    <div className="mb-2 text-sm font-medium">Tool Execution</div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{jsonContent.tool}</span>
                        <span className="text-muted-foreground">
                          {jsonContent.type}
                        </span>
                      </div>
                      <div className="rounded bg-muted p-2">
                        <div className="mb-1 text-xs font-medium">Arguments:</div>
                        <pre className="text-xs">
                          {JSON.stringify(jsonContent.arguments, null, 2)}
                        </pre>
                      </div>
                      {(jsonContent.result || jsonContent.error) && (
                        <div className="rounded bg-muted p-2">
                          <div className="mb-1 text-xs font-medium">
                            {jsonContent.error ? "Error:" : "Result:"}
                          </div>
                          <pre
                            className={`text-xs ${
                              jsonContent.error ? "text-red-500" : ""
                            }`}
                          >
                            {JSON.stringify(
                              jsonContent.error || jsonContent.result,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            } catch (e) {
              // If JSON parsing fails, treat it as a normal message
            }
          }

          // Handle normal messages
          return (
            <div
              key={i}
              className={`mb-4 flex ${
                message.role === "assistant" ? "justify-start" : "justify-end"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 ${
                  message.role === "assistant"
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {message.content}
              </div>
            </div>
          )
        })}
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
          placeholder="Try 'What's the weather in London?' or 'Search for recent news about AI'"
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