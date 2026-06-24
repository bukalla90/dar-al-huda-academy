// src/app/(dashboard)/teacher/students/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import { Users, Phone, MapPin, BookOpen, Eye } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function TeacherStudentsPage(): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'TEACHER' || !user.teacherId) {
    redirect('/login');
  }

  const students = await prisma.student.findMany({
    where: { teacherId: user.teacherId },
    include: {
      user: {
        select: { isActive: true },
      },
      progress: {
        orderBy: { createdAt: 'desc' },
        take: 1,
        select: {
          surah: true,
          score: true,
        },
      },
    },
    orderBy: { fullName: 'asc' },
  });

  const activeStudents = students.filter(s => s.user.isActive).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">My Students</h1>
        <p className="text-white/80 mt-1">
          {students.length} students assigned • {activeStudents} active
        </p>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No students assigned yet</p>
            <p className="text-sm text-gray-400 mt-1">Admin will assign students to you</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{student.fullName}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className="bg-primary/10 text-primary">
                          {student.courseType.replace(/_/g, ' ')}
                        </Badge>
                        <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
                          {student.user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {student.country}
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </div>
                    {student.progress[0] && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Surah {student.progress[0].surah} - Score: {student.progress[0].score}/10
                      </div>
                    )}
                  </div>

                  <Link href={`/teacher/students/${student.id}`} className="block mt-3">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Progress
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {students.map((student) => (
              <Card key={student.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">{student.fullName}</h3>
                      <p className="text-sm text-gray-500">{student.country} • Age {student.age}</p>
                    </div>
                    <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
                      {student.user.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <Badge className="bg-primary/10 text-primary">
                      {student.courseType.replace(/_/g, ' ')}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {student.phone}
                    </div>
                    {student.progress[0] && (
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Last: Surah {student.progress[0].surah} - {student.progress[0].score}/10
                      </div>
                    )}
                  </div>

                  <Link href={`/teacher/students/${student.id}`}>
                    <Button variant="outline" className="w-full">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}