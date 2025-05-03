import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import supabase, { Student } from "@/lib/supabase"

export function Profile() {
  const [studentInfo, setStudentInfo] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStudentData() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session?.user?.email) {
          throw new Error('No user session found')
        }

        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('*')
          .eq('email', session.user.email)
          .single()

        if (studentError) throw studentError
        setStudentInfo(studentData)
      } catch (err) {
        console.error('Error fetching data:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch data')
      } finally {
        setLoading(false)
      }
    }

    fetchStudentData()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[60vh] text-red-500">Error: {error}</div>
  }

  if (!studentInfo) {
    return <div className="flex justify-center items-center min-h-[60vh]">No student data found</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Profile</h1>
          <div className="text-xl font-semibold text-gray-800 mt-2">
            {studentInfo.first_name} {studentInfo.last_name}
          </div>
          <div className="text-lg font-medium text-gray-700 mt-1">
            ID: {studentInfo.student_id}
          </div>
        </div>
        <div className="text-sm text-gray-500">
          Standing: Good Standing as of Fall 2024
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bio Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Email:</label>
              <div>{studentInfo.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone:</label>
              <div>{studentInfo.phone || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender:</label>
              <div>{studentInfo.gender || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth:</label>
              <div>{studentInfo.dob ? new Date(studentInfo.dob + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ethnicity:</label>
              <div>{studentInfo.ethnicity || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Race:</label>
              <div>{studentInfo.race || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Citizen:</label>
              <div>{studentInfo.citizen || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status:</label>
              <div>{studentInfo.currentstatus || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emergency Contact:</label>
              <div>{studentInfo.emercon || 'Not Provided'}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CURRICULUM, HOURS & GPA</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Level:</label>
              <div>{studentInfo.level || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Program:</label>
              <div>{studentInfo.program || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">College:</label>
              <div>{studentInfo.college || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Major:</label>
              <div>{studentInfo.major || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department:</label>
              <div>{studentInfo.department || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Concentration:</label>
              <div>{studentInfo.concentration || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Minor:</label>
              <div>{studentInfo.minor || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Admit Type:</label>
              <div>{studentInfo.admittype || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Admit Term:</label>
              <div>{studentInfo.admitterm || 'Not Provided'}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Catalog Term:</label>
              <div>{studentInfo.catalogterm || 'Not Provided'}</div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Overall GPA:</label>
                <div>{studentInfo.gpa || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Hours:</label>
                <div>{studentInfo.totalhours || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Registered Hours:</label>
                <div>{studentInfo.reghours || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Billing Hours:</label>
                <div>{studentInfo.billhours || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CEU Hours:</label>
                <div>{studentInfo.ceuhours || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Min Hours:</label>
                <div>{studentInfo.minhours || 'Not Available'}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Hours:</label>
                <div>{studentInfo.maxhours || 'Not Available'}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 













