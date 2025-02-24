import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { z } from 'zod';

export const runtime = 'edge';

// Define available tools
const tools = {
  weather: {
    description: 'Get the weather in a location (fahrenheit)',
    parameters: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }: { location: string }) => {
      // Mock weather data
      const temperature = Math.round(Math.random() * (90 - 32) + 32);
      return {
        location,
        temperature,
      };
    },
  },
  search_news: {
    description: 'Search for recent news articles',
    parameters: z.object({
      query: z.string().describe('The search query'),
      limit: z.number().default(3).describe('Maximum number of results to return'),
    }),
    execute: async ({ query, limit = 3 }: { query: string; limit?: number }) => {
      // Mock news data
      return [{
        title: `Latest news about ${query}`,
        source: "Demo News",
        date: new Date().toISOString(),
        snippet: `This is a mock news article about ${query}.`,
      }];
    },
  },
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4-turbo-preview'),
    messages,
    tools,
  });

  return result.toDataStreamResponse();
} 