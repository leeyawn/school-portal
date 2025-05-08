import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"
import { StudentCourse, dropCourse, fetchCourses } from "@/lib/supabase"
import { formatTime, formatDays } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useStudent } from "@/contexts/StudentContext"
import { useStudentCourses } from "@/contexts/StudentCoursesContext"
import { useStudentGrades } from "@/contexts/StudentGradesContext"

interface CourseCardProps {
  course: StudentCourse;
  onDrop: (courseCRN: number) => void;
}

function CourseCard({ course, onDrop }: CourseCardProps) {
  const [courseToDrop, setCourseToDrop] = useState<{ crn: number; title: string } | null>(null)

  return (
    <div className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start">
        <div className="space-y-4 flex-1">
          <div>
            <div className="font-semibold text-xl text-gray-900">
              {course.course?.subj} {course.course?.crs}-{course.course?.sec}
            </div>
            <div className="text-lg text-gray-800 mt-1">
              {course.course?.title}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-24 text-gray-500">CRN:</span>
                <span className="font-medium">{course.course_crn}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Instructor:</span>
                <span className="font-medium">{course.course?.instructor}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Schedule:</span>
                <span className="font-medium">{formatDays(course.course?.days || "")} {formatTime(course.course?.time || "")}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Location:</span>
                <span className="font-medium">{course.course?.building} {course.course?.room}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Credits:</span>
                <span className="font-medium">{course.course?.cr}</span>
              </div>
              <div className="flex items-center">
                <span className="w-24 text-gray-500">Enrolled:</span>
                <span className="font-medium">
                  {new Date(course.enrollment_date).toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric',
                    timeZone: 'UTC'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="default"
            className={`px-4 py-[7px] text-sm ${
              course.status === 'in_progress' ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50' : 
              course.status === 'completed' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-50' : 
              'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50'
            }`}
          >
            {course.status === 'in_progress' ? 'In Progress' : 
             course.status === 'completed' ? 'Completed' : 
             course.status}
          </Badge>
          {course.status === 'in_progress' && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setCourseToDrop({ crn: course.course_crn, title: course.course?.title || '' })}
                  className="ml-2"
                >
                  Drop
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure you want to drop this course?</AlertDialogTitle>
                  <AlertDialogDescription>
                    You are about to drop {course.course?.subj} {course.course?.crs}-{course.course?.sec}: {course.course?.title}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="!bg-destructive text-white hover:!bg-destructive/90"
                    onClick={() => {
                      if (courseToDrop) {
                        onDrop(courseToDrop.crn)
                      }
                    }}
                  >
                    Drop Course
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}

export function CurrentClasses() {
  const [selectedSemester, setSelectedSemester] = useState<string>("All Semesters")
  const { student, refreshStudent } = useStudent()
  const { courses, loading, error, refreshCourses } = useStudentCourses()
  const { refreshGrades } = useStudentGrades()

  const handleDropCourse = async (courseCRN: number) => {
    try {
      if (!student) {
        throw new Error('No student data found')
      }

      const { success, error } = await dropCourse(student.student_id, courseCRN)
      if (!success) throw error

      // Add a small delay to ensure database changes are propagated
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh all relevant contexts
      await Promise.all([
        refreshStudent(),
        refreshCourses(),
        refreshGrades()
      ])

      // Refresh the courses data to show updated availability
      const { data: updatedCourses, error: fetchError } = await fetchCourses()
      if (fetchError) throw fetchError
      
      // Update the courses state with the new data
      if (updatedCourses) {
        refreshCourses() // Use the context's refresh function instead of managing state directly
      }
    } catch (err) {
      console.error('Error dropping course:', err)
      throw err
    }
  }

  // Get unique semesters from courses
  const semesters = ["All Semesters", ...new Set(courses
    .map(course => course.course?.semester)
    .filter((semester): semester is string => semester !== undefined && semester !== null))]

  // Filter courses by selected semester
  const filteredCourses = selectedSemester === "All Semesters"
    ? courses
    : courses.filter(course => course.course?.semester === selectedSemester)

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[60vh] text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Current Classes</h1>
          <p className="text-md text-gray-600 mt-1">View and manage your registered courses for each semester</p>
        </div>
        <Select
          value={selectedSemester}
          onValueChange={setSelectedSemester}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Not Registered for Any Courses</div>
          ) : (
            <div className="space-y-8">
              {selectedSemester === "All Semesters" ? (
                // Group courses by semester when "All Semesters" is selected
                Object.entries(
                  courses.reduce((acc, course) => {
                    const semester = course.course?.semester || 'Unknown'
                    if (!acc[semester]) acc[semester] = []
                    acc[semester].push(course)
                    return acc
                  }, {} as Record<string, StudentCourse[]>)
                ).map(([semester, semesterCourses]) => (
                  <div key={semester} className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{semester}</h3>
                      <div className="h-px bg-gray-200 mt-2"></div>
                    </div>
                    <div className="space-y-4">
                      {semesterCourses.map((course) => (
                        <CourseCard key={course.course_crn} course={course} onDrop={handleDropCourse} />
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                // Show courses normally when a specific semester is selected
                <div className="space-y-4">
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.course_crn} course={course} onDrop={handleDropCourse} />
                  ))}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 







