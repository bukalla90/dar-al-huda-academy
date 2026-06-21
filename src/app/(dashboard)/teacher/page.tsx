// src/app/(dashboard)/teacher/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { 
  Users, 
  Calendar, 
  Clock, 
  BookOpen,
  Video,
  ArrowRight,
} from 'lucide-react';

async function getTeacherData(teacherId: string) {
  const teacher = await prisma.teacher.findUnique({
    where: { id: teacherId },
    include: {
      students: {
        include: {
          user: {
            select: { isActive: true },
          },
        },
      },
      sessions: {
        where: {
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED',
        },
        include: {
          student: {
            select: { fullName: true },
          },
        },
        orderBy: { scheduledAt: 'asc' },
        take: 10,
      },
    },
  });

  const totalProgress = await prisma.studentProgress.count({
    where: { teacherId },
  });

  return { teacher, totalProgress };
}

export default async function TeacherDashboardPage(): Promise<React.ReactNode> {
  const teacherId = 'temp-teacher-id'; // TODO: Get from session
  const { teacher, totalProgress } = await getTeacherData(teacherId);

  if (!teacher) return <div>Teacher not found</div>;

  const today = new Date();
  const todaySessions = teacher.sessions.filter(s => {
    const sessionDate = new Date(s.scheduledAt);
    return sessionDate.toDateString() === today.toDateString();
  });

  const activeStudents = teacher.students.filter(s => s.user.isActive).length;

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Assalamu Alaikum, {teacher.fullName}</h1>
        <p className="text-white/80 mt-1">Welcome back to your dashboard</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">My Students</p>
                <p className="text-3xl font-bold text-text">{teacher.students.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">{activeStudents} active</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Classes</p>
                <p className="text-3xl font-bold text-text">{todaySessions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Progress</p>
                <p className="text-3xl font-bold text-text">{totalProgress}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Records added</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold text-text">{teacher.sessions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Scheduled sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {todaySessions.length > 0 ? (
            <div className="divide-y">
              {todaySessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.student.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.scheduledAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Scheduled</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No classes scheduled for today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-accent" />
            Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {teacher.sessions.length > 0 ? (
            <div className="divide-y">
              {teacher.sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <p className="font-medium">{session.student.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No upcoming sessions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}