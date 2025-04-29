import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import sunyPolyLogo from "@/assets/images/suny-poly-logo.png"

export function Header() {
  return (
    <header className="border-b bg-[#003366] w-full">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
        
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src={sunyPolyLogo}
              alt="SUNY Poly" 
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <span className="text-white text-lg font-semibold">Student Portal</span>
        </div>
      </div>
    </header>
  )
} 


