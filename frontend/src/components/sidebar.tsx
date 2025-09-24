import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Home, User, History, FileText, CreditCard, ChevronDown, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ activeSection, onSectionChange }) {
  const [notesExpanded, setNotesExpanded] = useState(false)

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
    }
  ]

  const notesItems = [
    {
      id: "notes",
      label: "Notes",
      icon: FileText,
    },
    {
      id: "flashcards",
      label: "Flashcards",
      icon: CreditCard,
    }
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
          
          {/* Notes Section with Submenu */}
          <div>
            <Button
              variant="ghost"
              className="w-full justify-between"
              onClick={() => setNotesExpanded(!notesExpanded)}
            >
              <div className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Notes & Cards
              </div>
              {notesExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
            
            {notesExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {notesItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Button
                      key={item.id}
                      variant={activeSection === item.id ? "default" : "ghost"}
                      size="sm"
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
              </div>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}