import { Metadata } from "next"
import { StructuredOutputDemo } from "./structured-output-demo"

// Add debug logs
console.log('Page Module Loaded');

export const metadata: Metadata = {
  title: "Structured Output",
  description: "Using AI to generate structured data from text input.",
}

export default function StructuredOutputPage() {
  return (
    <div className="flex flex-col gap-8 px-4 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Structured Output Demo</h1>
        <p className="text-muted-foreground">
          Generate structured data from text using AI.
        </p>
      </div>
      <div className="rounded-lg border bg-card">
        <StructuredOutputDemo />
      </div>
    </div>
  )
} 