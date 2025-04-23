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

interface Grade {
  courseCode: string;
  courseName: string;
  credits: number;
  grade: string;
  term: string;
}

interface GradesData {
  grades: Grade[];
  terms: string[];
}

// Mock data - This will be replaced with actual API calls
const gradesData: GradesData = {
  grades: [
    {
      courseCode: "CS101",
      courseName: "Introduction to Computer Science",
      credits: 3,
      grade: "A",
      term: "Fall 2023"
    },
    {
      courseCode: "MATH101",
      courseName: "Calculus I",
      credits: 4,
      grade: "B+",
      term: "Fall 2023"
    },
    {
      courseCode: "ENG101",
      courseName: "English Composition",
      credits: 3,
      grade: "A-",
      term: "Spring 2024"
    }
  ],
  terms: ["All Terms", "Fall 2023", "Spring 2024"]
}

export function Grades() {
  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Academic Grades</CardTitle>
            <Select defaultValue="All Terms">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {gradesData.terms.map((term) => (
                  <SelectItem key={term} value={term}>
                    {term}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course Code</TableHead>
                <TableHead>Course Name</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Term</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {gradesData.grades.map((grade, index) => (
                <TableRow key={index}>
                  <TableCell>{grade.courseCode}</TableCell>
                  <TableCell>{grade.courseName}</TableCell>
                  <TableCell>{grade.credits}</TableCell>
                  <TableCell>{grade.grade}</TableCell>
                  <TableCell>{grade.term}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 