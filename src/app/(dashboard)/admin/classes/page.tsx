// src/app/(dashboard)/admin/classes/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getClasses } from '@/lib/action/class.action';
import { Calendar, Video, Clock, Users, ArrowRight } from 'lucide-react';

export default async function ClassesPage(): Promise<React.ReactNode> {
  const result = await getClasses();
  const sessions = result.success && result.sessions ? result.sessions : [];
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayClasses = sessions.filter((s) => {
    const classDate = new Date(s.scheduledAt);
    classDate.setHours(0, 0, 0, 0);
    return classDate.getTime() === today.getTime();
  });

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">Class Sessions</h1>
        <p className="text-white/80 mt-1">Manage all scheduled classes and meetings</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-l-4 border-l-primary shadow-lg bg-gradient-to-br from-white to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Today&apos;s Classes</p>
                <p className="text-3xl font-bold text-primary">{todayClasses.length}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Calendar className="h-7 w-7 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent shadow-lg bg-gradient-to-br from-white to-accent/5">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold text-accent">{sessions.length - todayClasses.length}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Clock className="h-7 w-7 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 shadow-lg bg-gradient-to-br from-white to-green-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <p className="text-3xl font-bold text-green-600">{sessions.length}</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center">
                <Video className="h-7 w-7 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500">No class sessions found</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Mobile Cards */}
          <div className="block lg:hidden space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={session.status === 'SCHEDULED' ? 'success' : 'secondary'}>
                      {session.status}
                    </Badge>
                    {session.meetingUrl && (
                      <a href={session.meetingUrl} target="_blank">
                        <Button size="sm" variant="outline" className="text-primary border-primary">
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="font-medium">{session.teacher.fullName}</span>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{session.student.fullName}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(session.scheduledAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block">
            <Card className="shadow-lg">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gradient-to-r from-gray-50 to-white">
                      <th className="text-left py-4 px-6 font-semibold">Teacher</th>
                      <th className="text-left py-4 px-6 font-semibold">Student</th>
                      <th className="text-left py-4 px-6 font-semibold">Date</th>
                      <th className="text-left py-4 px-6 font-semibold">Time</th>
                      <th className="text-left py-4 px-6 font-semibold">Status</th>
                      <th className="text-left py-4 px-6 font-semibold">Meeting</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((session) => (
                      <tr key={session.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium">{session.teacher.fullName}</td>
                        <td className="py-4 px-6">{session.student.fullName}</td>
                        <td className="py-4 px-6">
                          {new Date(session.scheduledAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          {new Date(session.scheduledAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <Badge variant={session.status === 'SCHEDULED' ? 'success' : 'secondary'}>
                            {session.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-6">
                          {session.meetingUrl && (
                            <a href={session.meetingUrl} target="_blank">
                              <Button size="sm" variant="outline" className="text-primary border-primary hover:bg-primary hover:text-white transition-all">
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
          </div>
        </>
      )}
    </div>
  );
}