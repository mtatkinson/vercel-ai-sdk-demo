import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const maxDuration = 30;

// Define the schema for the classification result
const classificationSchema = z.object({
  category: z.string().describe('The main category or theme of the text'),
  confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1'),
  subcategories: z.array(
    z.object({
      name: z.string().describe('Name of the subcategory'),
      confidence: z.number().min(0).max(1).describe('Confidence score between 0 and 1')
    })
  ).describe('List of subcategories with confidence scores'),
  explanation: z.string().describe('Brief explanation of the classification')
});

const systemPrompt = `You are a text classification assistant. Your task is to analyze text and return ONLY valid JSON that matches the schema.
Keep the response concise and accurate. The classification should reflect the main theme and relevant subtopics of the text.
Confidence scores should reflect how certain you are about each classification.
IMPORTANT: Only return the JSON object, no additional text or explanation.`;

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Prompt is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const result = streamObject({
      model: openai('gpt-4o-mini'),
      mode: 'json',
      schema: classificationSchema,
      schemaName: 'TextClassification',
      schemaDescription: 'A classification result containing category, confidence score, subcategories, and explanation',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: `Classify this text:\n${prompt}\n\nReturn ONLY the JSON object.`,
        }
      ],
      onError: ({ error }) => {
        console.error('Stream error:', error);
      }
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('Error in classifier:', error);
    return new Response(JSON.stringify({ error: 'Failed to process request' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 