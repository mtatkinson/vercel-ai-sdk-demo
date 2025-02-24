import { ModelSwitchingDemo } from "./model-switching-demo"

export default function ModelSwitchingPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Model Switching</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example demonstrates how to switch between different AI models
            dynamically. You can compare responses from different models and see
            how they handle the same prompts differently.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <ModelSwitchingDemo />
        </div>
      </div>
    </div>
  )
} 