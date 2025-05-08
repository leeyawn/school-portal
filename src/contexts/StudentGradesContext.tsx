import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GradesData, fetchStudentGrades } from '@/lib/supabase'
import { useStudent } from './StudentContext'

interface StudentGradesContextType {
  gradesData: GradesData
  loading: boolean
  error: string | null
  refreshGrades: () => Promise<void>
}

const StudentGradesContext = createContext<StudentGradesContextType | undefined>(undefined)

export function StudentGradesProvider({ children }: { children: ReactNode }) {
  const [gradesData, setGradesData] = useState<GradesData>({ grades: [], semesters: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { student } = useStudent()

  const fetchGradesData = async () => {
    try {
      if (!student) {
        throw new Error('No student data found')
      }

      const { data, error: gradesError } = await fetchStudentGrades(student.student_id)
      if (gradesError) throw gradesError
      if (data) setGradesData(data)
      setError(null)
    } catch (err) {
      console.error('Error fetching student grades:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch student grades')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (student) {
      fetchGradesData()
    } else {
      setGradesData({ grades: [], semesters: [] })
      setLoading(false)
    }
  }, [student])

  return (
    <StudentGradesContext.Provider value={{ gradesData, loading, error, refreshGrades: fetchGradesData }}>
      {children}
    </StudentGradesContext.Provider>
  )
}

export function useStudentGrades() {
  const context = useContext(StudentGradesContext)
  if (context === undefined) {
    throw new Error('useStudentGrades must be used within a StudentGradesProvider')
  }
  return context
} 