import { useEffect, useState } from "react";
import supabase, { fetchStudentCourses, StudentCourse } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { formatTime, formatBuilding, parseDays, parseTime } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const START_HOUR = 8;
const END_HOUR = 22; // 10pm

export function Schedule() {
  const [courses, setCourses] = useState<StudentCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  useEffect(() => {
    async function loadCourses() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.email) throw new Error("No user session found");
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("student_id")
          .eq("email", session.user.email)
          .single();
        if (studentError) throw studentError;
        const { data, error } = await fetchStudentCourses(studentData.student_id);
        if (error) throw error;
        console.log("Raw course data:", JSON.stringify(data, null, 2));
        setCourses(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch schedule");
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  // Get unique semesters from courses
  const semesters = [...new Set(courses
    .map(course => course.course?.semester)
    .filter((semester): semester is string => semester !== undefined && semester !== null))];

  // Set initial semester if not set and semesters are available
  useEffect(() => {
    if (semesters.length > 0 && !selectedSemester) {
      setSelectedSemester(semesters[0]);
    }
  }, [semesters, selectedSemester]);

  // Filter courses by selected semester
  const filteredCourses = courses.filter(course => course.course?.semester === selectedSemester);

  // Build a map: { day: { hour: [courses] } }
  const calendar: Record<string, { course: StudentCourse; start: number; end: number }[]> = {};
  for (const course of filteredCourses) {
    if (!course.course) continue;
    console.log("Processing course:", {
      subject: course.course?.subj,
      course: course.course?.crs,
      days: course.course?.days,
      time: course.course?.time
    });
    const days = parseDays(course.course.days || "");
    console.log("Parsed days:", days);
    const [start, end] = parseTime(course.course.time || "");
    console.log("Parsed time:", { start, end });
    for (const day of days) {
      if (!calendar[day]) calendar[day] = [];
      calendar[day].push({ course, start, end });
    }
  }
  console.log("Final calendar structure:", calendar);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>;
  if (error) return <div className="flex justify-center items-center min-h-[60vh] text-red-500">Error: {error}</div>;
  if (semesters.length === 0) return <div className="flex justify-center items-center min-h-[60vh] text-gray-500">No semesters available</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Student Schedule</h1>
          <p className="text-md text-gray-600 mt-1">View your weekly class schedule and enrolled courses</p>
        </div>
        <Select
          value={selectedSemester}
          onValueChange={setSelectedSemester}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select semester" />
          </SelectTrigger>
          <SelectContent>
            {semesters.map((semester) => (
              <SelectItem key={semester} value={semester}>
                {semester}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Currently Enrolled Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCourses.length === 0 ? (
            <div className="text-gray-500">Not enrolled in any classes.</div>
          ) : (
            <ul className="space-y-2">
              {filteredCourses.map((c) => (
                <li key={c.course_crn} className="border rounded p-2 flex flex-col md:flex-row md:items-center md:justify-between">
                  <span className="font-semibold">{c.course?.subj} {c.course?.crs} - {c.course?.title}</span>
                  <span className="text-sm text-gray-600">{c.course?.days} {formatTime(c.course?.time || "")} | {formatBuilding(c.course?.building || "")} {c.course?.room} | {c.course?.instructor}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-2 w-16 bg-gray-50"></th>
                  {DAYS.map(day => (
                    <th key={day} className="border p-2 w-32 bg-gray-50 text-center">{day}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i).map((hour: number) => (
                  <tr key={hour}>
                    <td className="border p-2 text-xs bg-gray-50 text-right align-top">
                      {(() => {
                        const period = hour >= 12 ? "PM" : "AM";
                        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                        return `${displayHour}:00 ${period}`;
                      })()}
                    </td>
                    {DAYS.map(day => {
                      const slotCourses = (calendar[day] || []).filter(c => Math.floor(c.start) === hour);
                      return (
                        <td key={day} className="border p-0 align-top h-12 relative">
                          {slotCourses.map(({ course, start, end }) => {
                            const duration = Math.ceil(end - start);
                            return (
                              <div
                                key={course.course_crn}
                                className="bg-blue-100 border-blue-400 border rounded px-1 py-0.5 text-xs mb-0.5 overflow-hidden whitespace-nowrap text-ellipsis"
                                style={{ 
                                  position: 'absolute',
                                  width: 'calc(100% - 2px)',
                                  height: `${duration * 48}px`,
                                  margin: '1px'
                                }}
                                title={`${course.course?.subj} ${course.course?.crs} - ${course.course?.title}`}
                              >
                                {course.course?.subj} {course.course?.crs}
                              </div>
                            );
                          })}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 