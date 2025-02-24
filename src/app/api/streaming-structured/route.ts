import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

// Define the schema for the analysis result
const analysisSchema = z.object({
  sentiment: z.enum(['positive', 'negative', 'neutral']).describe('The sentiment of the text'),
  topics: z.array(z.string()).describe('List of main topics discussed in the text'),
  summary: z.string().describe('A concise summary of the text'),
  keyPoints: z.array(z.string()).describe('Key points from the text'),
  language: z.string().describe('The language of the text')
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      throw new Error('Prompt is required and must be a string');
    }

    const result = streamObject({
      model: openai('gpt-4o-mini'),
      schema: analysisSchema,
      prompt: `Analyze the following text and provide structured information about it:\n\n${prompt}`,
      schemaDescription: 'A text analysis result containing sentiment, topics, summary, key points, and language',
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(JSON.stringify({ error: 'Failed to process the request' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 