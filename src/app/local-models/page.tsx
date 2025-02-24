'use client'

import { useChat } from 'ai/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function LocalModelsPage() {
  const [baseUrl, setBaseUrl] = useState('http://127.0.0.1:1234')
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: '/api/local-chat',
    body: {
      baseUrl,
    },
  })

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="flex-none space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Local Models</h2>
        </div>
        <div className="grid gap-4">
          <div className="rounded-lg border bg-card p-6">
            <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
            <p className="text-sm text-muted-foreground">
              This example demonstrates how to connect to local LLM providers like LM Studio
              using the OpenAI-compatible API interface. You can configure the base URL and
              interact with your locally running models.
            </p>
          </div>
          <Input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            className="font-mono"
          />
        </div>
      </div>

      <div className="flex-1 overflow-auto px-8">
        <div className="space-y-4 pb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'assistant' ? 'justify-start' : 'justify-end'
              }`}
            >
              <div
                className={`rounded-lg px-3 py-2 max-w-[85%] ${
                  message.role === 'assistant'
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-none p-8 pt-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  )
} 