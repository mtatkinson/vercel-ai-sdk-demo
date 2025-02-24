import { generateText } from 'ai';
import { getModel, defaultProvider } from '@/lib/model-settings';

// Allow responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt) {
      return new Response('Prompt is required', { status: 400 });
    }

    const { model, ...settings } = getModel(defaultProvider);

    const result = await generateText({
      model,
      ...settings,
      prompt,
    });

    // Log the raw request metadata
    console.log(result.request.body);

    return new Response(JSON.stringify({ text: result.text }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating text:', error);
    return new Response(JSON.stringify({ error: 'Error generating text' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 