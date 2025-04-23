import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Home } from "./pages/Home"

function App() {
  // Mock user state !
  const user = {
    name: "Leon Letournel",
    isLoggedIn: true
  }

  return (
    <Router>
      <Layout userName={user.name} isLoggedIn={user.isLoggedIn}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* Add more routes as needed */}
        </Routes>
      </Layout>
    </Router>
  )
}

export default App




