import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MicrosoftLogo } from "@/components/ui/microsoft-logo"
import { useNavigate } from "react-router-dom"

interface LoginProps {
  onLogin: (user: { name: string; isLoggedIn: boolean }) => void
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()

  const handleMicrosoftLogin = async () => {
    try {
      // TODO: Implement actual Microsoft authentication
      // This is a mock implementation
      const mockUser = {
        name: "John Doe",
        isLoggedIn: true
      }
      
      onLogin(mockUser)
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
    }
  }

  return (
    <div className="h-screen w-screen fixed inset-0 grid place-content-center">
      <Card className="w-80">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Welcome Back</CardTitle>
          <CardDescription className="text-center">
            Please sign in with your Microsoft school account to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleMicrosoftLogin}
            className="w-full text-white"
          >
            <MicrosoftLogo className="mr-2 h-5 w-5" />
            Sign in with Microsoft
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 