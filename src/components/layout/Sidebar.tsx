import { cn } from "@/lib/utils"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  User,
  BookOpen,
  FileText,
  Home,
  ChevronDown,
  LogOut,
  ExternalLink
} from "lucide-react"
import { useState } from "react"
import supabase from "@/lib/supabase"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const navigation = [
    {
      title: "Home",
      icon: Home,
      href: "/"
    },
    {
      title: "Student Profile",
      icon: User,
      href: "/profile"
    },
    {
      title: "Registration",
      icon: BookOpen,
      href: "/registration",
      children: [
        { title: "Current Classes", href: "/registration/current" },
        { title: "Browse Classes", href: "/registration/browse" },
        { title: "Student Schedule", href: "/registration/schedule" }
      ]
    },
    {
      title: "Student Records",
      icon: FileText,
      href: "/records",
      children: [
        { title: "View Grades", href: "/records/grades" },
        { title: "Academic Transcript", href: "/records/transcript" },
        { title: "Degree Works", href: "http://uti.degreeworks.suny.edu/", isExternal: true }
      ]
    },
    {
      title: "Housing & Dining",
      icon: Home,
      href: "https://banner.sunypoly.edu/BannerExtensibility/customPage/page/P_ZWGKTHOUSE_MAIN/",
      isExternal: true
    }
  ]

  const toggleExpand = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className={cn("w-64 border-r bg-sidebar transition-all duration-300 flex flex-col h-full", className)}>
      <nav className="space-y-2 p-4">
        {navigation.map((item) => (
          <div key={item.href} className="space-y-1">
            {item.children ? (
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-between px-3 py-2 hover:bg-accent/50"
                  onClick={() => toggleExpand(item.title)}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <ChevronDown 
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      expandedItems.includes(item.title) ? "rotate-180" : ""
                    )} 
                  />
                </Button>
                {expandedItems.includes(item.title) && (
                  <div className="ml-4 space-y-1 overflow-hidden transition-all duration-200">
                    {item.children.map((child) => (
                      <Button
                        key={child.href}
                        variant="ghost"
                        className={cn(
                          "w-full justify-start px-3 py-1.5 text-sm transition-colors",
                          location.pathname === child.href 
                            ? "bg-accent text-accent-foreground" 
                            : "hover:bg-accent/50"
                        )}
                        asChild
                      >
                        <Link 
                          to={child.href}
                          {...(child.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                          <span className="text-sm">{child.title}</span>
                          {child.isExternal && <ExternalLink className="h-3 w-3 ml-1 inline-block" />}
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-2 transition-colors",
                  location.pathname === item.href 
                    ? "bg-accent text-accent-foreground" 
                    : "hover:bg-accent/50"
                )}
                asChild
              >
                <Link 
                  to={item.href}
                  {...(item.isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.title}</span>
                  {item.isExternal && <ExternalLink className="h-3 w-3 ml-1 inline-block" />}
                </Link>
              </Button>
            )}
          </div>
        ))}
      </nav>
      <div className="absolute w-full bottom-0 p-4 border-t mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Sign Out</span>
        </Button>
      </div>
    </div>
  )
} 


