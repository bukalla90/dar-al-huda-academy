// src/app/(dashboard)/teacher/schedule/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Video, Plus, Calendar, Clock, X, Loader2 } from 'lucide-react';
import { getTeacherSessions, getTeacherStudents, createClassSession } from '@/lib/action/class.action';
import { JitsiMeetingComponent } from '@/components/jitsi/jitsi-meeting';

interface SessionType {
  id: string;
  scheduledAt: Date;
  meetingUrl: string;
  status: string;
  student: {
    id: string;
    fullName: string;
  };
}

interface StudentOption {
  id: string;
  fullName: string;
  courseType: string;
}

interface ActiveMeeting {
  roomName: string;
  userName: string;
}

export default function TeacherSchedulePage(): React.ReactNode {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [activeMeeting, setActiveMeeting] = useState<ActiveMeeting | null>(null);

  const loadData = useCallback(async (): Promise<void> => {
    setPageLoading(true);
    setError('');
    
    // Call server actions without teacherId - they'll get it from cookies server-side
    const [sessionsResult, studentsResult] = await Promise.all([
      getTeacherSessions(),
      getTeacherStudents(),
    ]);

    if (sessionsResult.success && sessionsResult.sessions) {
      setSessions(sessionsResult.sessions);
    } else if (sessionsResult.error) {
      setError(sessionsResult.error);
    }

    if (studentsResult.success && studentsResult.students) {
      setStudents(studentsResult.students);
    } else if (studentsResult.error) {
      setError(studentsResult.error);
    }

    setPageLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleCreateSession(): Promise<void> {
    if (!studentId || !date || !time) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Server action gets teacherId from cookies
    const result = await createClassSession({
      studentId,
      date,
      time,
    });

    if (result.success) {
      setSuccess('Meeting link created!');
      setStudentId('');
      setDate('');
      setTime('');
      setShowForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to create session');
    }

    setLoading(false);
  }

  function joinMeeting(meetingUrl: string, studentName: string): void {
    const roomName = meetingUrl.replace('https://meet.jit.si/', '');
    setActiveMeeting({ roomName, userName: studentName });
  }

  function closeMeeting(): void {
    setActiveMeeting(null);
  }

  const morningSessions = sessions.filter((s) => {
    const hour = new Date(s.scheduledAt).getHours();
    return hour < 12;
  });

  const afternoonSessions = sessions.filter((s) => {
    const hour = new Date(s.scheduledAt).getHours();
    return hour >= 12;
  });

  if (activeMeeting) {
    return (
      <JitsiMeetingComponent
        roomName={activeMeeting.roomName}
        userName={activeMeeting.userName}
        onClose={closeMeeting}
      />
    );
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">My Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Manage class sessions and meetings</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          New Session
        </Button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
      )}

      {showForm && (
        <Card className="border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Create New Session
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Select Student</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder={students.length === 0 ? 'No students assigned' : 'Choose student'} />
                  </SelectTrigger>
                  <SelectContent>
                    {students.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 text-center">
                        No students assigned to you yet
                      </div>
                    ) : (
                      students.map((student) => (
                        <SelectItem key={student.id} value={student.id}>
                          {student.fullName} - {student.courseType.replace(/_/g, ' ')}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {students.length === 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    Admin needs to assign students to you first
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
              </div>
              <Button 
                onClick={handleCreateSession} 
                disabled={loading || students.length === 0} 
                className="w-full bg-primary"
              >
                {loading ? 'Creating...' : 'Generate Meeting Link & Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-amber-600" />
            Morning Sessions ({morningSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {morningSessions.length > 0 ? (
            <div className="divide-y">
              {morningSessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.student.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Scheduled</Badge>
                    <Button 
                      size="sm" 
                      className="bg-primary"
                      onClick={() => joinMeeting(session.meetingUrl, session.student.fullName)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No morning sessions</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-blue-600" />
            Afternoon Sessions ({afternoonSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {afternoonSessions.length > 0 ? (
            <div className="divide-y">
              {afternoonSessions.map((session) => (
                <div key={session.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Video className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{session.student.fullName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Scheduled</Badge>
                    <Button 
                      size="sm" 
                      className="bg-primary"
                      onClick={() => joinMeeting(session.meetingUrl, session.student.fullName)}
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Join
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No afternoon sessions</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}