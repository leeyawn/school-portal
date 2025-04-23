import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu } from "lucide-react"
import { Link } from "react-router-dom"
import sunyPolyLogo from "@/assets/images/suny-poly-logo.png"
import userProfilePic from "@/assets/images/user-profile.jpg"

interface HeaderProps {
  userName?: string
  isLoggedIn?: boolean
}

export function Header({ userName, isLoggedIn = false }: HeaderProps) {
  return (
    <header className="border-b bg-[#003366] w-full">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden text-white">
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
          {isLoggedIn ? (
            <Link to="/profile">
              <Button variant="outline">
                <span className="text-white">Account</span>
                <Avatar className="h-7 w-7 rounded-md">
                  <AvatarImage src={userProfilePic} alt={userName} />
                  <AvatarFallback className="bg-blue-500 text-white">
                    {userName?.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </Link>
          ) : (
            <div className="space-x-2">
              <Button variant="ghost" className="text-white">Sign In</Button>
              <Button variant="ghost" className="text-white">Guest Sign In</Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
} 


