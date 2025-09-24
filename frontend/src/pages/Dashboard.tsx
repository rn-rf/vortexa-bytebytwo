import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AuthenticatedNavigation } from "@/components/authenticated-navigation"
import { Sidebar } from "@/components/sidebar"
import { Transcribe } from "@/components/transcribe"
import { ProfileComponent } from "@/components/profile"
import { History } from "@/components/history"
import { Notes } from "@/components/notes"
import { Flashcards } from "@/components/flashcards"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate("/")
    }
  }, [navigate])

  const renderContent = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to QuiVid</h1>
              <p className="text-muted-foreground">
                Transform your videos into text with our powerful transcription service.
              </p>
            </div>
            <Transcribe />
          </div>
        )
      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Profile</h1>
              <p className="text-muted-foreground">
                Manage your account settings and personal information.
              </p>
            </div>
            <ProfileComponent />
          </div>
        )
      case "history":
        return <History />
      case "notes":
        return <Notes />
      case "flashcards":
        return <Flashcards />
      default:
        return (
          <div className="space-y-6">
            <Transcribe />
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AuthenticatedNavigation />
      <div className="flex">
        <Sidebar 
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
