import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('Supabase URL:', supabaseUrl ? 'Present' : 'Missing')
console.log('Supabase Anon Key:', supabaseKey ? 'Present' : 'Missing')

export default supabase

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
  const { data, error } = await supabase
    .from('courses')
    .select('*')
  
  return { data, error }
}


