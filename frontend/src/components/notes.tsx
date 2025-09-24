// Notes.jsx
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export function Notes() {
  const [notes] = useState([
    {
      id: 1,
      type: "Meeting",
      title: "Q4 Planning",
      date: "2024-01-15",
      content: [
        "Discussed project milestones, deadlines, and resource allocation.",
        "Agreed on prioritizing feature X in the upcoming sprint.",
        "Noted blockers for marketing integration and assigned action items."
      ]
    },
    {
      id: 2,
      type: "Interview",
      title: "John Smith",
      date: "2024-01-14",
      content: [
        "Candidate showed strong problem-solving skills and experience with React and Node.js.",
        "Recommended for frontend tasks.",
        "Follow-up interview scheduled to evaluate teamwork skills and system design knowledge."
      ]
    },
    {
      id: 3,
      type: "Demo",
      title: "Product Demo",
      date: "2024-01-12",
      content: [
        "Demo went smoothly; users appreciated the new dashboard layout and faster load times.",
        "Received feedback to improve mobile responsiveness.",
        "Adjust color scheme for accessibility."
      ]
    }
  ])

  const resetAll = () => console.log("Reset notes view")

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-blue-900">Notes</h2>
        <Button
          onClick={resetAll}
          variant="outline"
          className="border-blue-700 text-blue-800 hover:bg-blue-50"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset View
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-8">
        {notes.map((note) => (
          <Card
            key={note.id}
            className="w-full bg-blue-800 text-white shadow-md rounded-2xl hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="border-b border-blue-700 px-8 py-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-blue-300 uppercase">{note.type}</span>
                <span className="text-xs text-blue-300">{note.date}</span>
              </div>
              <CardTitle className="text-xl font-bold text-white">{note.title}</CardTitle>
            </CardHeader>
            <CardContent className="px-8 py-6 space-y-4">
              {note.content.map((line, index) => (
                <p
                  key={index}
                  className="text-base leading-relaxed text-blue-100"
                >
                  {line}
                </p>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
