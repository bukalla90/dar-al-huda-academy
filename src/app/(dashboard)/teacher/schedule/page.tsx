// src/app/(dashboard)/teacher/schedule/page.tsx
'use client';

import { useState, useEffect } from 'react';
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
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users,
  X,
} from 'lucide-react';
import { getTeacherSessions, getTeacherStudents, createClassSession } from '@/lib/action/class.action';

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

export default function TeacherSchedulePage(): React.ReactNode {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData(): Promise<void> {
    const teacherId = 'temp-teacher-id'; // TODO: Get from session
    
    const [sessionsResult, studentsResult] = await Promise.all([
      getTeacherSessions(teacherId),
      getTeacherStudents(teacherId),
    ]);

    if (sessionsResult.success && sessionsResult.sessions) {
      setSessions(sessionsResult.sessions);
    }

    if (studentsResult.success && studentsResult.students) {
      setStudents(studentsResult.students);
    }
  }

  async function handleCreateSession(): Promise<void> {
    if (!studentId || !date || !time) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createClassSession({
      teacherId: 'temp-teacher-id', // TODO: Get from session
      studentId,
      date,
      time,
    });

    if (result.success) {
      setSuccess(`Meeting link created!`);
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

  const morningSessions = sessions.filter((s) => {
    const hour = new Date(s.scheduledAt).getHours();
    return hour < 12;
  });

  const afternoonSessions = sessions.filter((s) => {
    const hour = new Date(s.scheduledAt).getHours();
    return hour >= 12;
  });

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

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
      )}

      {/* Create Form */}
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
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.fullName} - {student.courseType.replace(/_/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                  />
                </div>
                <div>
                  <Label>Time</Label>
                  <Input 
                    type="time" 
                    value={time} 
                    onChange={(e) => setTime(e.target.value)} 
                  />
                </div>
              </div>
              <Button 
                onClick={handleCreateSession} 
                disabled={loading}
                className="w-full bg-primary"
              >
                {loading ? 'Creating...' : 'Generate Meeting Link & Save'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morning Sessions */}
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
                    <a href={session.meetingUrl} target="_blank">
                      <Button size="sm" className="bg-primary">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">No morning sessions</div>
          )}
        </CardContent>
      </Card>

      {/* Afternoon Sessions */}
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
                    <a href={session.meetingUrl} target="_blank">
                      <Button size="sm" className="bg-primary">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </a>
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