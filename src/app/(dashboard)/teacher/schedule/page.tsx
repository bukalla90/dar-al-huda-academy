// src/app/(dashboard)/teacher/schedule/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Video, Plus, Calendar, Clock, X, Loader2, Users, Check, ExternalLink, Link2, CheckCircle2 } from 'lucide-react';
import { getTeacherSessions, getTeacherStudents, createClassSession } from '@/lib/action/class.action';

interface SessionStudent {
  student: { id: string; fullName: string };
  joinedAt: Date | null;
}

interface SessionType {
  id: string;
  scheduledAt: Date;
  meetingUrl: string;
  status: string;
  sessionStudents: SessionStudent[];
}

interface StudentOption {
  id: string;
  fullName: string;
  courseType: string;
}

export default function TeacherSchedulePage(): React.ReactNode {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');
  const [zoomLink, setZoomLink] = useState<string>('');
  const [sessions, setSessions] = useState<SessionType[]>([]);
  const [students, setStudents] = useState<StudentOption[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const loadData = useCallback(async (): Promise<void> => {
    setPageLoading(true);
    setError('');
    
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
    }

    setPageLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function toggleStudent(studentId: string): void {
    setSelectedStudents(prev => 
      prev.includes(studentId) 
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  }

  async function handleCreateSession(): Promise<void> {
    if (selectedStudents.length === 0 || !date || !time) {
      setError('Please select at least one student, date, and time');
      return;
    }

    if (!zoomLink || !zoomLink.includes('zoom.us')) {
      setError('Please enter a valid Zoom meeting link');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createClassSession({
      studentIds: selectedStudents,
      date,
      time,
      meetingUrl: zoomLink,
    });

    if (result.success) {
      setSuccess(`Session created for ${selectedStudents.length} student(s)!`);
      setSelectedStudents([]);
      setDate('');
      setTime('');
      setZoomLink('');
      setShowForm(false);
      loadData();
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError(result.error || 'Failed to create session');
    }

    setLoading(false);
  }

  // Filter: Only show sessions from last 24 hours and future
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  
  const recentAndUpcomingSessions = sessions.filter((s) => {
    const sessionTime = new Date(s.scheduledAt);
    return sessionTime >= twentyFourHoursAgo;
  });

  const morningSessions = recentAndUpcomingSessions.filter((s) => new Date(s.scheduledAt).getHours() < 12);
  const afternoonSessions = recentAndUpcomingSessions.filter((s) => new Date(s.scheduledAt).getHours() >= 12);

  // Check if session is still joinable (not completed and within time window)
  function isJoinable(session: SessionType): boolean {
    const sessionTime = new Date(session.scheduledAt);
    const diffMs = sessionTime.getTime() - now.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    
    // Can join 15 min before and up to 2 hours after start
    return diffMinutes <= 15 && diffMinutes > -120 && session.status !== 'COMPLETED' && session.status !== 'MISSED';
  }

  function getStatusBadge(status: string): React.ReactNode {
    const variants: Record<string, 'success' | 'warning' | 'secondary' | 'destructive'> = {
      SCHEDULED: 'secondary',
      LIVE: 'success',
      COMPLETED: 'success',
      MISSED: 'destructive',
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Schedule</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Showing sessions from last 24 hours and upcoming
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />New Session
        </Button>
      </div>

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm">{success}</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

      {/* Create Session Form */}
      {showForm && (
        <Card className="border-2 border-primary/20 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Video className="h-5 w-5 text-primary" />Create Zoom Session
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowForm(false)} className="dark:hover:bg-gray-700">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">
                  <Link2 className="h-4 w-4 inline mr-1" />
                  Zoom Meeting Link *
                </Label>
                <Input 
                  type="url"
                  placeholder="https://us04web.zoom.us/j/123456789?pwd=..."
                  value={zoomLink}
                  onChange={(e) => setZoomLink(e.target.value)}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white mt-1"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Create a meeting in Zoom, copy the invite link, and paste it here
                </p>
              </div>

              <div>
                <Label className="dark:text-gray-300">Select Students ({selectedStudents.length} selected)</Label>
                <div className="max-h-48 overflow-y-auto space-y-1 mt-2 border dark:border-gray-700 rounded-lg p-2">
                  {students.length === 0 ? (
                    <p className="text-sm text-gray-500 text-center py-4">No students assigned</p>
                  ) : (
                    students.map((student) => (
                      <button
                        key={student.id}
                        type="button"
                        onClick={() => toggleStudent(student.id)}
                        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-colors text-left ${
                          selectedStudents.includes(student.id)
                            ? 'bg-primary/10 border border-primary/30 dark:bg-primary/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                          selectedStudents.includes(student.id)
                            ? 'bg-primary border-primary'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selectedStudents.includes(student.id) && <Check className="h-3 w-3 text-white" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium dark:text-white">{student.fullName}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{student.courseType.replace(/_/g, ' ')}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Date</Label>
                  <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Time</Label>
                  <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
              </div>

              <Button onClick={handleCreateSession} disabled={loading || selectedStudents.length === 0 || !zoomLink} className="w-full bg-primary">
                {loading ? 'Creating...' : `Create Session for ${selectedStudents.length} student(s)`}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morning Sessions */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Calendar className="h-5 w-5 text-amber-600" />Morning Sessions ({morningSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {morningSessions.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {morningSessions.map((session) => {
                const joinable = isJoinable(session);
                const isPast = new Date(session.scheduledAt) < now;
                
                return (
                  <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium dark:text-white text-sm">
                              {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                              {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {session.sessionStudents.map(s => s.student.fullName).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {joinable && session.meetingUrl && (
                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="h-4 w-4 mr-1" />Join Zoom
                          </Button>
                        </a>
                      )}
                      {isPast && !joinable && session.status === 'COMPLETED' && (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />Done
                        </Badge>
                      )}
                      {isPast && !joinable && session.status === 'MISSED' && (
                        <Badge variant="outline" className="text-red-500 flex items-center gap-1">
                          <X className="h-3 w-3" />Missed
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No morning sessions</div>
          )}
        </CardContent>
      </Card>

      {/* Afternoon Sessions */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="border-b dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
          <CardTitle className="flex items-center gap-2 text-lg dark:text-white">
            <Clock className="h-5 w-5 text-blue-600" />Afternoon Sessions ({afternoonSessions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {afternoonSessions.length > 0 ? (
            <div className="divide-y dark:divide-gray-700">
              {afternoonSessions.map((session) => {
                const joinable = isJoinable(session);
                const isPast = new Date(session.scheduledAt) < now;
                
                return (
                  <div key={session.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Video className="h-5 w-5 text-primary" />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium dark:text-white text-sm">
                              {new Date(session.scheduledAt).toLocaleDateString()} at{' '}
                              {new Date(session.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {getStatusBadge(session.status)}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {session.sessionStudents.map(s => s.student.fullName).join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {joinable && session.meetingUrl && (
                        <a href={session.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <ExternalLink className="h-4 w-4 mr-1" />Join Zoom
                          </Button>
                        </a>
                      )}
                      {isPast && !joinable && session.status === 'COMPLETED' && (
                        <Badge variant="outline" className="text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />Done
                        </Badge>
                      )}
                      {isPast && !joinable && session.status === 'MISSED' && (
                        <Badge variant="outline" className="text-red-500 flex items-center gap-1">
                          <X className="h-3 w-3" />Missed
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">No afternoon sessions</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}