import { useEffect, useState, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { fetchCourses, Course } from "@/lib/supabase"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Filter, X, ChevronLeft, ChevronRight } from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

export function BrowseClasses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [selectedSemester, setSelectedSemester] = useState<string>("Spring 2025")
  const [isFiltering, setIsFiltering] = useState(false)
  const [pageIndex, setPageIndex] = useState(0)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const pageSize = 25

  // Memoize the filtered courses
  const filteredCourses = useMemo(() => {
    let result = courses.filter(course => course.semester === selectedSemester)
    
    // Apply column filters
    columnFilters.forEach(filter => {
      const { id, value } = filter
      if (value) {
        result = result.filter(course => {
          const courseValue = course[id as keyof Course]
          if (typeof courseValue === 'string') {
            return courseValue.toLowerCase().includes(value.toString().toLowerCase())
          }
          return courseValue?.toString().includes(value.toString())
        })
      }
    })

    return result
  }, [courses, selectedSemester, columnFilters])

  // Memoize the paginated courses
  const paginatedCourses = useMemo(() => {
    const start = pageIndex * pageSize
    return filteredCourses.slice(start, start + pageSize)
  }, [filteredCourses, pageIndex])

  const columns: ColumnDef<Course>[] = [
    { 
      accessorKey: "crn", 
      header: "CRN",
    },
    { 
      accessorKey: "subj", 
      header: "Subject",
    },
    { 
      accessorKey: "crs", 
      header: "Course",
    },
    { 
      accessorKey: "sec", 
      header: "Section",
    },
    { 
      accessorKey: "title", 
      header: "Title",
    },
    { 
      accessorKey: "cr", 
      header: "Credits",
    },
    { 
      accessorKey: "cap", 
      header: "Capacity",
    },
    { 
      accessorKey: "enl", 
      header: "Enrolled",
    },
    { 
      accessorKey: "avl", 
      header: "Available",
    },
    { 
      accessorKey: "building", 
      header: "Building",
    },
    { 
      accessorKey: "room", 
      header: "Room",
    },
    { 
      accessorKey: "time", 
      header: "Time",
    },
    { 
      accessorKey: "days", 
      header: "Days",
    },
    { 
      accessorKey: "instructor", 
      header: "Instructor",
    }
  ]

  const table = useReactTable({
    data: paginatedCourses,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnFilters,
    },
  })

  const handleSemesterChange = (semester: string) => {
    setIsFiltering(true)
    setSelectedSemester(semester)
    setPageIndex(0) // Reset to first page when changing semester
    setTimeout(() => {
      setIsFiltering(false)
    }, 100)
  }

  const clearFilters = () => {
    setColumnFilters([])
    setPageIndex(0)
  }

  const activeFilters = columnFilters.length

  const handleFilterChange = (columnId: string, value: string) => {
    setColumnFilters(prev => {
      const existingFilter = prev.find(f => f.id === columnId)
      if (existingFilter) {
        return prev.map(f => f.id === columnId ? { ...f, value } : f)
      }
      return [...prev, { id: columnId, value }]
    })
    setPageIndex(0) // Reset to first page when filter changes
  }

  useEffect(() => {
    async function loadCourses() {
      try {
        console.log('Starting to fetch courses...')
        const { data, error } = await fetchCourses()
        console.log('Supabase response:', { data, error })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }
        
        console.log('Setting courses data:', data)
        setCourses(data || [])
      } catch (err) {
        console.error('Error in fetchCourses:', err)
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        console.log('Setting loading to false')
        setLoading(false)
      }
    }

    loadCourses()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading...</div>
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-[60vh] text-red-500">Error: {error}</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Browse Classes</h1>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-2 lg:px-3"
                disabled={isFiltering}
              >
                {selectedSemester}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSemesterChange("Fall 2025")}>
                Fall 2025
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSemesterChange("Spring 2025")}>
                Spring 2025
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-8 px-2 lg:px-3"
            >
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
          <Collapsible open={isFiltersOpen} onOpenChange={setIsFiltersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 px-2 lg:px-3">
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFilters > 0 && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {activeFilters}
                  </span>
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="absolute right-0 mt-2 w-[300px] rounded-md border bg-background p-4 shadow-md z-50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="crn">Course Reference Number</Label>
                  <Input
                    id="crn"
                    placeholder="Filter by CRN..."
                    value={(columnFilters.find(f => f.id === "crn")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("crn", event.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="Filter by subject..."
                    value={(columnFilters.find(f => f.id === "subj")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("subj", event.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="course">Course number</Label>
                  <Input
                    id="course"
                    placeholder="Filter by course number..."
                    value={(columnFilters.find(f => f.id === "crs")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("crs", event.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="title">Course title</Label>
                  <Input
                    id="title"
                    placeholder="Filter by course title..."
                    value={(columnFilters.find(f => f.id === "title")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("title", event.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    placeholder="Filter by instructor..."
                    value={(columnFilters.find(f => f.id === "instructor")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("instructor", event.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="days">Days</Label>
                  <Input
                    id="days"
                    placeholder="Filter by days..."
                    value={(columnFilters.find(f => f.id === "days")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("days", event.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    placeholder="Filter by time..."
                    value={(columnFilters.find(f => f.id === "time")?.value as string) ?? ""}
                    onChange={(event) => handleFilterChange("time", event.target.value)}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isFiltering ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => setSelectedCourse(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Showing {pageIndex * pageSize + 1} to{" "}
          {Math.min((pageIndex + 1) * pageSize, filteredCourses.length)} of{" "}
          {filteredCourses.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0 || isFiltering}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageIndex(pageIndex + 1)}
            disabled={(pageIndex + 1) * pageSize >= filteredCourses.length || isFiltering}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-primary">
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">Course Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CRN</span>
                      <span className="font-medium">{selectedCourse?.crn}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subject</span>
                      <span className="font-medium">{selectedCourse?.subj}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Course</span>
                      <span className="font-medium">{selectedCourse?.crs}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Section</span>
                      <span className="font-medium">{selectedCourse?.sec}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Credits</span>
                      <span className="font-medium">{selectedCourse?.cr}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border p-4 bg-muted/50">
                  <h3 className="font-semibold text-sm text-muted-foreground mb-3">Schedule</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Days</span>
                      <span className="font-medium">{selectedCourse?.days}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium">{selectedCourse?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Building</span>
                      <span className="font-medium">{selectedCourse?.building}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Room</span>
                      <span className="font-medium">{selectedCourse?.room}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Instructor</span>
                      <span className="font-medium">{selectedCourse?.instructor}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-lg border p-4 bg-muted/50">
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Enrollment</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCourse?.cap}</div>
                  <div className="text-sm text-muted-foreground">Capacity</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCourse?.enl}</div>
                  <div className="text-sm text-muted-foreground">Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{selectedCourse?.avl}</div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>
            {selectedCourse?.notes && (
              <div className="rounded-lg border p-4 bg-muted/50">
                <h3 className="font-semibold text-sm text-muted-foreground mb-3">Notes</h3>
                <p className="text-sm">{selectedCourse.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCourse(null)}
              className="flex-1"
            >
              Close
            </Button>
            <Button 
              className="flex-1 !bg-green-600 hover:!bg-green-600/90 text-white"
              onClick={() => {
                // TODO: Implement enrollment logic
                console.log("Enrolling in course:", selectedCourse?.crn)
                setSelectedCourse(null)
              }}
            >
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}