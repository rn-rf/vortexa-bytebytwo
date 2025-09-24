// import { useState, useRef } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Upload, Link, X } from "lucide-react"
//
// export function Transcribe() {
//   const [activeTab, setActiveTab] = useState("youtube")
//   const [youtubeLink, setYoutubeLink] = useState("")
//   const [selectedFile, setSelectedFile] = useState(null)
//   const [transcriptText, setTranscriptText] = useState("")
//   const [isLoading, setIsLoading] = useState(false)
//   const [dragActive, setDragActive] = useState(false)
//   const fileInputRef = useRef(null)
//
//   const handleYoutubeSubmit = async () => {
//     if (!youtubeLink.trim()) return
//
//     setIsLoading(true)
//     try {
//       const response = await fetch('http://localhost:4000/api/transcribe/youtube', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ url: youtubeLink }),
//       })
//
//       const data = await response.json()
//       if (data.transcript && data.transcript.text) {
//         setTranscriptText(data.transcript.text)
//       }
//     } catch (error) {
//       console.error('Error transcribing YouTube video:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   const handleFileUpload = async () => {
//     if (!selectedFile) return
//
//     setIsLoading(true)
//     const formData = new FormData()
//     formData.append('video', selectedFile)
//
//     try {
//       const response = await fetch('http://localhost:4000/api/transcribe/upload', {
//         method: 'POST',
//         body: formData,
//       })
//
//       const data = await response.json()
//       if (data.transcript && data.transcript.text) {
//         setTranscriptText(data.transcript.text)
//       }
//     } catch (error) {
//       console.error('Error transcribing uploaded video:', error)
//     } finally {
//       setIsLoading(false)
//     }
//   }
//
//   const handleFileSelect = (file) => {
//     setSelectedFile(file)
//   }
//
//   const handleDrag = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true)
//     } else if (e.type === "dragleave") {
//       setDragActive(false)
//     }
//   }
//
//   const handleDrop = (e) => {
//     e.preventDefault()
//     e.stopPropagation()
//     setDragActive(false)
//
//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       handleFileSelect(e.dataTransfer.files[0])
//     }
//   }
//
//   const openFileDialog = () => {
//     fileInputRef.current?.click()
//   }
//
//   const removeFile = () => {
//     setSelectedFile(null)
//   }
//
//   return (
//     <div className="space-y-6">
//       {/* Tab Navigation */}
//       <div className="flex space-x-1 bg-muted p-1 rounded-lg">
//         <Button
//           variant={activeTab === "youtube" ? "default" : "ghost"}
//           onClick={() => setActiveTab("youtube")}
//           className="flex-1"
//         >
//           <Link className="w-4 h-4 mr-2" />
//           YouTube Link
//         </Button>
//         <Button
//           variant={activeTab === "upload" ? "default" : "ghost"}
//           onClick={() => setActiveTab("upload")}
//           className="flex-1"
//         >
//           <Upload className="w-4 h-4 mr-2" />
//           Upload Video
//         </Button>
//       </div>
//
//       {/* YouTube Link Tab */}
//       {activeTab === "youtube" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Transcribe from YouTube</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <Input
//                 type="url"
//                 placeholder="Enter YouTube video URL"
//                 value={youtubeLink}
//                 onChange={(e) => setYoutubeLink(e.target.value)}
//               />
//             </div>
//             <Button 
//               onClick={handleYoutubeSubmit} 
//               disabled={!youtubeLink.trim() || isLoading}
//               className="w-full"
//             >
//               {isLoading ? "Transcribing..." : "Upload"}
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//
//       {/* Upload Video Tab */}
//       {activeTab === "upload" && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Upload Video File</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div
//               className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
//                 dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25"
//               }`}
//               onDragEnter={handleDrag}
//               onDragLeave={handleDrag}
//               onDragOver={handleDrag}
//               onDrop={handleDrop}
//             >
//               {selectedFile ? (
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-center space-x-2">
//                     <span className="text-sm font-medium">{selectedFile.name}</span>
//                     <Button
//                       size="sm"
//                       variant="ghost"
//                       onClick={removeFile}
//                       className="h-6 w-6 p-0"
//                     >
//                       <X className="h-4 w-4" />
//                     </Button>
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
//                   </p>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
//                   <div className="space-y-1">
//                     <p className="text-sm font-medium">Drop your video file here</p>
//                     <p className="text-xs text-muted-foreground">or click to browse</p>
//                   </div>
//                 </div>
//               )}
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 accept="video/*"
//                 onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
//                 className="hidden"
//               />
//               {!selectedFile && (
//                 <Button
//                   variant="outline"
//                   onClick={openFileDialog}
//                   className="mt-2"
//                 >
//                   Browse Files
//                 </Button>
//               )}
//             </div>
//             <Button 
//               onClick={handleFileUpload} 
//               disabled={!selectedFile || isLoading}
//               className="w-full"
//             >
//               {isLoading ? "Transcribing..." : "Upload"}
//             </Button>
//           </CardContent>
//         </Card>
//       )}
//
//       {/* Transcript Display */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Transcript</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Textarea
//             placeholder="Transcript will appear here..."
//             value={transcriptText}
//             readOnly
//             className="min-h-[300px] resize-none"
//           />
//         </CardContent>
//       </Card>
//     </div>
//   )
// }
//

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Link, X, Brain, BookOpen } from "lucide-react"

