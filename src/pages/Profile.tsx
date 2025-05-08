import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useStudent } from "@/contexts/StudentContext"
import IdCard from "@/components/Misc/IdCard"

export function Profile() {
  const { student: studentInfo, loading, error } = useStudent()

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{studentInfo.first_name} {studentInfo.last_name}</h1>
              <div className="text-gray-600 mt-1">ID: {studentInfo.student_id}</div>
            </div>
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Good Standing
            </div>
          </div>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Email</div>
                  <div className="font-medium">{studentInfo.email}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Phone</div>
                  <div className="font-medium">{studentInfo.phone || 'Not Provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Academic Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Program</div>
                  <div className="font-medium">{studentInfo.program || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Major</div>
                  <div className="font-medium">{studentInfo.major || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">College</div>
                  <div className="font-medium">{studentInfo.college || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Department</div>
                  <div className="font-medium">{studentInfo.department || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Level</div>
                  <div className="font-medium">{studentInfo.level || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Concentration</div>
                  <div className="font-medium">{studentInfo.concentration || 'Not Provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500">Date of Birth</div>
                  <div className="font-medium">
                    {studentInfo.dob ? new Date(studentInfo.dob + 'T00:00:00').toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric', 
                      timeZone: 'UTC' 
                    }) : 'Not Provided'}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Gender</div>
                  <div className="font-medium">{studentInfo.gender || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Ethnicity</div>
                  <div className="font-medium">{studentInfo.ethnicity || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Race</div>
                  <div className="font-medium">{studentInfo.race || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Citizenship</div>
                  <div className="font-medium">{studentInfo.citizen || 'Not Provided'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Emergency Contact</div>
                  <div className="font-medium">{studentInfo.emercon || 'Not Provided'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <div className="flex justify-center">
            <div className="transition-transform duration-300 hover:scale-105">
              <IdCard 
                student={{
                  firstName: studentInfo.first_name,
                  lastName: studentInfo.last_name,
                  studentId: studentInfo.student_id
                }}
                className="scale-97 origin-top"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-gray-500">Overall GPA</div>
                <div className="text-md font-bold">{studentInfo.gpa || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Total Hours</div>
                <div className="text-md font-bold">{studentInfo.totalhours || 'N/A'}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Registered Hours</div>
                <div className="text-md font-bold">{studentInfo.reghours || 'N/A'}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 













