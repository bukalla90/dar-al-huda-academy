// src/app/(dashboard)/teacher/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { prisma } from '@/lib/prisma';
import { getLoggedInUser } from '@/lib/auth';
import { 
  Users, Calendar, Clock, BookOpen, Video, ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { unstable_cache } from 'next/cache';

// Cache teacher data for 30 seconds
const getCachedTeacherData = unstable_cache(
  async (teacherId: string) => {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      include: {
        students: {
          include: {
            user: { select: { isActive: true } },
          },
          orderBy: { fullName: 'asc' },
        },
        sessions: {
          where: {
            scheduledAt: { gte: new Date() },
            status: 'SCHEDULED',
          },
          include: {
            sessionStudents: {
              include: {
                student: { select: { fullName: true } },
              },
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
  },
  ['teacher-dashboard'],
  { revalidate: 30, tags: ['teacher-dashboard'] }
);

export default async function TeacherDashboardPage(): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'TEACHER' || !user.teacherId) {
    redirect('/login');
  }

  const { teacher, totalProgress } = await getCachedTeacherData(user.teacherId);

  if (!teacher) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-500">Teacher profile not found</p>
          <Link href="/login" className="text-primary hover:underline mt-4 inline-block">Go to Login</Link>
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toDateString();
  
  const todaySessions = teacher.sessions.filter(s => 
    new Date(s.scheduledAt).toDateString() === todayStr
  );

  const activeStudents = teacher.students.filter(s => s.user.isActive).length;

  // Pre-compute student names for sessions
  const getStudentNames = (session: typeof teacher.sessions[0]): string => 
    session.sessionStudents.map(s => s.student.fullName).join(', ');

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="bg-gradient-to-r from-primary to-secondary rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Assalamu Alaikum, {teacher.fullName}</h1>
        <p className="text-white/80 mt-1">Welcome back to your dashboard</p>
      </div>

      {/* Stats Grid - Optimized with fewer DOM nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickStat title="My Students" value={teacher.students.length} icon={Users} color="primary" sub={`${activeStudents} active`} />
        <QuickStat title="Today's Classes" value={todaySessions.length} icon={Calendar} color="accent" />
        <QuickStat title="Total Progress" value={totalProgress} icon={BookOpen} color="green" sub="Records added" />
        <QuickStat title="Upcoming" value={teacher.sessions.length} icon={Clock} color="blue" sub="Scheduled sessions" />
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <QuickLink href="/teacher/students" icon={Users} title="My Students" desc="View and manage" color="primary" />
        <QuickLink href="/teacher/schedule" icon={Calendar} title="Schedule" desc="Manage classes" color="accent" />
        <QuickLink href={teacher.students[0] ? `/teacher/students/${teacher.students[0].id}` : '#'} icon={BookOpen} title="Add Progress" desc="Update students" color="green" />
      </div>

      {/* Today's Schedule */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Calendar className="h-5 w-5 text-primary" />Today&apos;s Schedule
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {todaySessions.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {todaySessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium dark:text-white">{getStudentNames(session)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">Scheduled</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Calendar} message="No classes scheduled for today" />
          )}
        </CardContent>
      </Card>

      {/* Upcoming Sessions */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Clock className="h-5 w-5 text-accent" />Upcoming Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {teacher.sessions.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {teacher.sessions.map((session) => (
                <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    <div>
                      <p className="font-medium dark:text-white">{getStudentNames(session)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={Clock} message="No upcoming sessions" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Reusable sub-components for cleaner code
function QuickStat({ title, value, icon: Icon, color, sub }: {
  title: string;
  value: number;
  icon: typeof Users;
  color: string;
  sub?: string;
}): React.ReactNode {
  const colorMap: Record<string, { border: string; bg: string; text: string; darkBg: string }> = {
    primary: { border: 'border-l-primary', bg: 'bg-primary/10', text: 'text-primary', darkBg: '' },
    accent: { border: 'border-l-accent', bg: 'bg-accent/10', text: 'text-accent', darkBg: '' },
    green: { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-500', darkBg: 'dark:bg-green-900/30' },
    blue: { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-500', darkBg: 'dark:bg-blue-900/30' },
  };
  const c = colorMap[color] || colorMap.primary;

  return (
    <Card className={`border-l-4 ${c.border} hover:shadow-lg transition-shadow dark:bg-gray-800`}>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
            <p className="text-3xl font-bold text-text dark:text-white">{value}</p>
          </div>
          <div className={`w-12 h-12 rounded-full ${c.bg} ${c.darkBg} flex items-center justify-center`}>
            <Icon className={`h-6 w-6 ${c.text}`} />
          </div>
        </div>
        {sub && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function QuickLink({ href, icon: Icon, title, desc, color }: {
  href: string;
  icon: typeof Users;
  title: string;
  desc: string;
  color: string;
}): React.ReactNode {
  const colorMap: Record<string, string> = {
    primary: 'from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20',
    accent: 'from-accent/5 to-accent/10 dark:from-accent/10 dark:to-accent/20',
    green: 'from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/30',
  };

  return (
    <Link href={href}>
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer border-0 bg-gradient-to-br ${colorMap[color] || colorMap.primary}`}>
        <CardContent className="pt-6 text-center">
          <Icon className={`h-8 w-8 text-${color === 'primary' ? 'primary' : color === 'accent' ? 'accent' : 'green-600'} mx-auto mb-2`} />
          <p className="font-semibold dark:text-white">{title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
        </CardContent>
      </Card>
    </Link>
  );
}

function EmptyState({ icon: Icon, message }: { icon: typeof Calendar; message: string }): React.ReactNode {
  return (
    <div className="p-8 text-center text-gray-500 dark:text-gray-400">
      <Icon className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
      <p>{message}</p>
    </div>
  );
}