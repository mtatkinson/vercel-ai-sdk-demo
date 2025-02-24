import { StreamingDemo } from "./streaming-demo"

export default function StreamingPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Streaming Responses</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example shows how to stream AI responses token by token, providing a more
            interactive and engaging user experience. Watch as the AI response appears
            gradually, one token at a time.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <StreamingDemo />
        </div>
      </div>
    </div>
  )
} 