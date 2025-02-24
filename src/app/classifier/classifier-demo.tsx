"use client"

import { experimental_useObject as useObject } from 'ai/react'
import { SendHorizontal } from "lucide-react"
import { useRef, useState } from "react"
import { z } from "zod"

// Define the schema (same as server-side)
const classificationSchema = z.object({
  category: z.string(),
  confidence: z.number().min(0).max(1),
  subcategories: z.array(
    z.object({
      name: z.string(),
      confidence: z.number().min(0).max(1)
    })
  ),
  explanation: z.string()
});

type ClassificationResult = z.infer<typeof classificationSchema>

export function ClassifierDemo() {
  const formRef = useRef<HTMLFormElement>(null)
  const [error, setError] = useState<string | null>(null)
  
  const { object, submit, isLoading } = useObject<ClassificationResult>({
    api: "/api/classifier",
    schema: classificationSchema,
    onError: (error: Error) => {
      console.error("Classification error:", error);
      setError(error.message);
    }
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('input') as HTMLTextAreaElement
    if (input.value.trim()) {
      setError(null)
      submit({ prompt: input.value.trim() })
    }
  }

  // Helper function to safely render confidence percentage
  const renderConfidence = (confidence: number | undefined) => {
    return confidence !== undefined ? Math.round(confidence * 100) : 0
  }

  return (
    <div className="flex h-[600px] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="mb-4 rounded-lg border bg-card p-4">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <p className="text-sm text-muted-foreground">Analyzing text...</p>
            </div>
          </div>
        )}
        {object && !isLoading && (
          <div className="rounded-lg border bg-card p-4">
            <div className="space-y-4">
              {/* Main Category */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Main Category:</span>
                  <span className="text-sm text-muted-foreground">
                    {renderConfidence(object?.confidence)}% confidence
                  </span>
                </div>
                <div className="relative h-4 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${renderConfidence(object?.confidence)}%` }}
                  />
                </div>
                <div className="mt-1 text-sm font-medium">{object?.category}</div>
              </div>

              {/* Subcategories */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Subcategories:</h4>
                <div className="space-y-2">
                  {object?.subcategories?.map((sub, index) => (
                    <div key={index}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span>{sub?.name}</span>
                        <span className="text-muted-foreground">
                          {renderConfidence(sub?.confidence)}%
                        </span>
                      </div>
                      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-primary/60 transition-all duration-500"
                          style={{ width: `${renderConfidence(sub?.confidence)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <h4 className="mb-2 text-sm font-medium">Explanation:</h4>
                <p className="text-sm text-muted-foreground">
                  {object?.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex items-center border-t p-4"
      >
        <textarea
          name="input"
          className="flex-1 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Enter text to classify..."
          rows={3}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {isLoading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
          ) : (
            <SendHorizontal className="h-5 w-5" />
          )}
          <span className="sr-only">Classify text</span>
        </button>
      </form>
    </div>
  )
} 