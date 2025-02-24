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
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  console.log("[Frontend] Component rendered with selectedImage:", !!selectedImage)
  
  const analyzeImage = async () => {
    if (!selectedImage) return
    
    setIsAnalyzing(true)
    setAnalysis(null)
    
    try {
      console.log("[Frontend] Making API request...")
      const response = await fetch('/api/image-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: selectedImage }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const result = await response.json()
      console.log("[Frontend] API response:", result)
      setAnalysis(result)
    } catch (error) {
      console.error("[Frontend] Error analyzing image:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const fileInputRef = useRef<HTMLInputElement>(null)

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
      {isModalOpen && selectedImage && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full">
            <img
              src={selectedImage}
              alt="Full size"
              className="w-full h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 bg-black/50 text-white rounded-full p-2 hover:bg-black/70"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      )}

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
                  disabled={!selectedImage || isAnalyzing}
                  className="inline-flex items-center rounded-lg bg-purple-500 px-4 py-2 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Analyze Image
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-2xl mb-6">
                  <div 
                    className="relative rounded-lg bg-gray-50 p-2 cursor-pointer group"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <img
                      src={selectedImage}
                      alt="Uploaded"
                      className="w-full rounded-lg object-contain max-h-[300px]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">Click to enlarge</span>
                    </div>
                  </div>
                </div>

                <div className="w-full flex justify-center gap-3 mb-8">
                  <button
                    onClick={() => {
                      setSelectedImage(null);
                      setAnalysis(null);
                    }}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Image
                  </button>
                  <button
                    onClick={analyzeImage}
                    disabled={isAnalyzing}
                    className="inline-flex items-center rounded-lg bg-purple-500 px-6 py-2.5 text-sm text-white hover:bg-purple-600 disabled:opacity-50"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <ImageIcon className="mr-2 h-4 w-4" />
                        Analyze Image
                      </>
                    )}
                  </button>
                </div>

                {isAnalyzing ? (
                  <div className="w-full flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
                      <p className="mt-4 text-sm font-medium text-gray-900">Analyzing your image...</p>
                      <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
                    </div>
                  </div>
                ) : analysis ? (
                  <div className="w-full grid grid-cols-2 gap-8">
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
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 