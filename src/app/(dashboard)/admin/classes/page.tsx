// src/app/(dashboard)/admin/classes/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getClasses } from '@/lib/action/class.action';
import { 
  Calendar, Video, Clock, Search, Filter, Eye, Users, 
  TrendingUp, TrendingDown, ChevronLeft, ChevronRight,
  CheckCircle, XCircle, BarChart3, Star, Award
} from 'lucide-react';
import Link from 'next/link';

export default async function ClassesPage({
  searchParams,
}: {
  searchParams: Promise<{ 
    date?: string; 
    teacher?: string; 
    search?: string;
    month?: string;
    year?: string;
  }>;
}): Promise<React.ReactNode> {
  const params = await searchParams;
  const result = await getClasses();
  const sessions = result.success && result.sessions ? result.sessions : [];
  
  // Get current date info
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  // Parse filters
  const filterMonth = params.month || currentMonth.toString();
  const filterYear = params.year || currentYear.toString();
  const filterTeacher = params.teacher || 'all';
  const filterSearch = params.search || '';

  // Get unique teachers
  const teachers = [...new Set(sessions.map((s) => s.teacher.fullName))];

  // Filter sessions by month and year
  let filteredSessions = sessions.filter((s) => {
    const sessionDate = new Date(s.scheduledAt);
    const sessionMonth = sessionDate.getMonth() + 1;
    const sessionYear = sessionDate.getFullYear();
    return sessionMonth === parseInt(filterMonth) && sessionYear === parseInt(filterYear);
  });

  // Filter by teacher
  if (filterTeacher !== 'all') {
    filteredSessions = filteredSessions.filter((s) =>
      s.teacher.fullName === filterTeacher
    );
  }

  // Filter by search
  if (filterSearch) {
    filteredSessions = filteredSessions.filter((s) => {
      const studentNames = s.sessionStudents.map(ss => ss.student.fullName.toLowerCase()).join(' ');
      return (
        studentNames.includes(filterSearch.toLowerCase()) ||
        s.teacher.fullName.toLowerCase().includes(filterSearch.toLowerCase())
      );
    });
  }

  // Calculate teacher performance stats for the selected month
  const teacherStats = teachers.map(teacherName => {
    const teacherSessions = filteredSessions.filter(s => s.teacher.fullName === teacherName);
    const totalSessions = teacherSessions.length;
    const completedSessions = teacherSessions.filter(s => s.status === 'COMPLETED').length;
    const missedSessions = teacherSessions.filter(s => s.status === 'MISSED').length;
    const scheduledSessions = teacherSessions.filter(s => s.status === 'SCHEDULED' || s.status === 'LIVE').length;
    
    // Get unique students by fullName instead of id
    const uniqueStudentNames = new Set(
      teacherSessions.flatMap(s => s.sessionStudents.map(ss => ss.student.fullName))
    );
    const totalStudents = uniqueStudentNames.size;
    
    const totalJoined = teacherSessions.reduce((sum, s) => 
      sum + s.sessionStudents.filter(ss => ss.joinedAt).length, 0
    );
    const totalExpected = teacherSessions.reduce((sum, s) => 
      sum + s.sessionStudents.length, 0
    );
    
    const attendanceRate = totalExpected > 0 
      ? Math.round((totalJoined / totalExpected) * 100) 
      : 0;
    
    const completionRate = totalSessions > 0 
      ? Math.round((completedSessions / totalSessions) * 100) 
      : 0;

    const performanceScore = totalSessions > 0
      ? Math.round((attendanceRate * 0.6) + (completionRate * 0.4))
      : 0;

    return {
      teacherName,
      totalSessions,
      completedSessions,
      missedSessions,
      scheduledSessions,
      totalStudents,
      totalJoined,
      totalExpected,
      attendanceRate,
      completionRate,
      performanceScore,
      sessions: teacherSessions,
    };
  });

  // Sort teachers by performance score
  teacherStats.sort((a, b) => b.performanceScore - a.performanceScore);

  // Month navigation
  const prevMonth = parseInt(filterMonth) === 1 ? 12 : parseInt(filterMonth) - 1;
  const prevYear = parseInt(filterMonth) === 1 ? parseInt(filterYear) - 1 : parseInt(filterYear);
  const nextMonth = parseInt(filterMonth) === 12 ? 1 : parseInt(filterMonth) + 1;
  const nextYear = parseInt(filterMonth) === 12 ? parseInt(filterYear) + 1 : parseInt(filterYear);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  function getPerformanceBadge(score: number) {
    if (score >= 90) return { color: 'bg-green-500', icon: Star, label: 'Excellent' };
    if (score >= 75) return { color: 'bg-blue-500', icon: Award, label: 'Good' };
    if (score >= 60) return { color: 'bg-yellow-500', icon: TrendingUp, label: 'Average' };
    return { color: 'bg-red-500', icon: TrendingDown, label: 'Needs Improvement' };
  }

  function getStudentNames(session: typeof filteredSessions[0]): string {
    return session.sessionStudents.map(ss => ss.student.fullName).join(', ');
  }

  function getAttendanceInfo(session: typeof filteredSessions[0]): string {
    const total = session.sessionStudents.length;
    const joined = session.sessionStudents.filter(ss => ss.joinedAt).length;
    return `${joined}/${total}`;
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Teacher Performance & Classes</h1>
            <p className="text-white/80 mt-1">
              {monthNames[parseInt(filterMonth) - 1]} {filterYear} - {filteredSessions.length} sessions
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 rounded-xl p-1">
            <Link href={`/admin/classes?month=${prevMonth}&year=${prevYear}&teacher=${filterTeacher}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </Link>
            <span className="text-white font-medium px-3">
              {monthNames[parseInt(filterMonth) - 1]} {filterYear}
            </span>
            <Link href={`/admin/classes?month=${nextMonth}&year=${nextYear}&teacher=${filterTeacher}`}>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</p>
            <p className="text-3xl font-bold text-primary dark:text-white">{filteredSessions.length}</p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Active Teachers</p>
            <p className="text-3xl font-bold text-accent dark:text-white">
              {teacherStats.filter(t => t.totalSessions > 0).length}
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {filteredSessions.filter(s => s.status === 'COMPLETED').length}
            </p>
          </CardContent>
        </Card>
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">Avg Attendance</p>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {teacherStats.filter(t => t.totalSessions > 0).length > 0 
                ? Math.round(teacherStats.filter(t => t.totalSessions > 0).reduce((sum, t) => sum + t.attendanceRate, 0) / teacherStats.filter(t => t.totalSessions > 0).length)
                : 0}%
            </p>
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
            <Select name="teacher" defaultValue={filterTeacher}>
  <SelectTrigger className="w-full sm:w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-white">
    <SelectValue placeholder="All Teachers" />
  </SelectTrigger>
  <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
    <SelectItem value="all" className="dark:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-700">
      All Teachers
    </SelectItem>
    {teachers.map(teacher => (
      <SelectItem 
        key={teacher} 
        value={teacher}
        className="dark:text-white dark:focus:bg-gray-700 dark:hover:bg-gray-700"
      >
        {teacher}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
            <input type="hidden" name="month" value={filterMonth} />
            <input type="hidden" name="year" value={filterYear} />
            <Button type="submit" variant="outline" className="dark:border-gray-600 dark:text-gray-300">
              <Filter className="h-4 w-4 mr-2" />Filter
            </Button>
            <Link href="/admin/classes">
              <Button variant="ghost" className="dark:text-gray-300">Clear</Button>
            </Link>
          </form>
        </CardContent>
      </Card>

      {/* Teacher Performance Cards */}
      <div className="space-y-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Teacher Performance - {monthNames[parseInt(filterMonth) - 1]} {filterYear}
        </h2>
        
        {teacherStats.filter(t => t.totalSessions > 0).length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No sessions found for this month</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {teacherStats.filter(t => t.totalSessions > 0).map((stats) => {
              const perfBadge = getPerformanceBadge(stats.performanceScore);
              const PerfIcon = perfBadge.icon;
              return (
                <Card key={stats.teacherName} className="dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base dark:text-white">{stats.teacherName}</CardTitle>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {stats.totalStudents} student{stats.totalStudents !== 1 ? 's' : ''} • {stats.totalSessions} sessions
                          </p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full ${perfBadge.color} text-white text-xs font-medium flex items-center gap-1`}>
                        <PerfIcon className="h-3 w-3" />
                        {stats.performanceScore}% - {perfBadge.label}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <CheckCircle className="h-4 w-4 text-green-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-green-600 dark:text-green-400">{stats.completedSessions}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                      </div>
                      <div className="text-center p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <XCircle className="h-4 w-4 text-red-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-red-600 dark:text-red-400">{stats.missedSessions}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Missed</p>
                      </div>
                      <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <Users className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{stats.attendanceRate}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Attendance</p>
                      </div>
                      <div className="text-center p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <Star className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stats.completionRate}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Completion</p>
                      </div>
                    </div>
                    
                    {stats.sessions.length > 0 && (
                      <div className="mt-3 pt-3 border-t dark:border-gray-700">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Recent Sessions</p>
                        <div className="space-y-1">
                          {stats.sessions.slice(0, 3).map(session => (
                            <div key={session.id} className="flex items-center justify-between text-xs p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded">
                              <div className="flex items-center gap-2">
                                <Badge variant={
                                  session.status === 'COMPLETED' ? 'success' : 
                                  session.status === 'MISSED' ? 'destructive' : 'secondary'
                                } className="text-[10px] px-1.5 py-0">
                                  {session.status}
                                </Badge>
                                <span className="dark:text-white">
                                  {new Date(session.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                              </div>
                              <span className="text-gray-500 dark:text-gray-400">
                                {getAttendanceInfo(session)} joined
                              </span>
                            </div>
                          ))}
                          {stats.sessions.length > 3 && (
                            <p className="text-xs text-gray-400 text-center mt-1">
                              +{stats.sessions.length - 3} more sessions
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detailed Session List */}
      {filteredSessions.length > 0 && (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="border-b dark:border-gray-700">
            <CardTitle className="text-lg dark:text-white flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              All Sessions - {monthNames[parseInt(filterMonth) - 1]} {filterYear}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Teacher</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Students</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Date & Time</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Status</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Attendance</th>
                    <th className="text-left py-3 px-4 text-gray-600 dark:text-gray-300 font-medium text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSessions.slice(0, 20).map((session) => (
                    <tr key={session.id} className="border-b dark:border-gray-700 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-4 dark:text-white text-sm font-medium">
                        {session.teacher.fullName}
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300 text-sm">
                        {getStudentNames(session)}
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300 text-sm">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={
                          session.status === 'COMPLETED' ? 'success' : 
                          session.status === 'LIVE' ? 'success' :
                          session.status === 'MISSED' ? 'destructive' : 'secondary'
                        }>
                          {session.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 dark:text-gray-300 text-sm">
                        {getAttendanceInfo(session)}
                      </td>
                      <td className="py-3 px-4">
                        {session.meetingUrl && (session.status === 'SCHEDULED' || session.status === 'LIVE') && (
                          <a href={session.meetingUrl} target="_blank">
                            <Button size="sm" variant="outline" className="text-primary border-primary">
                              <Video className="h-3 w-3 mr-1" />Join
                            </Button>
                          </a>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredSessions.length > 20 && (
                <div className="text-center py-3 text-sm text-gray-500 dark:text-gray-400">
                  Showing 20 of {filteredSessions.length} sessions. Use filters to narrow down.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}