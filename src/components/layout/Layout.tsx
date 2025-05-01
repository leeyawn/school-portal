import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
  userName?: string
  isLoggedIn?: boolean
}

export function Layout({ children, userName, isLoggedIn }: LayoutProps) {
  return (
    <div className="min-h-screen h-full w-full">
      <Header className="fixed top-0 left-0 right-0 z-50" />
      <div className="pt-16 flex w-full min-h-[calc(100vh-4rem)]">
        <Sidebar className="md:block h-[calc(100vh-4rem)] sticky top-16 flex-shrink-0 overflow-y-auto" />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full overflow-x-hidden">
          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  )
}