"use client"

import { SendHorizontal } from "lucide-react"
import { useRef, useState } from "react"

export default function TextGenerationDemo() {
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    
    // Add user message to the messages array immediately
    setMessages(prev => [...prev, { role: 'user', content: prompt }])
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate text')
      }

      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      // Add the assistant's response to messages
      setMessages(prev => [...prev, { role: 'assistant', content: data.text }])
      setPrompt("") // Clear prompt after completion
    } catch (err) {
      console.error('Error submitting prompt:', err)
      setError(err instanceof Error ? err.message : 'Failed to generate text')
      // Remove the user message if there was an error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`mb-4 flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="mb-4 flex justify-start">
            <div className="rounded-lg bg-muted px-4 py-2 text-muted-foreground">
              Generating response...
            </div>
          </div>
        )}
        {error && (
          <div className="mb-4 flex justify-center">
            <div className="rounded-lg bg-red-100 px-4 py-2 text-red-600">
              Error: {error}
            </div>
          </div>
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center border-t p-4"
      >
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter a prompt..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <SendHorizontal className="h-5 w-5" />
          <span className="sr-only">Generate text</span>
        </button>
      </form>
    </div>
  )
} 