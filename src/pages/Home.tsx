import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  CreditCard,
  Bell
} from "lucide-react"

export function Home() {
  const quickActions = [
    {
      title: "Register for Classes",
      icon: BookOpen,
      href: "/registration/register",
      color: "text-blue-600"
    },
    {
      title: "View Grades",
      icon: FileText,
      href: "/records/grades",
      color: "text-green-600"
    },
    {
      title: "Degree Works",
      icon: GraduationCap,
      href: "/records/degree-works",
      color: "text-purple-600"
    },
    {
      title: "Financial Aid",
      icon: CreditCard,
      href: "/financial-aid",
      color: "text-orange-600"
    }
  ]

  const announcements = [
    {
      title: "Fall 2024 Registration Opens",
      date: "March 15, 2024",
      description: "Registration for Fall 2024 semester begins on April 1st. Please check your registration time ticket."
    },
    {
      title: "Financial Aid Deadline",
      date: "March 10, 2024",
      description: "FAFSA deadline for the 2024-2025 academic year is approaching. Submit your application by March 31st."
    }
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Welcome Back!</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.href} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {action.title}
              </CardTitle>
              <action.icon className={`h-4 w-4 ${action.color}`} />
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="p-0 h-auto">
                Access Now →
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {announcements.map((announcement, i) => (
                <div key={i} className="flex gap-4">
                  <Bell className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium">{announcement.title}</h3>
                    <p className="text-sm text-gray-500">{announcement.date}</p>
                    <p className="text-sm mt-1">{announcement.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Quick Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              <Button variant="outline" className="justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Academic Calendar
              </Button>
              <Button variant="outline" className="justify-start">
                <BookOpen className="mr-2 h-4 w-4" />
                Course Catalog
              </Button>
              <Button variant="outline" className="justify-start">
                <CreditCard className="mr-2 h-4 w-4" />
                Make a Payment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 








