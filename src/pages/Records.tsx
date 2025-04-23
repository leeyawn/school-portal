import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { FileText, GraduationCap, History } from "lucide-react"

export function Records() {
  const navigate = useNavigate()

  const recordsOptions = [
    {
      title: "View Grades",
      description: "View your academic grades and performance",
      icon: GraduationCap,
      path: "/records/grades"
    },
    {
      title: "Academic Transcript",
      description: "View your complete academic history",
      icon: History,
      path: "/records/transcript"
    },
    {
      title: "Degree Works",
      description: "Access and download your official transcripts",
      icon: FileText,
      href: "http://uti.degreeworks.suny.edu/"
    }
  ]

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Student Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recordsOptions.map((option) => (
              <Button
                key={option.path}
                variant="outline"
                className="h-auto p-6 flex flex-col items-start gap-2 text-left hover:bg-accent"
                onClick={() => navigate(option.path)}
              >
                <div className="flex items-center gap-2">
                  <option.icon className="h-5 w-5" />
                  <span className="font-semibold">{option.title}</span>
                </div>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 