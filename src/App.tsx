import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"
import { Profile } from "./pages/Profile"
import { Login } from "./pages/Login"
import { Grades } from "./pages/Grades"
import { Records } from "./pages/Records"
import { useState } from "react"

function App() {
  const [user, setUser] = useState<{
    name: string | null;
    isLoggedIn: boolean;
  }>({
    name: null,
    isLoggedIn: false
  })

  const handleLogin = (userData: { name: string; isLoggedIn: boolean }) => {
    setUser(userData)
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/*"
          element={
            user.isLoggedIn ? (
              <Layout userName={user.name || undefined} isLoggedIn={user.isLoggedIn}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/records" element={<Records />} />
                  <Route path="/records/grades" element={<Grades />} />
                  {/* more routes later */}
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App




