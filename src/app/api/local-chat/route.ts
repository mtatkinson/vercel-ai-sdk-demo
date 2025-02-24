import { streamText } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'

//export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages, baseUrl } = await req.json()

  try {
    // Create an OpenAI-compatible provider instance for LM Studio
    const lmstudio = createOpenAICompatible({
      name: 'lmstudio',
      baseURL: baseUrl + '/v1',
    })

    console.log(baseUrl);

    // Use streamText with the provider
    const result = streamText({
      model: lmstudio('deepseek-r1-distill-llama-8b'),
      messages,
      maxRetries: 0, // immediately error if the server is not running
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Error:', error)
    return new Response('Error connecting to local model. Make sure LM Studio is running and the server is started.', { status: 500 })
  }
} 