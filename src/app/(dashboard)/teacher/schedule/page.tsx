// src/app/(dashboard)/teacher/schedule/page.tsx
'use client';

import { useState } from 'react';
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
import { Video, Plus, Calendar, Clock } from 'lucide-react';

interface ClassSession {
  id: string;
  studentName: string;
  date: string;
  time: string;
  meetingUrl: string;
  status: string;
}

export default function TeacherSchedulePage(): React.ReactNode {
  const [showForm, setShowForm] = useState<boolean>(false);
  const [studentId, setStudentId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('');

  function generateJitsiLink(): string {
    const roomName = `dar-al-huda-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    return `https://meet.jit.si/${roomName}`;
  }

  async function handleCreateSession(): Promise<void> {
    const meetingUrl = generateJitsiLink();
    // Save to database with meetingUrl
    setShowForm(false);
  }

  // Mock sessions
  const sessions: ClassSession[] = [
    {
      id: '1',
      studentName: 'Ahmed Mohammed',
      date: '2024-01-15',
      time: '10:00',
      meetingUrl: 'https://meet.jit.si/dar-al-huda-abc123',
      status: 'SCHEDULED',
    },
    {
      id: '2',
      studentName: 'Fatima Ali',
      date: '2024-01-15',
      time: '14:00',
      meetingUrl: 'https://meet.jit.si/dar-al-huda-def456',
      status: 'SCHEDULED',
    },
  ];

  const morningSessions = sessions.filter(s => parseInt(s.time) < 12);
  const afternoonSessions = sessions.filter(s => parseInt(s.time) >= 12);

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

      {/* Create Session Form */}
      {showForm && (
        <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Create New Session
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Select Student</Label>
                <Select value={studentId} onValueChange={setStudentId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student1">Ahmed Mohammed</SelectItem>
                    <SelectItem value="student2">Fatima Ali</SelectItem>
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
              <Button onClick={handleCreateSession} className="w-full">
                Generate Meeting Link & Save
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morning Sessions */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-amber-50 to-yellow-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            Morning Sessions
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
                      <p className="font-medium">{session.studentName}</p>
                      <p className="text-sm text-gray-500">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Scheduled</Badge>
                    <a href={session.meetingUrl} target="_blank">
                      <Button size="sm" variant="outline" className="text-primary border-primary">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No morning sessions</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Afternoon Sessions */}
      <Card>
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            Afternoon Sessions
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
                      <p className="font-medium">{session.studentName}</p>
                      <p className="text-sm text-gray-500">
                        {session.date} at {session.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="success">Scheduled</Badge>
                    <a href={session.meetingUrl} target="_blank">
                      <Button size="sm" variant="outline" className="text-primary border-primary">
                        <Video className="h-4 w-4 mr-1" />
                        Join
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No afternoon sessions</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}