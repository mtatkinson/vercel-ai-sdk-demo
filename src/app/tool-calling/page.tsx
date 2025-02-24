import { ToolCallingDemo } from "./tool-calling-demo"

export default function ToolCallingPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Tool Calling</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example shows how AI can interact with external tools and APIs.
            The AI can perform tasks like fetching weather data, searching the web,
            or manipulating data based on your requests.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <ToolCallingDemo />
        </div>
      </div>
    </div>
  )
} 