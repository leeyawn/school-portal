import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import supabase, { GradesData, fetchStudentGrades } from "@/lib/supabase"

export function Grades() {
  const [gradesData, setGradesData] = useState<GradesData>({ grades: [], semesters: [] })
  const [selectedSemester, setSelectedSemester] = useState("All Semesters")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchGrades() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          throw new Error('No user session found')
        }

        // Get the student ID
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('student_id')
          .eq('email', session.user.email)
          .single()

        if (studentError) throw studentError

        // Fetch grades using the supabase function
        const { data, error } = await fetchStudentGrades(studentData.student_id)
        if (error) throw error
        if (data) setGradesData(data)
      } catch (err) {
        console.error('Error fetching grades:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch grades')
      } finally {
        setLoading(false)
      }
    }

    fetchGrades()
  }, [])

  const filteredGrades = selectedSemester === "All Semesters"
    ? gradesData.grades
    : gradesData.grades.filter(grade => grade.semester === selectedSemester)

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
          <h1 className="text-2xl font-semibold">View Grades</h1>
          <p className="text-md text-gray-600 mt-1">View your academic performance and grades for each semester</p>
        </div>
        <Select
          value={selectedSemester}
          onValueChange={setSelectedSemester}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {gradesData.semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Academic Grades</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGrades.length === 0 ? (
            <div className="text-center py-8 text-gray-500">No grades available for this semester</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Code</TableHead>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Midterm Grade</TableHead>
                  <TableHead>Final Grade</TableHead>
                  <TableHead>Semester</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGrades.map((grade, index) => (
                  <TableRow key={index}>
                    <TableCell>{grade.courseCode}</TableCell>
                    <TableCell>{grade.courseName}</TableCell>
                    <TableCell>{grade.credits}</TableCell>
                    <TableCell>{grade.midgrade ?? '-'}</TableCell>
                    <TableCell>{grade.fingrade ?? '-'}</TableCell>
                    <TableCell>{grade.semester}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 


