import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Supabase Anon Key:', supabaseKey ? 'Present' : 'Missing')

export default supabase

export interface Student {
  id: string
  student_id: string
  first_name: string
  last_name: string
  email: string
  phone?: string
  emercon?: number
  level?: string
  program?: string
  college?: string
  major?: string
  department?: string
  concentration?: string
  minor?: string
  admittype?: string
  admitterm?: string
  catalogterm?: string
  totalhours?: string
  reghours?: string
  billhours?: string
  ceuhours?: string
  minhours?: string
  maxhours?: string
  gpa?: number
  dob: Date
  gender?: string
  ethnicity?: string
  race?: string
  citizen?: string
  currentstatus?: string
}

// Function to get or create a student
export async function getOrCreateStudent(email: string, name: string): Promise<{ data: Student | null; error: any }> {
  // First try to get the student
  const { data: existingStudent, error: fetchError } = await supabase
    .from('students')
    .select('*')
    .eq('email', email)
    .single()

  if (existingStudent) {
    return { data: existingStudent, error: null }
  }

  // If student doesn't exist and there was no other error, create one
  if (!existingStudent && fetchError?.code === 'PGRST116') {
    // Split the full name into first and last name
    const nameParts = name.split(' ')
    const firstName = nameParts[0]
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

    const { data: newStudent, error: createError } = await supabase
      .from('students')
      .insert([
        {
          student_id: 'TEMP' + Math.random().toString(36).substring(2, 8).toUpperCase(), // Temporary ID until proper one is assigned
          first_name: firstName,
          last_name: lastName,
          email: email,
          dob: new Date('2000-01-01'), // Default DOB, should be updated by student
          currentstatus: 'Pending'
        }
      ])
      .select()
      .single()

    return { data: newStudent, error: createError }
  }

  // If there was a different error, return it
  return { data: null, error: fetchError }
}

// Type for Course data
export interface Course {
  crn: number
  subj: string
  crs: string
  sec: string
  title: string
  cr: number
  cap: number
  enl: number
  avl: number
  building: string
  room: string
  time: string
  days: string
  instructor: string
  notes: string
  semester: string
}

// Function to fetch courses
export async function fetchCourses(): Promise<{ data: Course[] | null; error: any }> {
  try {
    console.log('Fetching courses from Supabase...')
    
    // First check if we can access the table
    const { count, error: countError } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error checking courses table:', countError)
      return { data: null, error: countError }
    }

    console.log('Total courses in table:', count)

    // Now fetch the actual data
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .limit(1000)
    
    if (error) {
      console.error('Error fetching courses:', error)
      return { data: null, error }
    }

    console.log('Successfully fetched courses. Data type:', typeof data)
    console.log('Number of courses fetched:', data?.length || 0)
    console.log('First course (if any):', data?.[0])
    
    return { data, error: null }
  } catch (err) {
    console.error('Exception in fetchCourses:', err)
    return { data: null, error: err }
  }
}


