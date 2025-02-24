import { LanguageModelRequestMetadata, streamText } from 'ai';
import { getModel, defaultProvider } from '@/lib/model-settings';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response('Text to summarize is required', { status: 400 });
    }

    const { model, ...settings } = getModel(defaultProvider);

    const result = streamText({
      model,
      ...settings,
      messages: [
        { 
          role: 'system', 
          content: 'You are a text summarization assistant. Create clear, concise summaries that capture the key points and main ideas of the provided text. Be concise. Keep summaries focused and well-structured. Highlight the most important points and ideas in bold. Feel free to use bullet points, as appropriate, to organize the information into key points.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
    });

    // Log the request metadata after the stream has started
    result.request.then((metadata: LanguageModelRequestMetadata) => {
      //console.log('Request metadata:', metadata);
      console.log('Raw request body:\n', metadata.body);
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error summarizing text:', error);
    return new Response(JSON.stringify({ error: 'Error summarizing text' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 