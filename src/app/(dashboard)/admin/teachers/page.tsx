// src/app/(dashboard)/admin/teachers/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
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
import { UserPlus, Users, Mail, Phone, DollarSign, Trash2 } from 'lucide-react';
import { getTeachers } from '@/lib/action/teacher.actions';
import { DeleteTeacherButton } from '@/components/admin/delete-teacher-button';

export default async function TeachersPage(): Promise<React.ReactNode> {
  const result = await getTeachers();
  const teachers = result.success ? result.teachers : [];

  const totalSalary = teachers?.reduce((sum, t) => sum + (t.salary || 0), 0) || 0;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Teachers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage all teachers</p>
        </div>
        <Link href="/admin/teachers/create">
          <Button>
            <UserPlus className="h-4 w-4 mr-2" />
            Add Teacher
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">{teachers?.length || 0}</div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Active Teachers</CardTitle>
            <Users className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">
              {teachers?.filter(t => t.user.isActive).length || 0}
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium dark:text-gray-300">Total Monthly Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold dark:text-white">ETB {totalSalary.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-4">
        {teachers?.map((teacher) => (
          <Card key={teacher.id} className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold dark:text-white">{teacher.fullName}</h3>
                  <Badge variant={teacher.user.isActive ? 'success' : 'secondary'} className="mt-1">
                    {teacher.user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <DeleteTeacherButton teacherId={teacher.id} teacherName={teacher.fullName} />
              </div>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4" />{teacher.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{teacher.phone}</div>
                <div className="flex items-center gap-2"><Users className="h-4 w-4" />{teacher.students.length} students</div>
                <div className="flex items-center gap-2"><DollarSign className="h-4 w-4" />ETB {teacher.salary?.toLocaleString() || 'Not set'}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="dark:border-gray-700">
                  <TableHead className="dark:text-gray-300">Name</TableHead>
                  <TableHead className="dark:text-gray-300">Email</TableHead>
                  <TableHead className="dark:text-gray-300">Phone</TableHead>
                  <TableHead className="dark:text-gray-300">Students</TableHead>
                  <TableHead className="dark:text-gray-300">Salary</TableHead>
                  <TableHead className="dark:text-gray-300">Status</TableHead>
                  <TableHead className="dark:text-gray-300 w-16">Delete</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers?.map((teacher) => (
                  <TableRow key={teacher.id} className="dark:border-gray-700 dark:hover:bg-gray-700/50">
                    <TableCell className="font-medium dark:text-white">{teacher.fullName}</TableCell>
                    <TableCell className="dark:text-gray-300">{teacher.email}</TableCell>
                    <TableCell className="dark:text-gray-300">{teacher.phone}</TableCell>
                    <TableCell className="dark:text-gray-300">{teacher.students.length}</TableCell>
                    <TableCell className="dark:text-gray-300">ETB {teacher.salary?.toLocaleString() || '-'}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.user.isActive ? 'success' : 'secondary'}>
                        {teacher.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DeleteTeacherButton teacherId={teacher.id} teacherName={teacher.fullName} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}