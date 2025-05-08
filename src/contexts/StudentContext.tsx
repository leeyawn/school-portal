import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import supabase, { Student } from '@/lib/supabase'

interface StudentContextType {
  student: Student | null
  loading: boolean
  error: string | null
  refreshStudent: () => Promise<void>
}

const StudentContext = createContext<StudentContextType | undefined>(undefined)

export function StudentProvider({ children }: { children: ReactNode }) {
  const [student, setStudent] = useState<Student | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStudentData = async () => {
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
      setStudent(studentData)
      setError(null)
    } catch (err) {
      console.error('Error fetching student data:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch student data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentData()

    // Subscribe to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setStudent(null)
      } else if (session?.user) {
        fetchStudentData()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <StudentContext.Provider value={{ student, loading, error, refreshStudent: fetchStudentData }}>
      {children}
    </StudentContext.Provider>
  )
}

export function useStudent() {
  const context = useContext(StudentContext)
  if (context === undefined) {
    throw new Error('useStudent must be used within a StudentProvider')
  }
  return context
} 