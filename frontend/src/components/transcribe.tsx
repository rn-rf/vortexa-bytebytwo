import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Link, X } from "lucide-react"

export function Transcribe() {
  const [activeTab, setActiveTab] = useState("youtube")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [transcriptText, setTranscriptText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleYoutubeSubmit = async () => {
    if (!youtubeLink.trim()) return
    
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:4000/api/transcribe/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: youtubeLink }),
      })
      
      const data = await response.json()
      if (data.transcript && data.transcript.text) {
        setTranscriptText(data.transcript.text)
      }
    } catch (error) {
      console.error('Error transcribing YouTube video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    
    setIsLoading(true)
    const formData = new FormData()
    formData.append('video', selectedFile)
    
    try {
      const response = await fetch('http://localhost:4000/api/transcribe/upload', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      if (data.transcript && data.transcript.text) {
        setTranscriptText(data.transcript.text)
      }
    } catch (error) {
      console.error('Error transcribing uploaded video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (file) => {
    setSelectedFile(file)
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const removeFile = () => {
    setSelectedFile(null)
  }

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        <Button
          variant={activeTab === "youtube" ? "default" : "ghost"}
          onClick={() => setActiveTab("youtube")}
          className="flex-1"
        >
          <Link className="w-4 h-4 mr-2" />
          YouTube Link
        </Button>
        <Button
          variant={activeTab === "upload" ? "default" : "ghost"}
          onClick={() => setActiveTab("upload")}
          className="flex-1"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Video
        </Button>
      </div>

      {/* YouTube Link Tab */}
      {activeTab === "youtube" && (
        <Card>
          <CardHeader>
            <CardTitle>Transcribe from YouTube</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                type="url"
                placeholder="Enter YouTube video URL"
                value={youtubeLink}
                onChange={(e) => setYoutubeLink(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleYoutubeSubmit} 
              disabled={!youtubeLink.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? "Transcribing..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Video Tab */}
      {activeTab === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Video File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-sm font-medium">{selectedFile.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={removeFile}
                      className="h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Drop your video file here</p>
                    <p className="text-xs text-muted-foreground">or click to browse</p>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
                className="hidden"
              />
              {!selectedFile && (
                <Button
                  variant="outline"
                  onClick={openFileDialog}
                  className="mt-2"
                >
                  Browse Files
                </Button>
              )}
            </div>
            <Button 
              onClick={handleFileUpload} 
              disabled={!selectedFile || isLoading}
              className="w-full"
            >
              {isLoading ? "Transcribing..." : "Upload"}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Transcript Display */}
      <Card>
        <CardHeader>
          <CardTitle>Transcript</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Transcript will appear here..."
            value={transcriptText}
            readOnly
            className="min-h-[300px] resize-none"
          />
        </CardContent>
      </Card>
    </div>
  )
}