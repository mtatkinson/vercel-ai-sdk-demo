# Vercel AI SDK Demo

This is a comprehensive demo application showcasing various capabilities of the Vercel AI SDK. The application is built with Next.js, TailwindCSS, and Shadcn/UI, demonstrating different AI features including text generation, streaming responses, model switching, and more.

## Features

- Text Generation
- Streaming Responses
- Model Switching
- Local Model Integration
- Structured Outputs
- Streaming Structured Outputs
- Classifier
- Image Analysis
- Embeddings
- Tool Calling

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the `.env.example` file to `.env.local` and add your OpenAI API key:
   ```bash
   cp .env.example .env.local
   ```
4. Add your OpenAI API key to the `.env.local` file:
   ```
   OPENAI_API_KEY=your_api_key_here
   ```
5. Run the development server:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `/src/app`: Main application code
  - `/api`: API routes for AI functionality
  - `/components`: Reusable UI components
  - Various feature directories for different AI capabilities

## Vercel AI SDK

This project is built using the [Vercel AI SDK](https://sdk.vercel.ai/docs/introduction), a powerful library for building AI-powered user interfaces. The SDK provides:

- Edge Runtime-ready streaming abstractions
- First-class support for LLMs (Large Language Models)
- Built-in support for popular AI models and platforms
- Type-safe APIs for AI interactions
- Utilities for building AI-powered applications

For detailed information and guides, visit the [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs/introduction).

## Technologies Used

- [Next.js](https://nextjs.org/)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [TailwindCSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [OpenAI API](https://openai.com/)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
