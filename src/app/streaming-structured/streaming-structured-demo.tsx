"use client"

import { experimental_useObject as useObject } from '@ai-sdk/react'
import { SendHorizontal } from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { z } from 'zod'

// Define the schema (same as server-side)
const analysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  topics: z.array(z.string()),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  language: z.string()
})

type AnalysisResult = z.infer<typeof analysisSchema>

export function StreamingStructuredDemo() {
  const formRef = useRef<HTMLFormElement>(null)
  const [result, setResult] = useState<Partial<AnalysisResult> | null>(null)
  const [charCount, setCharCount] = useState(0)
  const [tokenCount, setTokenCount] = useState(0)
  
  const { object, submit, isLoading } = useObject<AnalysisResult>({
    api: "/api/streaming-structured",
    schema: analysisSchema,
  })

  // Update result when object changes
  useEffect(() => {
    if (object) {
      const partialResult: Partial<AnalysisResult> = {
        sentiment: object.sentiment,
        topics: object.topics?.filter((t): t is string => typeof t === 'string'),
        summary: object.summary,
        keyPoints: object.keyPoints?.filter((k): k is string => typeof k === 'string'),
        language: object.language
      }
      setResult(partialResult)
    }
  }, [object])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.elements.namedItem('input') as HTMLTextAreaElement
    if (input.value.trim()) {
      submit({ prompt: input.value.trim() })
    }
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setCharCount(text.length)
    // Estimate tokens: split by whitespace for words, then apply 0.75 multiplier
    // Add 2 extra tokens to account for special tokens
    const estimatedTokens = Math.ceil(text.trim().split(/\s+/).length * 0.75) + 2
    setTokenCount(estimatedTokens)
  }

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US')
  }

  return (
    <div className="flex-1 p-8">
      {/* Main Content */}
      <div>
        {/* Header Section */}
        <div className="mb-8 max-w-3xl">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">AI Text Analysis</h1>
          <p className="text-lg text-muted-foreground">
            Enter your text below to get a detailed analysis including sentiment, topics, and key points.
          </p>
        </div>

        {/* Input Section */}
        <div className="mb-8">
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="max-w-3xl space-y-4"
          >
            <div className="relative rounded-lg border bg-background shadow-sm">
              <textarea
                name="input"
                className="min-h-[200px] w-full resize-none rounded-lg border-0 bg-transparent p-4 text-base placeholder:text-muted-foreground focus:outline-none focus:ring-0"
                placeholder="Enter your text here..."
                onChange={handleTextChange}
                disabled={isLoading}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-x-4">
                <span className="text-sm text-muted-foreground">{formatNumber(charCount)} characters</span>
                <span className="text-sm text-muted-foreground">~{formatNumber(tokenCount)} tokens</span>
              </div>
              <button
                type="submit"
                disabled={isLoading || charCount === 0}
                className="inline-flex items-center justify-center rounded-full bg-[#8B5CF6] px-8 py-2 text-base font-medium text-white transition-colors hover:bg-[#7C3AED] disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Analyzing...
                  </>
                ) : (
                  'Analyze Text'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Results Section - Only shown after submission */}
        {(result || object) && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Structured View */}
            <div className="h-full rounded-lg border bg-card p-6">
              <h3 className="mb-6 text-base font-medium">Analysis Results</h3>
              <div className="space-y-6">
                <div>
                  <span className="text-sm font-medium">Sentiment</span>
                  {result?.sentiment && (
                    <div className="mt-2">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${
                          result.sentiment === "positive"
                            ? "bg-green-100 text-green-700"
                            : result.sentiment === "negative"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {result.sentiment}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <span className="text-sm font-medium">Topics</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {result?.topics?.map((topic, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Summary</span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result?.summary}
                  </p>
                </div>

                <div>
                  <span className="text-sm font-medium">Key Points</span>
                  <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-muted-foreground">
                    {result?.keyPoints?.map((point, i) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className="text-sm font-medium">Language</span>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result?.language}
                  </p>
                </div>
              </div>
            </div>

            {/* Raw JSON View */}
            <div className="h-full rounded-lg border bg-card p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium">Raw JSON</h3>
                <button
                  onClick={() => {
                    if (object) {
                      navigator.clipboard.writeText(JSON.stringify(object, null, 2))
                    }
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Copy JSON
                </button>
              </div>
              <div className="mt-6">
                <pre className="h-[calc(100%-2rem)] overflow-auto rounded-lg bg-muted p-4 text-sm">
                  <code>{object ? JSON.stringify(object, null, 2) : "Waiting for input..."}</code>
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 