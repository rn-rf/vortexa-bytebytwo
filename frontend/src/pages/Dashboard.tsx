// import { useState } from "react"
// import { Navigation } from "@/components/navigation"
// import { Sidebar } from "@/components/sidebar"
// import { Transcribe } from "@/components/transcribe"
//
// export function Dashboard() {
//   const [activeSection, setActiveSection] = useState("home")
//
//   const renderContent = () => {
//     switch (activeSection) {
//       case "home":
//         return (
//           <div className="space-y-6">
//             <div>
//               <h1 className="text-3xl font-bold mb-2">Welcome to QuiVid</h1>
//               <p className="text-muted-foreground">
//                 Transform your videos into text with our powerful transcription service.
//               </p>
//             </div>
//             <Transcribe />
//           </div>
//         )
//       case "profile":
//         return (
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">Profile</h1>
//             <p className="text-muted-foreground">Profile page coming soon...</p>
//           </div>
//         )
//       case "history":
//         return (
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">History</h1>
//             <p className="text-muted-foreground">History page coming soon...</p>
//           </div>
//         )
//       case "notes":
//         return (
//           <div className="space-y-6">
//             <h1 className="text-3xl font-bold">Notes</h1>
//             <p className="text-muted-foreground">Notes page coming soon...</p>
//           </div>
//         )
//       default:
//         return (
//           <div className="space-y-6">
//             <Transcribe/>
//           </div>
//         )
//     }
//   }
//
//   return (
//     <div className="min-h-screen bg-background">
//       <Navigation />
//       <div className="flex">
//         <Sidebar 
//           activeSection={activeSection} 
//           onSectionChange={setActiveSection} 
//         />
//         <main className="flex-1 p-6">
//           <div className="max-w-4xl mx-auto">
//             {renderContent()}
//           </div>
//         </main>
//       </div>
//     </div>
//   )
// }
//
//
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Sidebar } from "@/components/sidebar"
import { Transcribe } from "@/components/transcribe"

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("home")

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
            <h1 className="text-3xl font-bold">Profile</h1>
            <p className="text-muted-foreground">Profile page coming soon...</p>
          </div>
        )
      case "history":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">History</h1>
            <p className="text-muted-foreground">History page coming soon...</p>
          </div>
        )
      case "notes":
        return (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Notes</h1>
            <p className="text-muted-foreground">Notes page coming soon...</p>
          </div>
        )
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
      <Navigation />
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
