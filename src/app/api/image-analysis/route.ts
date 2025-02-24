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
  console.log("\n=== [Backend] Image Analysis API Called ===")
  console.log("[Backend] Timestamp:", new Date().toISOString())
  
  try {
    // Log raw request details first
    console.log("[Backend] Request URL:", req.url)
    console.log("[Backend] Request method:", req.method)
    console.log("[Backend] Request headers:", Object.fromEntries(req.headers.entries()))
    
    // Clone the request before reading the body (as it can only be read once)
    const reqClone = req.clone()
    
    // Try to read the raw body first
    const rawBody = await reqClone.text()
    console.log("[Backend] Raw request body length:", rawBody.length)
    console.log("[Backend] Raw request body preview:", rawBody.substring(0, 100) + "...")
    
    // Now parse the actual request
    const body = await req.json()
    console.log("[Backend] Parsed body properties:", Object.keys(body))
    console.log("[Backend] Has imageUrl:", !!body.imageUrl)
    if (body.imageUrl) {
      console.log("[Backend] ImageUrl length:", body.imageUrl.length)
    }

    const { imageUrl } = body
    
    if (!imageUrl) {
      console.error("[Backend] No image URL provided in request")
      return new Response(JSON.stringify({ error: "No image URL provided" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Convert base64 image URL to content for the API
    const base64Image = imageUrl.split(',')[1]
    
    if (!base64Image) {
      console.error("[Backend] Invalid image URL format - couldn't extract base64 content")
      return new Response(JSON.stringify({ error: "Invalid image URL format" }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log("[Backend] Base64 image extracted, length:", base64Image.length)
    console.log("[Backend] Preparing OpenAI API request...")

    try {
      // Get OpenAI API key from environment
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })

      // Override the model to use vision model specifically for image analysis
      const { temperature } = getModel('openai')
      
      // Prepare the messages for OpenAI
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

      console.log("[Backend] Sending request to OpenAI with messages:", JSON.stringify(messages, null, 2))
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o',
        temperature,
        max_tokens: 1000,
        messages: messages as any,
        stream: false,
      })

      console.log("[Backend] Response received from OpenAI:", completion)
      
      // Extract the response content
      const responseContent = completion.choices[0]?.message?.content
      
      if (!responseContent) {
        throw new Error("No content received from OpenAI")
      }

      console.log("[Backend] Raw response content:", responseContent)

      // Clean up the response content - remove markdown code block if present
      const cleanedContent = responseContent
        .replace(/^```json\n/, '') // Remove opening ```json
        .replace(/^```\n/, '')     // Remove opening ``` (if no language specified)
        .replace(/\n```$/, '')     // Remove closing ```
        .trim()

      console.log("[Backend] Cleaned response content:", cleanedContent)

      // Parse the JSON response to validate it
      let parsedResponse
      try {
        parsedResponse = JSON.parse(cleanedContent)
        console.log("[Backend] Successfully parsed response:", parsedResponse)
      } catch (parseError) {
        console.error("[Backend] Failed to parse OpenAI response:", parseError)
        console.error("[Backend] Raw response was:", responseContent)
        console.error("[Backend] Cleaned response was:", cleanedContent)
        throw new Error("Invalid JSON response from OpenAI")
      }

      // Validate the response structure
      if (!parsedResponse.description || !Array.isArray(parsedResponse.objects) || 
          !Array.isArray(parsedResponse.dominantColors) || !parsedResponse.scene || 
          !Array.isArray(parsedResponse.tags)) {
        console.error("[Backend] Invalid response structure:", parsedResponse)
        throw new Error("Invalid response structure from OpenAI")
      }

      // Return the JSON response
      return new Response(JSON.stringify(parsedResponse), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    } catch (error: any) {
      console.error("[Backend] OpenAI API Error:", error)
      return new Response(JSON.stringify({ 
        error: "OpenAI API Error", 
        details: error?.message || "Unknown OpenAI error",
        stack: error?.stack
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error: any) {
    console.error("[Backend] General Error in image analysis:", error)
    return new Response(JSON.stringify({ 
      error: "Failed to process image", 
      details: error?.message || "Unknown error",
      stack: error?.stack
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
} 