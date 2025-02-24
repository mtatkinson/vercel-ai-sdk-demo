import { SummarizeDemo } from "./summarize-demo"

export default function SummarizePage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Text Summarization</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example demonstrates how to use AI to generate concise summaries of longer texts.
            Simply paste your text and watch as the AI creates a focused summary highlighting the key points.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <SummarizeDemo />
        </div>
      </div>
    </div>
  )
} 