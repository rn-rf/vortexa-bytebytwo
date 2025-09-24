// import { useNavigate } from "react-router-dom"
// import { Button } from "@/components/ui/button"
// import { ThemeToggle } from "@/components/ui/theme-toggle"
// import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
// import { Menu, LogOut } from "lucide-react"
//
// export function AuthenticatedNavigation() {
//   const navigate = useNavigate()
//
//   const handleLogout = () => {
//     navigate("/")
//   }
//
//   return (
//     <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
//       <div className="container flex h-16 items-center justify-between">
//         <div className="flex items-center space-x-2">
//           <h1 className="text-xl font-bold text-primary">QuiVid</h1>
//         </div>
//         {/* Desktop Navigation */}
//         <div className="hidden md:flex items-center space-x-4">
//           <Button variant="ghost" onClick={handleLogout}>
//             <LogOut className="mr-2 h-4 w-4" />
//             Logout
//           </Button>
//           <ThemeToggle />
//         </div>
//         {/* Mobile Navigation */}
//         <div className="md:hidden">
//           <Sheet>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <Menu className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent>
//               <SheetHeader>
//                 <SheetTitle>Menu</SheetTitle>
//               </SheetHeader>
//               <div className="flex flex-col space-y-4 mt-6">
//                 <Button variant="ghost" onClick={handleLogout} className="justify-start">
//                   <LogOut className="mr-2 h-4 w-4" />
//                   Logout
//                 </Button>
//                 <div className="flex items-center justify-between">
//                   <span className="text-sm font-medium">Theme</span>
//                   <ThemeToggle />
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>
//     </nav>
//   )
// }
//
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, LogOut } from "lucide-react"

export function AuthenticatedNavigation() {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token')
    // You might also want to remove other auth-related items
    localStorage.removeItem('user')
    localStorage.removeItem('refreshToken')
    
    // Navigate to login/home page
    navigate("/")
  }
  
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary">QuiVid</h1>
        </div>
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <ThemeToggle />
        </div>
        {/* Mobile Navigation */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
              </SheetHeader>
              <div className="flex flex-col space-y-4 mt-6">
                <Button variant="ghost" onClick={handleLogout} className="justify-start">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Theme</span>
                  <ThemeToggle />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
