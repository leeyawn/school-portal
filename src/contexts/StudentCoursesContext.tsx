import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { StudentCourse, fetchStudentCourses } from '@/lib/supabase'
import { useStudent } from './StudentContext'

interface StudentCoursesContextType {
  courses: StudentCourse[]
  loading: boolean
  error: string | null
  refreshCourses: () => Promise<void>
}

const StudentCoursesContext = createContext<StudentCoursesContextType | undefined>(undefined)

export function StudentCoursesProvider({ children }: { children: ReactNode }) {
  const [courses, setCourses] = useState<StudentCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { student } = useStudent()

  const fetchCoursesData = async () => {
    try {
      if (!student) {
        throw new Error('No student data found')
      }

      const { data: coursesData, error: coursesError } = await fetchStudentCourses(student.student_id)
      if (coursesError) throw coursesError
      setCourses(coursesData || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching student courses:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch student courses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (student) {
      fetchCoursesData()
    } else {
      setCourses([])
      setLoading(false)
    }
  }, [student])

  return (
    <StudentCoursesContext.Provider value={{ courses, loading, error, refreshCourses: fetchCoursesData }}>
      {children}
    </StudentCoursesContext.Provider>
  )
}

export function useStudentCourses() {
  const context = useContext(StudentCoursesContext)
  if (context === undefined) {
    throw new Error('useStudentCourses must be used within a StudentCoursesProvider')
  }
  return context
} 