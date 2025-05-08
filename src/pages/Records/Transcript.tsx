import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"
import { useStudent } from "@/contexts/StudentContext"
import { useStudentGrades } from "@/contexts/StudentGradesContext"

export function Transcript() {
  const { student: studentInfo, loading: studentLoading, error: studentError } = useStudent()
  const { gradesData, loading: gradesLoading, error: gradesError } = useStudentGrades()

  const handlePrint = () => {
    window.print()
  }

  if (studentLoading || gradesLoading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  if (studentError || gradesError) {
    return <div className="flex justify-center items-center min-h-[60vh] text-red-500">
      Error: {studentError || gradesError}
    </div>
  }

  if (!studentInfo || !gradesData) {
    return <div className="flex justify-center items-center min-h-[60vh]">No data found</div>
  }

  // Filter out semesters that only contain in-progress courses
  const semesters = gradesData.semesters
    .filter(semester => semester !== "All Semesters")
    .filter(semester => {
      // Check if this semester has any courses
      return gradesData.grades.some(grade => grade.semester === semester)
    })

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex justify-between items-center print:hidden">
        <div>
          <h1 className="text-2xl font-semibold">Academic Transcript</h1>
          <p className="text-md text-gray-600 mt-1">View your complete academic record</p>
        </div>
        <Button onClick={handlePrint} className="print:hidden">
          <Printer className="mr-2 h-4 w-4" />
          Print Transcript
        </Button>
      </div>

      {/* Student Information */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:gap-2">
        <div>
          <div className="font-medium">Student ID:</div>
          <div>{studentInfo.student_id}</div>
        </div>
        <div>
          <div className="font-medium">Name:</div>
          <div>{studentInfo.first_name} {studentInfo.last_name}</div>
        </div>
        <div>
          <div className="font-medium">Total Hours:</div>
          <div>{studentInfo.totalhours || 'Not Available'}</div>
        </div>
        <div>
          <div className="font-medium">Registered Hours:</div>
          <div>{studentInfo.reghours || 'Not Available'}</div>
        </div>
      </div>

      {/* Course History */}
      {semesters.map((semester) => (
        <div key={semester} className="break-inside-avoid mb-8 print:mb-6">
          <div className="font-semibold text-lg mb-4 print:text-base">{semester}</div>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-900">
                <th className="text-left py-3 px-4">Course</th>
                <th className="text-left py-3 px-4">Title</th>
                <th className="text-center py-3 px-4">Credits</th>
                <th className="text-center py-3 px-4">Final</th>
              </tr>
            </thead>
            <tbody>
              {gradesData.grades
                .filter(grade => grade.semester === semester)
                .map((grade, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{grade.courseCode}</td>
                    <td className="py-3 px-4">{grade.courseName}</td>
                    <td className="text-center py-3 px-4">{grade.credits}</td>
                    <td className="text-center py-3 px-4">{grade.fingrade || '-'}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
} 