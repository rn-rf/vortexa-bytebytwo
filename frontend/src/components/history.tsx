// History.jsx
import { useEffect, useState } from "react"
import { Search, Download, Trash2, Calendar, Clock, FileText } from "lucide-react"

export const History = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [historyItems, setHistoryItems] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
  
  try {
    const token = localStorage.getItem('token')
    console.log(token)
    if (!token) throw new Error("No auth token found")

    const response = await fetch('http://localhost:4000/api/transcribe/getAllTranscripts', {
      method: 'GET',
      headers: {
        'token': `Bearer ${token}`
      }
    })

    // First get response text for safe parsing
    const text = await response.text()
    let data
    try {
      data = JSON.parse(text)
    } catch (err) {
      console.error("Failed to parse JSON response:", text)
      throw new Error("Invalid JSON response from server")
    }

    if (!data.success) {
      console.error("Server returned error:", data.message)
      return
    }

    // Map backend data to frontend format
    const formattedItems = data.transcripts.map((t, index) => {
      const createdAt = new Date(t.createdAt)
      return {
        // id: t._id || index,
        title: `Transcript - ${createdAt.toLocaleDateString()}`,
        date: createdAt.toLocaleDateString(),
        time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        // duration: "N/A", // can extend later if needed
        // type: "audio/video", // can extend if you store type
        status: "completed", // if transcript exists, assume completed
        transcriptLength: t.transcript ? `${t.transcript.split(" ").length} words` : null,
        transcript: t.transcript,
        summary: t.summaryQuiz?.summary || "",
        // questions: t.summaryQuiz?.questions || [],
        // recommendations: t.summaryQuiz?.recommendations || [],
        // isSaved: t.isSaved
      }
    })

    if(formattedItems.length == 0){
      setHistoryItems([ { id: 1, title: "Meeting Recording - Q4 Planning", date: "2024-01-15", time: "14:30", duration: "45m", type: "video", status: "completed", transcriptLength: "2,340 words" }, { id: 2, title: "Interview with John Smith", date: "2024-01-14", time: "10:15", duration: "30m", type: "audio", status: "completed", transcriptLength: "1,850 words" }, { id: 3, title: "Product Demo Recording", date: "2024-01-12", time: "16:00", duration: "20m", type: "video", status: "processing", transcriptLength: null }, { id: 4, title: "Customer Feedback Call", date: "2024-01-10", time: "11:30", duration: "25m", type: "audio", status: "completed", transcriptLength: "1,200 words" } ])
    }else {
      setHistoryItems(formattedItems)
    }
    console.log(formattedItems)
  } catch (error) {
    console.error("Error fetching history:", error)
  } 
}
    fetchHistory()
  }, [])

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || item.type === filterType
    return matchesSearch && matchesFilter
  })

  const handleDownload = (item) => {
    const blob = new Blob([item.transcriptLength], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${item.title}.txt`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleDelete = async (id) => {
    console.log("Deleting item:", id)
    // Call your backend delete route here
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Transcription History</h1>
        <p className="text-muted-foreground">
          View and manage your previous transcriptions
        </p>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <input
            type="text"
            placeholder="Search transcriptions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-background"
        >
          <option value="all">All Types</option>
          <option value="video">Video</option>
          <option value="audio">Audio</option>
        </select>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No transcriptions found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search terms" : "Start by uploading your first video or audio file"}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-medium text-lg">{item.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.status === 'completed' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {item.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {item.time}
                    </div>
                    <div>
                      Duration: {item.duration}
                    </div>
                    <div className="capitalize">
                      Type: {item.type}
                    </div>
                  </div>

                  {item.transcriptLength && (
                    <p className="text-sm text-muted-foreground">
                      Transcript: {item.transcriptLength}
                    </p>
                  )}

                  {/* Extra: show summary, questions, recommendations */}
                  {item.summary && (
                    <p className="text-sm mt-2"><strong>Summary:</strong> {item.summary}</p>
                  )}
                  {item.questions?.length > 0 && (
                    <div className="mt-2 text-sm">
                      <strong>Questions:</strong>
                      <ul className="list-disc pl-5">
                        {item.questions.map((q, i) => (
                          <li key={i}>{q.question}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {item.recommendations?.length > 0 && (
                    <div className="mt-2 text-sm">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc pl-5">
                        {item.recommendations.map((r, i) => (
                          <li key={i}>
                            <a href={r.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {r.topic}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {item.status === 'completed' && (
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
                      title="Download transcript"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete transcription"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
