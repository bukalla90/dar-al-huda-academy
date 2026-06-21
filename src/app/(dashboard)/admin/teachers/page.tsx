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

import { UserPlus, Users, Mail, Phone } from 'lucide-react';
import { getTeachers } from '@/lib/action/teacher.actions';

export default async function TeachersPage(): Promise<React.ReactNode> {
  const result = await getTeachers();
  const teachers = result.success ? result.teachers : [];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Teachers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage all teachers</p>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{teachers?.length || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-4">
        {teachers?.map((teacher) => (
          <Card key={teacher.id}>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold">{teacher.fullName}</h3>
                  <Badge variant={teacher.user.isActive ? 'success' : 'secondary'} className="mt-1">
                    {teacher.user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  {teacher.email}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4" />
                  {teacher.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="h-4 w-4" />
                  {teacher.students.length} students
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teachers?.map((teacher) => (
                  <TableRow key={teacher.id}>
                    <TableCell className="font-medium">{teacher.fullName}</TableCell>
                    <TableCell>{teacher.email}</TableCell>
                    <TableCell>{teacher.phone}</TableCell>
                    <TableCell>{teacher.students.length}</TableCell>
                    <TableCell>
                      <Badge variant={teacher.user.isActive ? 'success' : 'secondary'}>
                        {teacher.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
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