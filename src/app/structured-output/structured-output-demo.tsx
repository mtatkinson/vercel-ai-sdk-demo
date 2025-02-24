"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import { SendHorizontal, Code, X, Copy, Check } from "lucide-react"

// Debug log to verify file is loaded
console.log('Demo file is being executed');

// Define the type for our analysis result
type AnalysisResult = {
  sentiment: "positive" | "negative" | "neutral"
  topics: string[]
  summary: string
  keyPoints: string[]
  language: string
}

// Custom JSON formatting with syntax highlighting
const JsonViewer = ({ data }: { data: any }) => {
  const formatValue = (value: any, indent: number = 0): ReactNode => {
    const indentStr = '  '.repeat(indent);
    
    if (value === null) return <span className="text-blue-400">null</span>;
    if (typeof value === "string") return <span className="text-yellow-300">"{value}"</span>;
    if (typeof value === "number") return <span className="text-orange-300">{value}</span>;
    if (typeof value === "boolean") return <span className="text-blue-400">{value.toString()}</span>;
    
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      return (
        <span>
          [
          {value.map((item, i) => (
            <div key={i} className="ml-4">
              {formatValue(item, indent + 1)}
              {i < value.length - 1 && ","}
            </div>
          ))}
          {indentStr}]
        </span>
      );
    }
    
    if (typeof value === "object") {
      const entries = Object.entries(value);
      if (entries.length === 0) return "{}";
      return (
        <span>
          {"{"}
          {entries.map(([key, val], i) => (
            <div key={key} className="ml-4">
              <span className="text-[#9CDCFE]">"{key}"</span>
              <span className="text-white">: </span>
              {formatValue(val, indent + 1)}
              {i < entries.length - 1 && ","}
            </div>
          ))}
          {indentStr}{"}"}
        </span>
      );
    }
    
    return <span>{String(value)}</span>;
  };

  return (
    <div className="font-mono text-sm leading-6 bg-[#1E1E1E] text-white p-4 rounded-lg overflow-x-auto">
      <div className="whitespace-pre">
        {formatValue(data)}
      </div>
    </div>
  );
};

export function StructuredOutputDemo() {
  console.log('Demo render started');
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [input, setInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!result) return
    await navigator.clipboard.writeText(JSON.stringify(result, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/structured-output', {
        method: 'POST',
        body: JSON.stringify({ prompt: input }),
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Failed to analyze text:", error)
      setError("Failed to analyze the text")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex h-[600px] flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              {error}
            </div>
          )}
          {result && (
            <div className="rounded-lg border bg-card p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-medium">Analysis Result</h4>
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                >
                  <Code className="h-4 w-4" />
                  View code
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <span className="text-sm font-medium">Sentiment: </span>
                  <span className={`inline-block rounded-full px-2 py-1 text-xs ${
                    result.sentiment === "positive"
                      ? "bg-green-100 text-green-700"
                      : result.sentiment === "negative"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}>
                    {result.sentiment}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium">Topics: </span>
                  <div className="flex flex-wrap gap-1">
                    {result.topics.map((topic: string, i: number) => (
                      <span
                        key={i}
                        className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium">Summary: </span>
                  <p className="text-sm text-muted-foreground">{result.summary}</p>
                </div>
                <div>
                  <span className="text-sm font-medium">Key Points: </span>
                  <ul className="list-inside list-disc text-sm text-muted-foreground">
                    {result.keyPoints.map((point: string, i: number) => (
                      <li key={i}>{point}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="text-sm font-medium">Language: </span>
                  <span className="text-sm text-muted-foreground">
                    {result.language}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex items-center border-t p-4"
        >
          <textarea
            className="flex-1 bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="Enter some text to analyze..."
            rows={3}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="ml-4 inline-flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <SendHorizontal className="h-5 w-5" />
            <span className="sr-only">Analyze text</span>
          </button>
        </form>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-1 bg-gray-100 rounded-md font-mono">json</span>
                <h3 className="text-lg font-medium">JSON Response</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <div className="relative">
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-2 text-gray-500 hover:text-gray-700 bg-white rounded-md shadow-sm border"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                  <span className="sr-only">Copy to clipboard</span>
                </button>
                {result && <JsonViewer data={result} />}
              </div>
            </div>
            <div className="border-t p-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 bg-gray-50 rounded-md border"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Make sure default export points to the same function
const ExportedDemo = StructuredOutputDemo;
export default ExportedDemo; 