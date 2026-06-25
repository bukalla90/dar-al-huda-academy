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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getStudentsPaginated } from '@/lib/action/student.actions';
import { getPaymentStatusColor } from '@/lib/utils';
import { 
  Search, 
  Eye,
  UserPlus,
  Users,
  BookOpen,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; course?: string; status?: string }>;
}): Promise<React.ReactNode> {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || '';
  const course = params.course || '';
  const status = params.status || '';

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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Students</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all students at Dar Al Huda Academy</p>
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
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Total Students</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{data?.totalCount || 0}</div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Active Students</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
              {students.filter(s => s.user.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Unassigned</CardTitle>
            <UserPlus className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
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
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>
          <Select name="course" defaultValue={course}>
            <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
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
            <SelectTrigger className="w-full sm:w-[180px] dark:bg-gray-800 dark:border-gray-700 dark:text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" variant="outline" className="w-full sm:w-auto dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800">
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
            <Link key={student.id} href={`/admin/students/${student.id}`}>
              <Card className="mb-3 hover:shadow-md transition-shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{student.country}</p>
                    </div>
                    <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
                      {student.user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Course:</span>
                      <span className="font-medium dark:text-gray-200">{student.courseType.replace(/_/g, ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 dark:text-gray-400">Teacher:</span>
                      <span className="font-medium dark:text-gray-200">{student.teacher?.fullName || 'Unassigned'}</span>
                    </div>
                    {lastPayment && (
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Payment:</span>
                        <Badge className={getPaymentStatusColor(lastPayment.status as 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE')}>
                          {lastPayment.status}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-end mt-4 pt-3 border-t dark:border-gray-700">
                    <Eye className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {students.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">No students found</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Get started by adding a new student.</p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Student</TableHead>
                  <TableHead className="dark:text-gray-300">Course</TableHead>
                  <TableHead className="dark:text-gray-300">Teacher</TableHead>
                  <TableHead className="dark:text-gray-300">Status</TableHead>
                  <TableHead className="dark:text-gray-300">Payment</TableHead>
                  <TableHead className="text-center dark:text-gray-300">View</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} className="dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{student.fullName}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{student.country}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                        {student.courseType.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="dark:text-gray-300">{student.teacher?.fullName || 'Unassigned'}</TableCell>
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
                        <span className="text-gray-400 dark:text-gray-500">No payments</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <Link href={`/admin/students/${student.id}`}>
                        <Button variant="ghost" size="icon" className="dark:hover:bg-gray-700">
                          <Eye className="h-4 w-4 dark:text-gray-400" />
                        </Button>
                      </Link>
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
        <div className="flex items-center justify-center gap-2">
          <Link
            href={`/admin/students?page=${page - 1}${search ? `&search=${search}` : ''}${course ? `&course=${course}` : ''}${status ? `&status=${status}` : ''}`}
            className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant="outline" size="sm" disabled={page <= 1} className="dark:border-gray-700 dark:text-gray-300">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </Link>
          
          {Array.from({ length: data.totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/admin/students?page=${pageNum}${search ? `&search=${search}` : ''}${course ? `&course=${course}` : ''}${status ? `&status=${status}` : ''}`}
            >
              <Button
                variant={pageNum === data.currentPage ? 'default' : 'outline'}
                size="sm"
                className={pageNum === data.currentPage ? '' : 'dark:border-gray-700 dark:text-gray-300'}
              >
                {pageNum}
              </Button>
            </Link>
          ))}

          <Link
            href={`/admin/students?page=${page + 1}${search ? `&search=${search}` : ''}${course ? `&course=${course}` : ''}${status ? `&status=${status}` : ''}`}
            className={page >= data.totalPages ? 'pointer-events-none opacity-50' : ''}
          >
            <Button variant="outline" size="sm" disabled={page >= data.totalPages} className="dark:border-gray-700 dark:text-gray-300">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}