import { openai } from '@ai-sdk/openai'
import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

// Initialize the Anthropic client
const anthropic = createOpenAICompatible({
  name: 'anthropic',
  baseURL: 'https://api.anthropic.com/v1',
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, model } = await req.json()

  if (model.startsWith('gpt')) {
    // Use OpenAI for GPT models
    const result = streamText({
      model: openai(model),
      messages,
      temperature: 0.7,
    })

    return result.toDataStreamResponse()
  } else if (model === 'claude-2') {
    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: Message) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }))

    const result = streamText({
      model: anthropic('claude-2'),
      messages: anthropicMessages,
      maxTokens: 1024,
    })

    return result.toDataStreamResponse()
  }

  throw new Error(`Unsupported model: ${model}`)
} 