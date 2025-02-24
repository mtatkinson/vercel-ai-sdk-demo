import OpenAI from 'openai'
import { getModel } from '@/lib/model-settings'

const systemPrompt = `You are an image analysis assistant. Analyze the provided image and return a JSON object with the following structure:
{
  "description": string, // A detailed description of the image
  "objects": string[], // List of detected objects (simple strings, no confidence scores)
  "dominantColors": string[], // List of dominant colors in simple text format (e.g. "Navy Blue", "Forest Green")
  "scene": string, // A short description of the scene/setting
  "tags": string[] // Relevant tags/keywords for the image
}

Keep the analysis detailed but concise. The response must be valid JSON.`

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json()
    
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "No image URL provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const base64Image = imageUrl.split(',')[1]
    
    if (!base64Image) {
      return new Response(JSON.stringify({ error: "Invalid image URL format" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    try {
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      const { temperature } = getModel('openai')
      
      const messages = [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Please analyze this image and provide a response in the exact JSON format specified.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ]
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature,
        max_tokens: 1000,
        messages: messages as any,
        stream: false,
      })
      
      const responseContent = completion.choices[0]?.message?.content
      
      if (!responseContent) {
        throw new Error("No content received from OpenAI")
      }

      const cleanedContent = responseContent
        .replace(/^```json\n/, '')
        .replace(/^```\n/, '')
        .replace(/\n```$/, '')
        .trim()

      const parsedResponse = JSON.parse(cleanedContent)
      console.log("[Backend] Successfully parsed response:", parsedResponse)

      if (!parsedResponse.description || !Array.isArray(parsedResponse.objects) || 
          !Array.isArray(parsedResponse.dominantColors) || !parsedResponse.scene || 
          !Array.isArray(parsedResponse.tags)) {
        throw new Error("Invalid response structure from OpenAI")
      }

      return new Response(JSON.stringify(parsedResponse), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      console.error("OpenAI API Error:", error)
      return new Response(JSON.stringify({ 
        error: "OpenAI API Error", 
        details: error?.message || "Unknown OpenAI error"
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error: any) {
    console.error("General Error in image analysis:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to process image", 
      details: error?.message || "Unknown error"
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 