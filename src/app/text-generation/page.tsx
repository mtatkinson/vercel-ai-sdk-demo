import TextGenerationDemo from "./text-generation-demo"

export default function TextGenerationPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Text Generation</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example demonstrates basic text generation using the Vercel AI SDK.
            Type a message and see how the AI responds with generated text.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <TextGenerationDemo />
        </div>
      </div>
    </div>
  )
} 