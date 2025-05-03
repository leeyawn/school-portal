import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MicrosoftLogo } from "@/components/ui/microsoft-logo"
import { useNavigate, useLocation } from "react-router-dom"
import supabase, { getOrCreateStudent } from "@/lib/supabase"
import { useEffect, useState } from "react"

interface LoginProps {
  onLogin: (user: { name: string; isLoggedIn: boolean }) => void
}

export function Login({ onLogin }: LoginProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthSession = async () => {
      // Clear any previous errors
      setError(null)

      // Check for error in URL
      const params = new URLSearchParams(location.search)
      const hashParams = new URLSearchParams(location.hash?.substring(1) || '')
      
      if (params.get('error') || hashParams.get('error')) {
        const errorDesc = params.get('error_description') || hashParams.get('error_description')
        setError(errorDesc ? decodeURIComponent(errorDesc.replace(/\+/g, ' ')) : 'Authentication failed')
        return
      }

      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      
      if (sessionError) {
        console.error("Session error:", sessionError)
        setError("Failed to get session")
        return
      }
      
      if (session?.user) {
        try {
          const { data: student, error: studentError } = await getOrCreateStudent(
            session.user.email || '',
            session.user.user_metadata?.full_name || 'Unknown Student'
          )

          if (studentError) {
            console.error("Student error:", studentError)
            setError("Failed to access student information")
            return
          }

          if (student) {
            onLogin({
              name: `${student.first_name} ${student.last_name}`,
              isLoggedIn: true
            })
            
            // If student is in pending status, redirect to profile page to complete registration
            if (student.currentstatus === 'Pending') {
              navigate("/profile")
            } else {
              navigate("/")
            }
          }
        } catch (error) {
          console.error("Student data error:", error)
          setError("Failed to process student information")
        }
      }
    }

    handleAuthSession()
  }, [location, navigate, onLogin])

  const handleMicrosoftLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'azure',
        options: {
          scopes: 'email profile openid user.read',
          redirectTo: window.location.origin + '/login',
          queryParams: {
            prompt: 'select_account'
          }
        }
      })

      if (error) throw error
    } catch (error) {
      console.error("Login failed:", error)
      setError("Failed to initiate login. Please try again.")
    } finally {
      setLoading(false)
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
        <CardContent className="space-y-4">
          {error && (
            <div className="text-sm text-red-500 text-center">
              {error}
            </div>
          )}
          <Button
            onClick={handleMicrosoftLogin}
            className="w-full"
            disabled={loading}
          >
            <MicrosoftLogo className="mr-2 h-5 w-5" />
            {loading ? "Signing in..." : "Sign in with Microsoft"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 