import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface StudentInfo {
  bio: {
    studentId: string;
    email: string;
    phone: string;
    gender: string;
    dateOfBirth: string;
    ethnicity: string;
    race: string;
    citizen: string;
    currentStatus: string;
    emergencyContact: string;
  };
  academic: {
    degree: string;
    studyPath: string;
    level: string;
    program: string;
    college: string;
    major: string;
    department: string;
    concentration: string;
    minor: string;
    admitType: string;
    admitTerm: string;
    catalogTerm: string;
  };
  gpa: {
    overall: number;
    totalHours: number;
    registeredHours: number;
    billingHours: number;
    ceuHours: number;
    minHours: string;
    maxHours: string;
  };
}



// Mock data !!!

const studentInfo: StudentInfo = {
  bio: {
    studentId: "U01000101",
    email: "letourl@sunypoly.edu",
    phone: "Not Provided",
    gender: "Male",
    dateOfBirth: "01/20/03",
    ethnicity: "Not Hispanic or Latino",
    race: "White",
    citizen: "Yes",
    currentStatus: "Student",
    emergencyContact: "Not Provided"
  },
  academic: {
    degree: "Bachelor of Science",
    studyPath: "Not Provided",
    level: "Undergraduate",
    program: "Computer & Information Science",
    college: "College of Engineering",
    major: "Computer & Information Science",
    department: "Computer Science Dept.",
    concentration: "Not Provided",
    minor: "Not Provided",
    admitType: "Risk Admit",
    admitTerm: "Fall 2021",
    catalogTerm: "Fall 2021"
  },
  gpa: {
    overall: 3.35,
    totalHours: 0,
    registeredHours: 0,
    billingHours: 0,
    ceuHours: 0,
    minHours: "Not available",
    maxHours: "Not available"
  }
}

// Mock data end




export function Profile() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Student Profile</h1>
          <div className="text-sm text-gray-500 mt-1">Student ID: {studentInfo.bio.studentId}</div>
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
              <div>{studentInfo.bio.email}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Phone:</label>
              <div>{studentInfo.bio.phone}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Gender:</label>
              <div>{studentInfo.bio.gender}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date of Birth:</label>
              <div>{studentInfo.bio.dateOfBirth}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Ethnicity:</label>
              <div>{studentInfo.bio.ethnicity}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Race:</label>
              <div>{studentInfo.bio.race}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Citizen:</label>
              <div>{studentInfo.bio.citizen}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Status:</label>
              <div>{studentInfo.bio.currentStatus}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Emergency Contact:</label>
              <div>{studentInfo.bio.emergencyContact}</div>
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
              <label className="text-sm font-medium text-gray-500">Degree:</label>
              <div>{studentInfo.academic.degree}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Study Path:</label>
              <div>{studentInfo.academic.studyPath}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Level:</label>
              <div>{studentInfo.academic.level}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Program:</label>
              <div>{studentInfo.academic.program}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">College:</label>
              <div>{studentInfo.academic.college}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Major:</label>
              <div>{studentInfo.academic.major}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Department:</label>
              <div>{studentInfo.academic.department}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Concentration:</label>
              <div>{studentInfo.academic.concentration}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Minor:</label>
              <div>{studentInfo.academic.minor}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Admit Type:</label>
              <div>{studentInfo.academic.admitType}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Admit Term:</label>
              <div>{studentInfo.academic.admitTerm}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Catalog Term:</label>
              <div>{studentInfo.academic.catalogTerm}</div>
            </div>
          </div>

          <div className="mt-6 border-t pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Overall GPA:</label>
                <div>{studentInfo.gpa.overall}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Total Hours:</label>
                <div>{studentInfo.gpa.totalHours}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Registered Hours:</label>
                <div>{studentInfo.gpa.registeredHours}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Billing Hours:</label>
                <div>{studentInfo.gpa.billingHours}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">CEU Hours:</label>
                <div>{studentInfo.gpa.ceuHours}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Min Hours:</label>
                <div>{studentInfo.gpa.minHours}</div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Max Hours:</label>
                <div>{studentInfo.gpa.maxHours}</div>
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
          <div className="text-center py-4 text-gray-500">Not Registered</div>
        </CardContent>
      </Card>
    </div>
  )
} 













