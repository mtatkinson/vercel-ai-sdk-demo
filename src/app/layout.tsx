import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vercel AI SDK Demo",
  description: "A showcase of various Vercel AI SDK capabilities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <div className="flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <aside className="fixed top-0 z-30 -ml-2 hidden h-screen w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
              <div className="h-full py-6 pl-8 pr-6 lg:py-8">
                <nav className="flex flex-col space-y-2">
                  <div className="mb-4">
                    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                      AI SDK Examples
                    </h2>
                    <div className="space-y-1">
                      <a
                        href="/text-generation"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Text Generation
                      </a>
                      <a
                        href="/streaming"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Streaming
                      </a>
                      <a
                        href="/summarize"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Text Summarization
                      </a>
                      <a
                        href="/model-switching"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Model Switching
                      </a>
                      <a
                        href="/local-models"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Local Models
                      </a>
                      <a
                        href="/structured-output"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Structured Output
                      </a>
                      <a
                        href="/streaming-structured"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Streaming Structured
                      </a>
                      <a
                        href="/classifier"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Classifier
                      </a>
                      <a
                        href="/image-analysis"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Image Analysis
                      </a>
                      <a
                        href="/embeddings"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Embeddings
                      </a>
                      <a
                        href="/tool-calling"
                        className="block rounded-lg px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        Tool Calling
                      </a>
                    </div>
                  </div>
                </nav>
              </div>
            </aside>
            <main className="flex w-full flex-col overflow-hidden px-4 md:px-6">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
