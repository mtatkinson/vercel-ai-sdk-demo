import { openai } from '@ai-sdk/openai';

// Default model configurations for each provider
export const models = {
  openai: openai('gpt-4o-mini'),
} as const;

// Model settings and configurations
export const modelSettings = {
  openai: {
    temperature: 0.7,
    maxTokens: 500,
  },
} as const;

// Helper function to get the model with settings
export function getModel(provider: keyof typeof models) {
  return {
    model: models[provider],
    ...modelSettings[provider],
  };
}

// Default provider
export const defaultProvider = 'openai' as const; 