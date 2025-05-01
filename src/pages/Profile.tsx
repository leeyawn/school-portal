import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"
import supabase, { Student, StudentCourse, fetchStudentCourses } from "@/lib/supabase"

export function Profile() {
  const [studentInfo, setStudentInfo] = useState<Student | null>(null)
  const [courses, setCourses] = useState<StudentCourse[]>([])
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

        // Fetch courses for the student
        if (studentData) {
          const { data: coursesData, error: coursesError } = await fetchStudentCourses(studentData.student_id)
          if (coursesError) throw coursesError
          setCourses(coursesData || [])
        }
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

      <Card>
        <CardHeader>
          <CardTitle>REGISTERED COURSES</CardTitle>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Not Registered</div>
          ) : (
            <div className="space-y-6">
              {courses.map((course) => (
                <div key={course.course_crn} className="border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex justify-between items-start">
                    <div className="space-y-4 flex-1">
                      <div>
                        <div className="font-semibold text-xl text-gray-900">
                          {course.course?.subj} {course.course?.crs}-{course.course?.sec}
                        </div>
                        <div className="text-lg text-gray-800 mt-1">
                          {course.course?.title}
                        </div>
                        <div className="text-sm text-gray-700 mt-2">
                          {course.course?.semester}
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
                            <span className="font-medium">{course.course?.days} {course.course?.time}</span>
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
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                      course.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                      course.status === 'completed' ? 'bg-green-100 text-green-800' : 
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {course.status === 'in_progress' ? 'In Progress' : 
                       course.status === 'completed' ? 'Completed' : 
                       course.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 













