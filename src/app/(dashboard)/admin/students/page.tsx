// src/app/(dashboard)/admin/students/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStudentsPaginated } from '@/lib/action/student.actions';
import { getPaymentStatusColor } from '@/lib/utils';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Eye,
  UserPlus,
  Users,
  BookOpen,
  Filter,
} from 'lucide-react';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string; course?: string; status?: string };
}): Promise<React.ReactNode> {
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || '';
  const course = searchParams.course || '';
  const status = searchParams.status || '';

  const result = await getStudentsPaginated(page, 10, {
    search: search || undefined,
    courseType: course || undefined,
    status: (status as 'active' | 'inactive') || undefined,
  });

  const data = result.success ? result.data : null;
  const students = data?.students || [];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text">Students</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all students at Dar Al Huda Academy</p>
        </div>
        <Link href="/admin/students/create">
          <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">
            <UserPlus className="h-4 w-4 mr-2" />
            Add New Student
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalCount || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Students</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => s.user.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unassigned</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {students.filter(s => !s.teacher).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form className="flex-1 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              name="search"
              placeholder="Search students..."
              defaultValue={search}
              className="pl-10"
            />
          </div>
          <Select name="course" defaultValue={course}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Courses</SelectItem>
              <SelectItem value="HIFZ">Hifz</SelectItem>
              <SelectItem value="TAJWEED">Tajweed</SelectItem>
              <SelectItem value="NAZIRAH">Nazirah</SelectItem>
              <SelectItem value="MURAJAAH">Murajaah</SelectItem>
              <SelectItem value="AQIDAH">Aqidah</SelectItem>
              <SelectItem value="FIQH">Fiqh</SelectItem>
              <SelectItem value="HADITH">Hadith</SelectItem>
              <SelectItem value="ARABIC_LANGUAGE">Arabic Language</SelectItem>
              <SelectItem value="ISLAMIC_MANNERS">Islamic Manners</SelectItem>
            </SelectContent>
          </Select>
          <Select name="status" defaultValue={status}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="outline" className="w-full sm:w-auto">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </form>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {students.map((student) => {
          const lastPayment = student.payments[0];
          return (
            <Card key={student.id} className="mb-3">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-text">{student.fullName}</h3>
                    <p className="text-sm text-gray-500">{student.country}</p>
                  </div>
                  <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
                    {student.user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Course:</span>
                    <span className="font-medium">{student.courseType.replace(/_/g, ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Teacher:</span>
                    <span className="font-medium">{student.teacher?.fullName || 'Unassigned'}</span>
                  </div>
                  {lastPayment && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Payment:</span>
                      <Badge className={getPaymentStatusColor(lastPayment.status as 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE')}>
                        {lastPayment.status}
                      </Badge>
                    </div>
                  )}
                </div>

                <div className="flex justify-end mt-4 pt-3 border-t">
                  {/* FIXED: Changed from /edit to just /studentId */}
                  <Link href={`/admin/students/${student.id}`}>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No students found</h3>
            <p className="text-gray-500 mt-1">Get started by adding a new student.</p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-text">{student.fullName}</p>
                        <p className="text-sm text-gray-500">{student.country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {student.courseType.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{student.teacher?.fullName || 'Unassigned'}</TableCell>
                    <TableCell>
                      <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
                        {student.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {student.payments[0] ? (
                        <Badge className={getPaymentStatusColor(
                          student.payments[0].status as 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE'
                        )}>
                          {student.payments[0].status}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">No payments</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {/* FIXED: Changed from /edit to just /studentId */}
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/students/${student.id}`}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Pagination */}
      {data && data.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/admin/students?page=${pageNum}${search ? `&search=${search}` : ''}${course ? `&course=${course}` : ''}${status ? `&status=${status}` : ''}`}
            >
              <Button
                variant={pageNum === data.currentPage ? 'default' : 'outline'}
                size="sm"
              >
                {pageNum}
              </Button>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}