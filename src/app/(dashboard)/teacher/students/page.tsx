// src/app/(dashboard)/teacher/students/page.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import { Users, Phone, BookOpen, Eye } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// Cache student list for 30 seconds
const getCachedStudents = unstable_cache(
  async (teacherId: string) => {
    return prisma.student.findMany({
      where: { teacherId },
      include: {
        user: { select: { isActive: true } },
        progress: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { surah: true, score: true },
        },
      },
      orderBy: { fullName: 'asc' },
    });
  },
  ['teacher-students'],
  { revalidate: 30, tags: ['teacher-students'] }
);

export default async function TeacherStudentsPage(): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'TEACHER' || !user.teacherId) {
    redirect('/login');
  }

  const students = await getCachedStudents(user.teacherId);
  const activeStudents = students.filter(s => s.user.isActive).length;

  if (students.length === 0) {
    return (
      <div className="space-y-6 pb-20 lg:pb-0">
        <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
          <h1 className="text-2xl font-bold">My Students</h1>
          <p className="text-white/80 mt-1">No students assigned yet</p>
        </div>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No students assigned yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Admin will assign students to you</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-white/80 mt-1">{students.length} students • {activeStudents} active</p>
      </div>

      {/* Mobile Cards */}
      <div className="block lg:hidden space-y-3">
        {students.map((student) => (
          <Link key={student.id} href={`/teacher/students/${student.id}`}>
            <Card className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-750 cursor-pointer">
              <CardContent className="pt-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{student.fullName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className="bg-primary/10 text-primary text-xs">{student.courseType.replace(/_/g, ' ')}</Badge>
                      <Badge variant={student.user.isActive ? 'success' : 'secondary'} className="text-xs">
                        {student.user.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mt-2">
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{student.phone}</span>
                  {student.progress[0] && (
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />{student.progress[0].surah} - {student.progress[0].score}/10
                    </span>
                  )}
                </div>
                <div className="flex justify-end mt-3 pt-3 border-t dark:border-gray-700">
                  <Eye className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Desktop Grid */}
      <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {students.map((student) => (
          <Link key={student.id} href={`/teacher/students/${student.id}`}>
            <Card className="hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer h-full">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{student.fullName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{student.country} • Age {student.age}</p>
                  </div>
                  <Badge variant={student.user.isActive ? 'success' : 'secondary'}>{student.user.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <Badge className="bg-primary/10 text-primary">{student.courseType.replace(/_/g, ' ')}</Badge>
                  <div className="flex items-center gap-2"><Phone className="h-4 w-4" />{student.phone}</div>
                  {student.progress[0] && (
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Last: Surah {student.progress[0].surah} - {student.progress[0].score}/10
                    </div>
                  )}
                </div>
                <Button variant="outline" className="w-full dark:border-gray-600 dark:text-gray-300">
                  <Eye className="h-4 w-4 mr-2" />View Details
                </Button>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}