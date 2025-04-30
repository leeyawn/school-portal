import { useEffect, useState } from "react"
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
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Input } from "@/components/ui/input"

export function BrowseClasses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalFilter, setGlobalFilter] = useState("")

  const columns: ColumnDef<Course>[] = [
    { accessorKey: "crn", header: "CRN" },
    { accessorKey: "subj", header: "Subject" },
    { accessorKey: "crs", header: "Course" },
    { accessorKey: "sec", header: "Section" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "cr", header: "Credits" },
    { accessorKey: "cap", header: "Capacity" },
    { accessorKey: "enl", header: "Enrolled" },
    { accessorKey: "avl", header: "Available" },
    { accessorKey: "building", header: "Building" },
    { accessorKey: "room", header: "Room" },
    { accessorKey: "time", header: "Time" },
    { accessorKey: "days", header: "Days" },
    { accessorKey: "instructor", header: "Instructor" },
    { accessorKey: "notes", header: "Notes" },
  ]

  const table = useReactTable({
    data: courses,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

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
      <h1 className="text-2xl font-semibold">Browse Classes</h1>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter courses..."
          value={globalFilter ?? ""}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
    </div>
  )
}