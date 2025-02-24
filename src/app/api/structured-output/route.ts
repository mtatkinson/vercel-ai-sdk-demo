import { openai } from '@ai-sdk/openai'
import { generateObject } from 'ai'
import { z } from 'zod'

// Create a schema for the text analysis
const analysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']),
  topics: z.array(z.string()),
  summary: z.string(),
  keyPoints: z.array(z.string()),
  language: z.string()
})

const systemPrompt = `You are a text analysis assistant. Analyze the provided text and return a JSON object with the following structure:
{
  "sentiment": "positive" | "negative" | "neutral",
  "topics": ["topic1", "topic2", ...],
  "summary": "Brief summary of the text",
  "keyPoints": ["key point 1", "key point 2", ...],
  "language": "Language of the text"
}

Keep the analysis concise and accurate. The response must be valid JSON.
Format the JSON with proper indentation and line breaks for better readability.
IMPORTANT: Your entire response must be a single valid JSON object.`

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await generateObject({
    model: openai('gpt-4o-mini'),
    //system: systemPrompt,
    schema: analysisSchema,
    prompt: `Analyze the following text: ${prompt}`,
    schemaDescription: 'A text analysis result containing sentiment, topics, summary, key points, and language',
  })

  return result.toJsonResponse()
}