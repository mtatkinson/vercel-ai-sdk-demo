"use client"

import { useChat } from "@ai-sdk/react"
import { ImageIcon, Upload } from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface ImageAnalysis {
  description: string
  objects: string[]
  dominantColors: string[]
  scene: string
  tags: string[]
}

export function ImageAnalysisDemo() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  
  console.log("[Frontend] Component rendered with selectedImage:", !!selectedImage)
  
  const { messages, isLoading, handleSubmit } = useChat({
    api: "/api/image-analysis",
    initialMessages: [],
    body: {
      imageUrl: selectedImage,
    },
    headers: {
      'Content-Type': 'application/json',
    },
    onResponse: (response) => {
      console.log("[Frontend] API Response details:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        url: response.url,
        type: response.type,
        headers: Object.fromEntries(response.headers.entries()),
        method: response.type
      })
    },
    onFinish: (message) => {
      console.log("[Frontend] onFinish called with message:", message)
      if (!message.content) {
        console.error("[Frontend] No content in message")
        return
      }
      try {
        const parsedAnalysis = JSON.parse(message.content)
        console.log("[Frontend] Successfully parsed analysis:", parsedAnalysis)
        setAnalysis(parsedAnalysis)
      } catch (e) {
        console.error("[Frontend] Failed to parse analysis:", e)
      }
    },
    onError: (error) => {
      console.error("[Frontend] API Error:", {
        message: error.message,
        name: error.name,
        stack: error.stack,
        cause: error.cause
      })
      setAnalysis(null)
    }
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const analyzeImage = async () => {
    console.log("[Frontend] analyzeImage called", {
      hasImage: !!selectedImage,
      imageLength: selectedImage?.length,
      isLoading,
      currentMessages: messages
    })
    if (selectedImage) {
      try {
        console.log("[Frontend] Preparing to submit analysis request...")
        
        console.log("[Frontend] Making direct fetch request to API...")
        const response = await fetch('/api/image-analysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({ imageUrl: selectedImage }),
        })
        
        console.log("[Frontend] Direct API response:", {
          status: response.status,
          ok: response.ok,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries())
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error("[Frontend] API error response:", errorData)
          return
        }

        const result = await response.json()
        console.log("[Frontend] API success response:", result)

        // Validate the response structure
        if (!result.description || !Array.isArray(result.objects) || !Array.isArray(result.dominantColors) || 
            !result.scene || !Array.isArray(result.tags)) {
          console.error("[Frontend] Invalid response structure:", result)
          return
        }

        setAnalysis(result)
        console.log("[Frontend] Analysis set successfully:", result)
      } catch (error) {
        console.error("[Frontend] Error during API call:", error)
      }
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    console.log("File selected:", file?.name)
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        console.log("File read complete, setting selected image")
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handlePaste = async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items
    if (!items) return

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile()
        if (file) {
          const reader = new FileReader()
          reader.onloadend = () => {
            setSelectedImage(reader.result as string)
          }
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  useEffect(() => {
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  return (
    <div className="mx-auto w-full max-w-5xl h-full">
      <div className="rounded-lg border shadow-sm bg-white">
        <div className="p-6">
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">AI Image Analysis</h1>
          <p className="text-gray-600 mb-6">Upload an image to get a detailed analysis including objects, colors, and scene description.</p>
        </div>

        <div className="p-6 pt-0">
          {!selectedImage ? (
            <div>
              <div
                className="relative border-2 border-dashed rounded-lg p-8 transition-colors border-gray-300 hover:border-primary"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className="flex flex-col items-center text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Drag and drop your image here, or</p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-sm text-blue-500 hover:text-blue-600"
                    >
                      choose a file
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">You can also paste an image from your clipboard</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={analyzeImage}
                  disabled={!selectedImage || isLoading}
                  className="inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative rounded-lg bg-gray-50 p-4">
                <img
                  src={selectedImage}
                  alt="Uploaded"
                  className="w-full rounded-lg object-contain"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute right-2 top-2 rounded-full bg-white/80 p-2 hover:bg-white/90"
                >
                  <Upload className="h-4 w-4" />
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={analyzeImage}
                  disabled={isLoading}
                  className="inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  <ImageIcon className="mr-2 h-4 w-4" />
                  {isLoading ? 'Analyzing...' : 'Analyze Image'}
                </button>
              </div>

              {analysis && (
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-2">Objects Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.objects.map((obj, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {obj}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Dominant Colors</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.dominantColors.map((color, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 rounded text-sm">
                          {color}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Scene</h3>
                    <p className="text-gray-700">{analysis.scene}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.tags.map((tag, i) => (
                        <span key={i} className="px-3 py-1 bg-purple-100 rounded-full text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-700">{analysis.description}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 