export function Transcribe() {
  const [activeTab, setActiveTab] = useState("youtube")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [transcriptText, setTranscriptText] = useState("")
  const [summaryQuizData, setSummaryQuizData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const fileInputRef = useRef(null)

  const handleYoutubeSubmit = async () => {
    if (!youtubeLink.trim()) return
    
    setIsLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/transcribe/youtube', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ url: youtubeLink }),
      })
      
      const data = await response.json()
      if (data.transcript) {
        setTranscriptText(data.transcript)
        setSummaryQuizData(data.summaryQuiz)
        resetQuiz()
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
      const token = localStorage.getItem('token')
      const response = await fetch('http://localhost:4000/api/transcribe/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      })
      
      const data = await response.json()
      if (data.transcript) {
        setTranscriptText(data.transcript)
        setSummaryQuizData(data.summaryQuiz)
        resetQuiz()
      }
    } catch (error) {
      console.error('Error transcribing uploaded video:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const resetQuiz = () => {
    setShowQuiz(false)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setScore(0)
  }

  const handleStartQuiz = () => {
    setShowQuiz(true)
    setCurrentQuestion(0)
    setSelectedAnswers({})
    setQuizCompleted(false)
    setScore(0)
  }

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < summaryQuizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      completeQuiz()
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const completeQuiz = () => {
    let correctAnswers = 0
    summaryQuizData.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.answer) {
        correctAnswers++
      }
    })
    setScore(correctAnswers)
    setQuizCompleted(true)
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

  if (showQuiz && summaryQuizData) {
    if (quizCompleted) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz Results
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="text-4xl font-bold text-primary">
                  {score}/{summaryQuizData.questions.length}
                </div>
                <p className="text-lg">
                  You got {score} out of {summaryQuizData.questions.length} questions correct!
                </p>
                <div className="flex gap-2 justify-center">
                  <Button onClick={() => setShowQuiz(false)}>
                    Back to Transcript
                  </Button>
                  <Button onClick={handleStartQuiz} variant="outline">
                    Retry Quiz
                  </Button>
                </div>
              </div>
              
              {summaryQuizData.recommendations && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Recommended Resources</h3>
                  <div className="grid gap-2">
                    {summaryQuizData.recommendations.map((rec, index) => (
                      <Button 
                        key={index}
                        variant="outline" 
                        className="justify-start"
                        onClick={() => window.open(rec.link, '_blank')}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        {rec.topic}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )
    }

    const question = summaryQuizData.questions[currentQuestion]
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Quiz - Question {currentQuestion + 1} of {summaryQuizData.questions.length}
              </span>
              <Button variant="outline" onClick={() => setShowQuiz(false)}>
                Back to Transcript
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{question.question}</h3>
              <div className="space-y-2">
                {question.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedAnswers[currentQuestion] === option ? "default" : "outline"}
                    className="w-full text-left justify-start h-auto p-4"
                    onClick={() => handleAnswerSelect(currentQuestion, option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handlePreviousQuestion}
                disabled={currentQuestion === 0}
              >
                Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
              >
                {currentQuestion === summaryQuizData.questions.length - 1 ? 'Complete Quiz' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
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

      {/* Summary Card */}
      {summaryQuizData && (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">
              {summaryQuizData.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Transcript Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Transcript
            {summaryQuizData && (
              <Button onClick={handleStartQuiz} className="flex items-center gap-2">
                <Brain className="w-4 h-4" />
                Start Quiz
              </Button>
            )}
          </CardTitle>
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
