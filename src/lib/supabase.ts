import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_KEY

// Regular client for normal operations
const supabase = createClient(supabaseUrl, supabaseKey)

// Service role client for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Supabase Anon Key:', supabaseKey ? 'Present' : 'Missing')
console.log('Supabase Service Key:', supabaseServiceKey ? 'Present' : 'Missing')

export default supabase
export { supabaseAdmin }

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
    const { count, error: countError } = await supabaseAdmin
      .from('courses')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.error('Error checking courses table:', countError)
      return { data: null, error: countError }
    }

    console.log('Total courses in table:', count)

    // Initialize array to store all courses
    let allCourses: Course[] = []
    const pageSize = 1000 
    let currentPage = 0

    // Fetch all pages of data
    while (true) {
      const { data, error } = await supabaseAdmin
        .from('courses')
        .select(`
          crn,
          subj,
          crs,
          sec,
          title,
          cr,
          cap,
          enl,
          avl,
          building,
          room,
          time,
          days,
          instructor,
          notes,
          semester
        `)
        .range(currentPage * pageSize, (currentPage + 1) * pageSize - 1)
      
      if (error) {
        console.error('Error fetching courses:', error)
        return { data: null, error }
      }

      if (!data || data.length === 0) {
        break // No more data to fetch
      }

      allCourses = [...allCourses, ...data]
      currentPage++

      // If we got less than pageSize items, end
      if (data.length < pageSize) {
        break
      }
    }

    console.log('Successfully fetched courses. Data type:', typeof allCourses)
    console.log('Number of courses fetched:', allCourses.length)
    console.log('First course (if any):', allCourses[0])
    
    return { data: allCourses, error: null }
  } catch (err) {
    console.error('Exception in fetchCourses:', err)
    return { data: null, error: err }
  }
}

// Function to enroll a student in a course
export async function enrollInCourse(studentId: string, courseCrn: number): Promise<{ success: boolean; error: any }> {
  try {
    console.log(`Starting enrollment process for student ${studentId} in course ${courseCrn}`)
    
    // Check if student is already enrolled in this course
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('student_courses')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_crn', courseCrn)
      .single()

    if (checkError && checkError.code !== 'PGRST116') throw checkError
    if (existingEnrollment) {
      console.log('Student already enrolled in this course')
      return { success: false, error: 'You are already enrolled in this course' }
    }

    // Start a transaction
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('avl, enl')
      .eq('crn', courseCrn)
      .single()

    if (courseError) {
      console.error('Error fetching course:', courseError)
      throw courseError
    }

    console.log('Current course status:', {
      crn: courseCrn,
      availableSeats: course.avl,
      enrolledStudents: course.enl
    })

    // Check if there are available seats
    if (course.avl <= 0) {
      console.log('No available seats in the course')
      return { success: false, error: 'No available seats' }
    }

    // Calculate new values
    const newAvl = course.avl - 1
    const newEnl = course.enl + 1

    console.log('Attempting to update course with new values:', {
      newAvailableSeats: newAvl,
      newEnrolledCount: newEnl
    })

    // Use service role client for updating course seats
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('courses')
      .update({ 
        avl: newAvl,
        enl: newEnl
      })
      .eq('crn', courseCrn)
      .select('avl, enl')

    if (updateError) {
      console.error('Error updating course seats:', updateError)
      throw updateError
    }

    console.log('Course update result:', updateData)

    // Verify the update
    const { data: verifyData, error: verifyError } = await supabase
      .from('courses')
      .select('avl, enl')
      .eq('crn', courseCrn)
      .single()

    if (verifyError) {
      console.error('Error verifying course update:', verifyError)
    } else {
      console.log('Verified course status after update:', verifyData)
    }

    // Use service role client for inserting enrollment
    const { error: enrollError } = await supabaseAdmin
      .from('student_courses')
      .insert([
        {
          id: crypto.randomUUID(),
          student_id: studentId,
          course_crn: courseCrn,
          status: 'in_progress',
          enrollment_date: new Date().toISOString()
        }
      ])

    if (enrollError) {
      console.error('Error inserting enrollment record:', enrollError)
      throw enrollError
    }

    console.log('Successfully completed enrollment process')
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
          room,
          semester
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

export interface Grade {
  courseCode: string;
  courseName: string;
  credits: number;
  midgrade?: string;
  fingrade?: string;
  semester: string;
}

export interface GradesData {
  grades: Grade[];
  semesters: string[];
}

// Function to fetch student grades
export async function fetchStudentGrades(studentId: string): Promise<{ data: GradesData | null; error: any }> {
  try {
    // Fetch the grades for this student
    const { data: grades, error: gradesError } = await supabase
      .from('student_grades')
      .select(`
        *,
        course:course_crn (
          subj,
          crs,
          title,
          cr,
          semester
        )
      `)
      .eq('student_id', studentId)

    if (gradesError) throw gradesError

    // Get in-progress courses for this student
    const { data: inProgressCourses, error: coursesError } = await supabase
      .from('student_courses')
      .select('course_crn')
      .eq('student_id', studentId)
      .eq('status', 'in_progress')

    if (coursesError) throw coursesError

    // Create a set of in-progress course CRNs for quick lookup
    const inProgressCRNs = new Set(inProgressCourses?.map(course => course.course_crn) || [])

    // Transform the data into the format we need, excluding in-progress courses
    const transformedGrades = grades
      .filter(grade => !inProgressCRNs.has(grade.course_crn))
      .map(grade => ({
        courseCode: `${grade.course.subj} ${grade.course.crs}`,
        courseName: grade.course.title,
        credits: grade.course.cr,
        midgrade: grade.midgrade || undefined,
        fingrade: grade.fingrade || undefined,
        semester: grade.course.semester || 'Unknown'
      }))

    // Get unique semesters
    const semesters = ["All Semesters", ...new Set(transformedGrades.map(g => g.semester))]

    return {
      data: {
        grades: transformedGrades,
        semesters
      },
      error: null
    }
  } catch (err) {
    console.error('Error fetching grades:', err)
    return { data: null, error: err }
  }
}

// Function to drop a course
export async function dropCourse(studentId: string, courseCrn: number): Promise<{ success: boolean; error: any }> {
  try {
    // Check if student is enrolled in this course
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('student_courses')
      .select('*')
      .eq('student_id', studentId)
      .eq('course_crn', courseCrn)
      .single()

    if (checkError) throw checkError
    if (!existingEnrollment) {
      return { success: false, error: 'You are not enrolled in this course' }
    }

    // Get current course enrollment numbers
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('avl, enl')
      .eq('crn', courseCrn)
      .single()

    if (courseError) throw courseError

    // Use service role client for updating course seats
    const { error: updateError } = await supabaseAdmin
      .from('courses')
      .update({ 
        avl: course.avl + 1,
        enl: course.enl - 1
      })
      .eq('crn', courseCrn)

    if (updateError) throw updateError

    // Use service role client for deleting enrollment
    const { error: deleteError } = await supabaseAdmin
      .from('student_courses')
      .delete()
      .eq('student_id', studentId)
      .eq('course_crn', courseCrn)

    if (deleteError) throw deleteError

    return { success: true, error: null }
  } catch (err) {
    console.error('Error dropping course:', err)
    return { success: false, error: err }
  }
}


