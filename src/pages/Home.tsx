import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  FileText, 
  GraduationCap, 
  CreditCard,
  Bell,
  Calendar,
  ChevronRight
} from "lucide-react"

export function Home() {
  const quickActions = [
    {
      title: "Register for Classes",
      icon: BookOpen,
      href: "/registration/register",
      color: "text-blue-600",
      description: "View and register for available courses"
    },
    {
      title: "View Grades",
      icon: FileText,
      href: "/records/grades",
      color: "text-green-600",
      description: "Check your academic performance"
    },
    {
      title: "Degree Works",
      icon: GraduationCap,
      href: "http://uti.degreeworks.suny.edu/",
      color: "text-purple-600",
      description: "Track your degree progress"
    },
    {
      title: "Financial Aid",
      icon: CreditCard,
      href: "/financial-aid",
      color: "text-orange-600",
      description: "Manage your financial aid"
    }
  ]

  const announcements = [
    {
      title: "Fall 2024 Registration Opens",
      date: "March 15, 2024",
      description: "Registration for Fall 2024 semester begins on April 1st. Please check your registration time ticket.",
      type: "important"
    },
    {
      title: "Financial Aid Deadline",
      date: "March 10, 2024",
      description: "FAFSA deadline for the 2024-2025 academic year is approaching. Submit your application by March 31st.",
      type: "warning"
    }
  ]

  const upcomingEvents = [
    {
      title: "Career Fair",
      date: "April 5, 2024",
      time: "10:00 AM - 2:00 PM",
      location: "Student Center"
    },
    {
      title: "Academic Advising Week",
      date: "April 8-12, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Academic Services"
    }
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Welcome Back!</h1>
          <p className="text-md text-gray-600 mt-1">Here's what's happening today</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => (
          <Card key={action.href} className="group hover:shadow-lg transition-all duration-200 hover:border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">
                  {action.title}
                </CardTitle>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </div>
              <div className={`p-3 rounded-full bg-primary/10 ${action.color}`}>
                <action.icon className="h-6 w-6" />
              </div>
            </CardHeader>
            <CardContent>
              <Button
                variant="ghost"
                className="w-full justify-between group-hover:text-primary"
                onClick={() => window.open(action.href, '_blank')}
              >
                Access Now
                <ChevronRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Announcements Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Announcements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {announcements.map((announcement, i) => (
                <div key={i} className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:rounded-full before:bg-primary/20">
                  <h3 className="font-medium">{announcement.title}</h3>
                  <p className="text-sm text-muted-foreground">{announcement.date}</p>
                  <p className="text-sm mt-1">{announcement.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {upcomingEvents.map((event, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{event.title}</h3>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                    <p className="text-sm text-muted-foreground">{event.time} • {event.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 








