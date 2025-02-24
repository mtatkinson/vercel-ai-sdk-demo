import { streamText } from 'ai';
import { getModel, defaultProvider } from '@/lib/model-settings';
import { LanguageModelRequestMetadata } from 'ai';
// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    if (!messages?.length) {
      return new Response('Messages are required', { status: 400 });
    }

    const { model, ...settings } = getModel(defaultProvider);

    const result = streamText({
      model,
      ...settings,
      messages,
      
    });

  // Log the request metadata after the stream has started
  result.request.then((metadata: LanguageModelRequestMetadata) => {
    //console.log('Request metadata:', metadata);
    console.log('Raw request body:\n', metadata.body);
  });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error streaming text:', error);
    return new Response('Error streaming text', { status: 500 });
  }
} 