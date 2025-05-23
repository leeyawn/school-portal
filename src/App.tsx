import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Profile } from "./pages/Profile"
import { Login } from "./pages/Login"
import { Grades } from "./pages/Records/Grades"
import { Transcript } from "./pages/Records/Transcript"
import { NotFound } from "./pages/NotFound"
import { BrowseClasses } from "./pages/registration/BrowseClasses"
import { Schedule } from "./pages/registration/Schedule"
import { CurrentClasses } from "./pages/registration/CurrentClasses"
import { useState, useEffect } from "react"
import supabase from "./lib/supabase"
import { StudentProvider } from "./contexts/StudentContext"
import { StudentCoursesProvider } from "./contexts/StudentCoursesContext"
import { StudentGradesProvider } from "./contexts/StudentGradesContext"

function App() {
  const [user, setUser] = useState<{
    name: string | null;
    isLoggedIn: boolean;
  }>({
    name: null,
    isLoggedIn: false
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          name: session.user.user_metadata?.full_name || null,
          isLoggedIn: true
        })
      }
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser({ name: null, isLoggedIn: false })
      } else {
        setUser({
          name: session.user.user_metadata?.full_name || null,
          isLoggedIn: true
        })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogin = (userData: { name: string; isLoggedIn: boolean }) => {
    setUser(userData)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={
          user.isLoggedIn ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
        } />
        <Route path="/" element={
          user.isLoggedIn ? (
            <StudentProvider>
              <StudentCoursesProvider>
                <StudentGradesProvider>
                  <Layout>
                    <Outlet />
                  </Layout>
                </StudentGradesProvider>
              </StudentCoursesProvider>
            </StudentProvider>
          ) : <Navigate to="/login" replace />
        }>
          <Route index element={<Home />} />
          <Route path="profile" element={<Profile />} />
          <Route path="registration">
            <Route path="browse" element={<BrowseClasses />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="current" element={<CurrentClasses />} />
          </Route>
          <Route path="records">
            <Route path="grades" element={<Grades />} />
            <Route path="transcript" element={<Transcript />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App




