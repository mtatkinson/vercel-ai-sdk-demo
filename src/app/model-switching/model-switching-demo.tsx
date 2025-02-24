"use client"

import { useChat } from "ai/react"
import { SendHorizontal } from "lucide-react"
import { useRef, useState } from "react"

const models = [
  { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo" },
  { id: "gpt-4", name: "GPT-4" },
  { id: "claude-2", name: "Claude 2" },
]

export function ModelSwitchingDemo() {
  const [selectedModel, setSelectedModel] = useState(models[0])
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/model-switching",
    body: {
      model: selectedModel.id,
    },
  })
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <div className="flex h-[600px] flex-col">
      <div className="border-b p-4">
        <label className="block text-sm font-medium text-muted-foreground mb-2">
          Select Model
        </label>
        <div className="flex gap-2">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model)}
              className={`px-3 py-1 rounded-md text-sm ${
                selectedModel.id === model.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {model.name}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
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
                  ? "bg-muted text-muted-foreground"
                  : "bg-primary text-primary-foreground"
              }`}
            >
              {message.content}
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
          placeholder={`Ask ${selectedModel.name} something...`}
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