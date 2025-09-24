// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Home, User, History, FileText } from "lucide-react"
// import { cn } from "@/lib/utils"
//
// export function Sidebar({ activeSection, onSectionChange }) {
//   const menuItems = [
//     {
//       id: "home",
//       label: "Home",
//       icon: Home,
//     },
//     {
//       id: "profile",
//       label: "Profile",
//       icon: User,
//     },
//     {
//       id: "history",
//       label: "History",
//       icon: History,
//     },
//     {
//       id: "notes",
//       label: "Notes",
//       icon: FileText,
//     },
//   ]
//
//   return (
//     <aside className="w-64 bg-card border-r h-[calc(100vh-4rem)] sticky top-16">
//       <div className="p-4">
//         <nav className="space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             return (
//               <Button
//                 key={item.id}
//                 variant={activeSection === item.id ? "default" : "ghost"}
//                 className={cn(
//                   "w-full justify-start",
//                   activeSection === item.id && "bg-primary text-primary-foreground"
//                 )}
//                 onClick={() => onSectionChange(item.id)}
//               >
//                 <Icon className="mr-2 h-4 w-4" />
//                 {item.label}
//               </Button>
//             )
//           })}
//         </nav>
//       </div>
//     </aside>
//   )
// }
//
//
//

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, User, History, FileText, Brain } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ activeSection, onSectionChange }) {
  const menuItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
    },
    {
      id: "history",
      label: "History",
      icon: History,
    },
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: Brain,
    },
  ]

  return (
    <aside className="w-64 bg-card border-r h-[calc(100vh-4rem)] sticky top-16">
      <div className="p-4">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeSection === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  activeSection === item.id && "bg-primary text-primary-foreground"
                )}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
