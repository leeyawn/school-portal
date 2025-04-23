import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
  userName?: string
  isLoggedIn?: boolean
}

export function Layout({ children, userName, isLoggedIn }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header userName={userName} isLoggedIn={isLoggedIn} />
      <div className="flex">
        <Sidebar className="hidden md:block h-[calc(100vh-4rem)] sticky top-16" />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
} 
