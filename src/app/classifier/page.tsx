import { ClassifierDemo } from "./classifier-demo"

export default function ClassifierPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Text Classifier</h2>
      </div>
      <div className="grid gap-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This example shows how to use AI for text classification tasks.
            The model will categorize text into predefined categories and
            provide confidence scores for each category.
          </p>
        </div>
        <div className="rounded-lg border bg-card">
          <ClassifierDemo />
        </div>
      </div>
    </div>
  )
} 