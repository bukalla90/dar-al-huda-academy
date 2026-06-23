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
} from 'lucide-react';
import { JitsiMeetingComponent } from '@/components/jitsi/jitsi-meeting';

interface StudentData {
  fullName: string;
  courseType: string;
  user: { isActive: boolean };
  teacher: { fullName: string; phone: string } | null;
  progress: Array<{
    id: string;
    surah: string;
    ayahFrom: number;
    ayahTo: number;
    score: number;
    notes: string;
    createdAt: Date;
    teacher: { fullName: string };
  }>;
  sessions: Array<{
    id: string;
    scheduledAt: Date;
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

interface ActiveMeeting {
  roomName: string;
  userName: string;
}

export default function StudentDashboardPage(): React.ReactNode {
  const [student, setStudent] = useState<StudentData | null>(null);
  const [generalMaterials, setGeneralMaterials] = useState<Array<{ id: string; title: string; fileUrl: string; type: string }>>([]);
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    console.log('Loading student data...');
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function joinMeeting(meetingUrl: string): void {
    const roomName = meetingUrl.replace('https://meet.jit.si/', '');
    setActiveMeeting({ 
      roomName: roomName, 
      userName: student?.fullName || 'Student' 
    });
  }

  function closeMeeting(): void {
    setActiveMeeting(null);
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
        <p>Loading...</p>
      </div>
    );
  }

  const lastProgress = student.progress[0];
  const averageScore = student.progress.length > 0
    ? Math.round(student.progress.reduce((sum: number, p) => sum + p.score, 0) / student.progress.length)
    : 0;

  const typeIcon: Record<string, typeof FileText> = {
    PDF: FileText,
    AUDIO: Music,
    IMAGE: Image,
  };

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Welcome Card */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* My Teacher */}
          {student.teacher && (
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
          )}

          {/* Upcoming Classes */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-cyan-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Classes
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {student.sessions.length > 0 ? (
                <div className="divide-y">
                  {student.sessions.map((session) => (
                    <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Video className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {new Date(session.scheduledAt).toLocaleDateString()}
                          </p>
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
                  <p>No upcoming classes scheduled</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress History */}
          <Card className="shadow-lg border-0">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
                My Progress
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
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}