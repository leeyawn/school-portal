import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import {
  User,
  GraduationCap,
  BookOpen,
  FileText,
  CreditCard,
  Heart,
  Home,
  School,
  Settings
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const navigation = [
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
        { title: "Register for Classes", href: "/registration/register" },
        { title: "Browse Classes", href: "/registration/browse" },
        { title: "Student Schedule", href: "/registration/schedule" },
        { title: "Prepare for Registration", href: "/registration/prepare" }
      ]
    },
    {
      title: "Student Records",
      icon: FileText,
      href: "/records",
      children: [
        { title: "View Grades", href: "/records/grades" },
        { title: "Academic Transcript", href: "/records/transcript" },
        { title: "Degree Works", href: "/records/degree-works" }
      ]
    },
    {
      title: "Financial Aid",
      icon: CreditCard,
      href: "/financial-aid",
      children: [
        { title: "My Eligibility", href: "/financial-aid/eligibility" },
        { title: "My Award Information", href: "/financial-aid/awards" }
      ]
    },
    {
      title: "Health Center",
      icon: Heart,
      href: "/health"
    },
    {
      title: "Housing & Dining",
      icon: Home,
      href: "/housing"
    },
    {
      title: "Personal Information",
      icon: Settings,
      href: "/personal"
    }
  ]

  return (
    <div className={cn("pb-12 w-64 border-r bg-white", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </Link>
                {item.children && (
                  <div className="ml-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        to={child.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-500 transition-all hover:text-gray-900 hover:bg-gray-100"
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
} 


