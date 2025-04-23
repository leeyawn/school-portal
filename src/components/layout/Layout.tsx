import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
  userName?: string
  isLoggedIn?: boolean
}

export function Layout({ children, userName, isLoggedIn }: LayoutProps) {
  return (
    <div className="min-h-screen h-full w-full flex flex-col">
      <Header userName={userName} isLoggedIn={isLoggedIn} />
      <div className="flex flex-1 w-full relative">
        <Sidebar className="hidden md:block h-[calc(100vh-4rem)] sticky top-16 w- flex-shrink-0 overflow-y-auto" />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full max-w-[2000px] mx-auto overflow-x-hidden">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 
