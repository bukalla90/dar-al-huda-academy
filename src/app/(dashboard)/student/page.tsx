// src/app/(dashboard)/student/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Star, 
  GraduationCap, 
  Calendar, 
  Video,
  TrendingUp,
  Download,
  FileText,
  Music,
  Image,
  User,
  Phone,
  Clock,
} from 'lucide-react';
import { JitsiMeetingComponent } from '@/components/jitsi/jitsi-meeting';

interface StudentFull {
  id: string;
  fullName: string;
  courseType: string;
  age: number;
  country: string;
  phone: string;
  user: { isActive: boolean; username: string };
  teacher: { id: string; fullName: string; phone: string; email: string } | null;
  progress: Array<{
    id: string;
    surah: string;
    ayahFrom: number;
    ayahTo: number;
    score: number;
    notes: string;
    createdAt: string;
    teacher: { fullName: string };
  }>;
  sessions: Array<{
    id: string;
    scheduledAt: string;
    meetingUrl: string;
    status: string;
  }>;
  payments: Array<{
    id: string;
    month: string;
    amount: number;
    status: string;
  }>;
  materials: Array<{
    id: string;
    title: string;
    fileUrl: string;
    type: string;
  }>;
}

export default function StudentDashboardPage(): React.ReactNode {
  const [student, setStudent] = useState<StudentFull | null>(null);
  const [generalMaterials, setGeneralMaterials] = useState<Array<{ id: string; title: string; fileUrl: string; type: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeMeeting, setActiveMeeting] = useState<{ roomName: string; userName: string } | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch('/api/student/dashboard');
      const data = await response.json();
      if (data.success) {
        setStudent(data.student);
        setGeneralMaterials(data.generalMaterials || []);
      }
    } catch (error) {
      console.error('Failed to load student data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function joinMeeting(meetingUrl: string): void {
    const roomName = meetingUrl.replace('https://meet.jit.si/', '');
    setActiveMeeting({ roomName, userName: student?.fullName || 'Student' });
  }

  function closeMeeting(): void {
    setActiveMeeting(null);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (activeMeeting) {
    return (
      <JitsiMeetingComponent
        roomName={activeMeeting.roomName}
        userName={activeMeeting.userName}
        onClose={closeMeeting}
      />
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-xl text-gray-500">Student not found</p>
          <p className="text-sm text-gray-400 mt-2">Please contact admin if this is an error</p>
        </div>
      </div>
    );
  }

  const lastProgress = student.progress[0];
  const averageScore = student.progress.length > 0
    ? Math.round(student.progress.reduce((sum: number, p) => sum + p.score, 0) / student.progress.length)
    : 0;

  const today = new Date();
  const todaySessions = student.sessions.filter(s => {
    const sessionDate = new Date(s.scheduledAt);
    return sessionDate.toDateString() === today.toDateString();
  });

  const typeIcon: Record<string, typeof FileText> = {
    PDF: FileText,
    AUDIO: Music,
    IMAGE: Image,
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary via-primary to-secondary rounded-2xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Assalamu Alaikum, {student.fullName}!
            </h1>
            <p className="text-white/80 mt-2">
              {student.courseType.replace(/_/g, ' ')} Program
            </p>
          </div>
          <Badge className="bg-white/20 text-white border-0 px-4 py-2 text-sm">
            <BookOpen className="h-4 w-4 mr-2" />
            {student.user.isActive ? 'Active Student' : 'Inactive'}
          </Badge>
        </div>
      </div>

      {/* Current Status */}
      {lastProgress && (
        <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-gray-600">Current Surah</p>
                <p className="text-2xl font-bold text-primary mt-1">{lastProgress.surah}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Score</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <Star className="h-5 w-5 text-accent fill-accent" />
                  <span className="text-2xl font-bold text-accent">{lastProgress.score}/10</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="text-2xl font-bold text-green-600">{averageScore}/10</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Updated By</p>
                <p className="text-lg font-semibold text-text mt-1">{lastProgress.teacher.fullName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Progress Records</p>
                <p className="text-3xl font-bold text-text">{student.progress.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Avg: {averageScore}/10</p>
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
                <p className="text-sm text-gray-500">Materials</p>
                <p className="text-3xl font-bold text-text">{student.materials.length + generalMaterials.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Available</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Upcoming</p>
                <p className="text-3xl font-bold text-text">{student.sessions.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">Scheduled</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Teacher */}
          {student.teacher ? (
            <Card className="shadow-lg border-0">
              <CardHeader className="border-b bg-gradient-to-r from-primary/5 to-secondary/5">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  My Teacher (Ustaz)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-text">{student.teacher.fullName}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Phone className="h-4 w-4" />
                        {student.teacher.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="shadow-lg border-0">
              <CardContent className="py-8 text-center text-gray-500">
                <GraduationCap className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>No teacher assigned yet</p>
                <p className="text-sm">Admin will assign a teacher soon</p>
              </CardContent>
            </Card>
          )}

          {/* Today's Classes */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Today&apos;s Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {todaySessions.length > 0 ? (
                <div className="divide-y">
                  {todaySessions.map((session) => (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">Class Session</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.scheduledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      {session.meetingUrl && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => joinMeeting(session.meetingUrl)}
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Join Class
                        </Button>
                      )}
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

          {/* Progress History */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Recent Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {student.progress.length > 0 ? (
                <div className="divide-y">
                  {student.progress.map((record) => (
                    <div key={record.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">
                              Surah {record.surah} - Ayah {record.ayahFrom}-{record.ayahTo}
                            </h4>
                            <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              <Star className="h-3 w-3 fill-accent" />
                              <span className="text-xs font-medium">{record.score}/10</span>
                            </div>
                          </div>
                          {record.notes && (
                            <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(record.createdAt).toLocaleDateString()} • By {record.teacher.fullName}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No progress records yet</p>
                  <p className="text-sm">Your teacher will update your progress after each class</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-accent" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {student.sessions.length > 0 ? (
                <div className="divide-y">
                  {student.sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-2 h-2 rounded-full bg-accent" />
                        <div>
                          <p className="font-medium">Class Session</p>
                          <p className="text-sm text-gray-500">
                            {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                            {new Date(session.scheduledAt).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                      {session.meetingUrl && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="text-primary border-primary"
                          onClick={() => joinMeeting(session.meetingUrl)}
                        >
                          <Video className="h-4 w-4 mr-1" />
                          Join
                        </Button>
                      )}
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

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Payment Status */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-semibold">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {student.payments.length > 0 ? (
                <div className="space-y-3">
                  {student.payments.map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{payment.month}</p>
                        <p className="text-xs text-gray-500">${payment.amount}</p>
                      </div>
                      <Badge 
                        variant={
                          payment.status === 'PAID' ? 'success' : 
                          payment.status === 'OVERDUE' ? 'destructive' : 'warning'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-4 text-sm">No payment records</p>
              )}
            </CardContent>
          </Card>

          {/* Learning Materials */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b">
              <CardTitle className="text-lg font-semibold">My Materials</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {student.materials.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">My Materials</p>
                  <div className="space-y-2">
                    {student.materials.map((material) => {
                      const Icon = typeIcon[material.type] || FileText;
                      return (
                        <a 
                          key={material.id}
                          href={material.fileUrl} 
                          target="_blank"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{material.title}</p>
                            <p className="text-xs text-gray-500">{material.type}</p>
                          </div>
                          <Download className="h-4 w-4 text-gray-400" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {generalMaterials.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">General Materials</p>
                  <div className="space-y-2">
                    {generalMaterials.map((material) => {
                      const Icon = typeIcon[material.type] || FileText;
                      return (
                        <a 
                          key={material.id}
                          href={material.fileUrl} 
                          target="_blank"
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100"
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{material.title}</p>
                            <p className="text-xs text-gray-500">{material.type}</p>
                          </div>
                          <Download className="h-4 w-4 text-gray-400" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {student.materials.length === 0 && generalMaterials.length === 0 && (
                <p className="text-center text-gray-500 py-4 text-sm">No materials available</p>
              )}
            </CardContent>
          </Card>

          {/* Quick Info */}
          <Card className="shadow-lg border-0 bg-gradient-to-br from-primary to-secondary text-white">
            <CardContent className="pt-6">
              <div className="text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-white/80" />
                <p className="text-white/80 text-sm">My Course</p>
                <p className="text-xl font-bold mt-1">{student.courseType.replace(/_/g, ' ')}</p>
                <div className="flex justify-center gap-4 mt-4 text-sm text-white/80">
                  <div>
                    <p className="font-bold">{student.progress.length}</p>
                    <p>Records</p>
                  </div>
                  <div>
                    <p className="font-bold">{student.sessions.length}</p>
                    <p>Classes</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}