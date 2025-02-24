import Image from "next/image";

export default function Home() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Welcome to Vercel AI SDK Demo</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">About This Demo</h3>
          <p className="text-sm text-muted-foreground">
            This application showcases various capabilities of the Vercel AI SDK,
            from basic text generation to advanced features like streaming structured outputs
            and tool calling.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">Getting Started</h3>
          <p className="text-sm text-muted-foreground">
            Select any example from the sidebar to explore different AI capabilities.
            Each demo includes detailed explanations and live examples.
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="mb-2 text-lg font-semibold">Features</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Text Generation</li>
            <li>• Streaming Responses</li>
            <li>• Model Switching</li>
            <li>• Local Model Integration</li>
            <li>• Structured Outputs</li>
            <li>• Image Analysis</li>
            <li>• And more...</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
