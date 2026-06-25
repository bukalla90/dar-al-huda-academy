// src/app/(dashboard)/admin/classes/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getClasses } from '@/lib/action/class.action';
import { Calendar, Video, Clock, Search, Filter, Eye } from 'lucide-react';
import Link from 'next/link';

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: { date?: string; teacher?: string; search?: string };
}): Promise<React.ReactNode> {
  const result = await getClasses();
  const sessions = result.success && result.sessions ? result.sessions : [];
  
  const filterDate = searchParams.date || new Date().toISOString().split('T')[0];
  const filterTeacher = searchParams.teacher || '';
  const filterSearch = searchParams.search || '';

  // Filter sessions
  let filteredSessions = sessions;

  // Filter by date
  if (filterDate) {
    filteredSessions = filteredSessions.filter((s) => {
      const sessionDate = new Date(s.scheduledAt).toISOString().split('T')[0];
      return sessionDate === filterDate;
    });
  }

  // Filter by teacher
  if (filterTeacher) {
    filteredSessions = filteredSessions.filter((s) =>
      s.teacher.fullName.toLowerCase().includes(filterTeacher.toLowerCase())
    );
  }

  // Filter by search
  if (filterSearch) {
    filteredSessions = filteredSessions.filter(
      (s) =>
        s.student.fullName.toLowerCase().includes(filterSearch.toLowerCase()) ||
        s.teacher.fullName.toLowerCase().includes(filterSearch.toLowerCase())
    );
  }

  // Today's sessions
  const today = new Date().toISOString().split('T')[0];
  const todaySessions = sessions.filter((s) => {
    const sessionDate = new Date(s.scheduledAt).toISOString().split('T')[0];
    return sessionDate === today;
  });

  // Get unique teachers
  const teachers = [...new Set(sessions.map((s) => s.teacher.fullName))];

  // Group sessions by teacher
  const sessionsByTeacher: Record<string, typeof filteredSessions> = {};
  filteredSessions.forEach((s) => {
    if (!sessionsByTeacher[s.teacher.fullName]) {
      sessionsByTeacher[s.teacher.fullName] = [];
    }
    sessionsByTeacher[s.teacher.fullName].push(s);
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Class Sessions</h1>
        <p className="text-white/80 mt-1">Monitor all classes - {filteredSessions.length} sessions found</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today&apos;s Classes</p>
                <p className="text-3xl font-bold text-primary dark:text-white">{todaySessions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Active Teachers</p>
                <p className="text-3xl font-bold text-accent dark:text-white">{teachers.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Filtered Sessions</p>
                <p className="text-3xl font-bold text-green-600 dark:text-white">{filteredSessions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Filter className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardContent className="pt-4">
          <form className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="search"
                placeholder="Search student or teacher..."
                defaultValue={filterSearch}
                className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            <Input
              name="date"
              type="date"
              defaultValue={filterDate}
              className="w-full sm:w-[180px] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <Button type="submit" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Link href="/admin/classes">
              <Button variant="ghost" className="dark:text-gray-300">Clear</Button>
            </Link>
          </form>
        </CardContent>
      </Card>

      {filteredSessions.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No class sessions found for this filter</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards - Grouped by Teacher */}
          <div className="block lg:hidden space-y-6">
            {Object.entries(sessionsByTeacher).map(([teacherName, teacherSessions]) => (
              <div key={teacherName}>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  {teacherName}
                  <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                    {teacherSessions.length} classes
                  </Badge>
                </h3>
                <div className="space-y-2">
                  {teacherSessions.map((session) => (
                    <Card key={session.id} className="dark:bg-gray-800 dark:border-gray-700">
                      <CardContent className="pt-3 pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium dark:text-white text-sm">{session.student.fullName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={session.status === 'SCHEDULED' ? 'success' : 'secondary'} className="text-xs">
                              {session.status}
                            </Badge>
                            {session.meetingUrl && (
                              <a href={session.meetingUrl} target="_blank">
                                <Button size="sm" variant="outline" className="text-primary border-primary h-8 text-xs">
                                  <Video className="h-3 w-3 mr-1" />
                                  Join
                                </Button>
                              </a>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Desktop Table - Grouped by Teacher */}
          <div className="hidden lg:block space-y-8">
            {Object.entries(sessionsByTeacher).map(([teacherName, teacherSessions]) => (
              <Card key={teacherName} className="dark:bg-gray-800 dark:border-gray-700">
                <CardHeader className="border-b dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800">
                  <CardTitle className="text-lg flex items-center gap-3 dark:text-white">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    {teacherName}
                    <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                      {teacherSessions.length} classes
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b dark:border-gray-700">
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Student</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Date</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Time</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Status</th>
                        <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium">Meeting</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teacherSessions.map((session) => (
                        <tr key={session.id} className="border-b dark:border-gray-700 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 font-medium dark:text-white">{session.student.fullName}</td>
                          <td className="py-3 px-4 dark:text-gray-300">
                            {new Date(session.scheduledAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4 dark:text-gray-300">
                            {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={session.status === 'SCHEDULED' ? 'success' : 'secondary'}>
                              {session.status}
                            </Badge>
                          </td>
                          <td className="py-3 px-4">
                            {session.meetingUrl && (
                              <a href={session.meetingUrl} target="_blank">
                                <Button size="sm" variant="outline" className="text-primary border-primary dark:border-primary dark:text-primary">
                                  <Video className="h-4 w-4 mr-1" />
                                  Join
                                </Button>
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}