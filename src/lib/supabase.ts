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

// Function to enroll a student in a course
export async function enrollInCourse(studentId: string, courseCrn: number): Promise<{ success: boolean; error: any }> {
  try {
    // Check if student is already enrolled in this course
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('student_courses')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_crn', courseCrn)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError
    if (existingEnrollment) {
      return { success: false, error: 'You are already enrolled in this course' }
    }

    // Start a transaction
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('avl, enl')
      .eq('crn', courseCrn)
      .single()

    if (courseError) throw courseError

    // Check if there are available seats
    if (course.avl <= 0) {
      return { success: false, error: 'No available seats' }
    }

    // Update available seats in courses table
    const { error: updateError } = await supabase
      .from('courses')
      .update({ 
        avl: course.avl - 1,
        enl: course.enl + 1
      })
      .eq('crn', courseCrn)

    if (updateError) throw updateError

    // Add student to student_courses table with generated UUID
    const { error: enrollError } = await supabase
      .from('student_courses')
      .insert([
        {
          id: crypto.randomUUID(), // Generate a UUID for the id field
          student_id: studentId,
          course_crn: courseCrn,
          status: 'in_progress',
          enrollment_date: new Date().toISOString()
        }
      ])

    if (enrollError) throw enrollError

    return { success: true, error: null }
  } catch (err) {
    console.error('Error enrolling in course:', err)
    return { success: false, error: err }
  }
}

// Interface for student courses with course details
export interface StudentCourse {
  student_id: string
  course_crn: number
  enrollment_date: string
  status: string
  course?: Course
}

// Function to fetch student courses with course details
export async function fetchStudentCourses(studentId: string): Promise<{ data: StudentCourse[] | null; error: any }> {
  try {
    const { data, error } = await supabase
      .from('student_courses')
      .select(`
        *,
        course:course_crn (
          crn,
          subj,
          crs,
          sec,
          title,
          cr,
          instructor,
          days,
          time,
          building,
          room
        )
      `)
      .eq('student_id', studentId)
      .order('enrollment_date', { ascending: false })

    if (error) {
      console.error('Error fetching student courses:', error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error('Exception in fetchStudentCourses:', err)
    return { data: null, error: err }
  }
}


