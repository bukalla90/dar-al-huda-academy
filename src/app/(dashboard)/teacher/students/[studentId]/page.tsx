// src/app/(dashboard)/teacher/students/[studentId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, BookOpen, Star, Plus, Loader2, Clock, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { createProgress, getStudentProgress, getStudentCurrentStatus } from '@/lib/action/progress.action';

const progressSchema = z.object({
  surah: z.string().min(1, 'Surah is required'),
  ayahFrom: z.string().min(1, 'Ayah from is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 1, 'Must be at least 1'),
  ayahTo: z.string().min(1, 'Ayah to is required').refine((val) => !isNaN(parseInt(val)) && parseInt(val) >= 1, 'Must be at least 1'),
  score: z.string().min(1, 'Please select a score'),
  notes: z.string().optional(),
});

const scheduleSchema = z.object({
  scheduleTime: z.string().min(1, 'Schedule time is required'),
});

type ProgressFormData = z.infer<typeof progressSchema>;
type ScheduleFormData = z.infer<typeof scheduleSchema>;

interface ProgressRecord {
  id: string;
  surah: string;
  ayahFrom: number;
  ayahTo: number;
  score: number;
  notes: string;
  createdAt: Date;
  teacher: {
    fullName: string;
  };
}

interface StudentStatus {
  currentSurah: string;
  currentJuz: string;
  averageScore: number;
  totalRecords: number;
  lastUpdated: Date | null;
}

export default function StudentProgressPage(): React.ReactNode {
  const params = useParams();
  const studentId = params.studentId as string;

  const [showForm, setShowForm] = useState<boolean>(false);
  const [showScheduleForm, setShowScheduleForm] = useState<boolean>(false);
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [status, setStatus] = useState<StudentStatus | null>(null);
  const [scheduleTime, setScheduleTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [scheduleLoading, setScheduleLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProgressFormData>({
    resolver: zodResolver(progressSchema),
  });

  const {
    register: registerSchedule,
    handleSubmit: handleScheduleSubmit,
    formState: { errors: scheduleErrors },
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleSchema),
  });

  const score = watch('score');

  const loadData = useCallback(async (): Promise<void> => {
    if (!studentId) return;
    
    setPageLoading(true);
    const [progressResult, statusResult] = await Promise.all([
      getStudentProgress(studentId),
      getStudentCurrentStatus(studentId),
    ]);

    if (progressResult.success && progressResult.progress) {
      setProgress(progressResult.progress);
    }

    if (statusResult.success && statusResult.status) {
      setStatus(statusResult.status);
    }

    // Load student schedule time
    try {
      const res = await fetch(`/api/students/${studentId}/schedule`);
      const data = await res.json();
      if (data.success && data.scheduleTime) {
        setScheduleTime(data.scheduleTime);
      }
    } catch {}

    setPageLoading(false);
  }, [studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function onSubmit(data: ProgressFormData): Promise<void> {
    setLoading(true);
    setError('');

    const result = await createProgress({
      studentId,
      surah: data.surah,
      ayahFrom: parseInt(data.ayahFrom),
      ayahTo: parseInt(data.ayahTo),
      score: parseInt(data.score),
      notes: data.notes || '',
    });

    if (result.success) {
      reset();
      setShowForm(false);
      loadData();
    } else {
      setError(result.error || 'Failed to save progress');
    }

    setLoading(false);
  }

  async function onScheduleSubmit(data: ScheduleFormData): Promise<void> {
    setScheduleLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/students/${studentId}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scheduleTime: data.scheduleTime }),
      });

      const result = await res.json();

      if (result.success) {
        setScheduleTime(data.scheduleTime);
        setShowScheduleForm(false);
        setSuccess('Daily schedule updated!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to update schedule');
      }
    } catch {
      setError('Failed to update schedule');
    } finally {
      setScheduleLoading(false);
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">Loading student progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/teacher/students">
            <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Student Progress</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track memorization and recitation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setShowScheduleForm(!showScheduleForm)} variant="outline" className="dark:border-gray-600 dark:text-gray-300">
            <Clock className="h-4 w-4 mr-2" />
            Set Schedule
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
            <Plus className="h-4 w-4 mr-2" />
            Add Progress
          </Button>
        </div>
      </div>

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm">{success}</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

      {/* Daily Schedule Section */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 dark:text-white">
            <Clock className="h-5 w-5 text-accent" />
            Permanent Daily Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scheduleTime ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary">{scheduleTime}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This student has class everyday at this time
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setShowScheduleForm(true)} className="dark:border-gray-600 dark:text-gray-300">
                Change
              </Button>
            </div>
          ) : (
            <div className="text-center py-4">
              <Clock className="h-10 w-10 text-gray-300 dark:text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">No permanent schedule set</p>
              <Button variant="outline" size="sm" className="mt-2 dark:border-gray-600 dark:text-gray-300" onClick={() => setShowScheduleForm(true)}>
                <Plus className="h-4 w-4 mr-1" /> Set Schedule
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Form */}
      {showScheduleForm && (
        <Card className="border-2 border-accent/20 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <Clock className="h-5 w-5 text-accent" />
              Set Daily Schedule Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleScheduleSubmit(onScheduleSubmit)} className="space-y-4">
              <div>
                <Label className="dark:text-gray-300">Daily Class Time *</Label>
                <Input 
                  type="time"
                  {...registerSchedule('scheduleTime')}
                  defaultValue={scheduleTime}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {scheduleErrors.scheduleTime && (
                  <p className="text-red-500 text-xs mt-1">{scheduleErrors.scheduleTime.message}</p>
                )}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  This will be shown on the student&apos;s dashboard as their regular class time
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={scheduleLoading} className="flex-1">
                  {scheduleLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  {scheduleLoading ? 'Saving...' : 'Save Schedule'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowScheduleForm(false)} className="dark:border-gray-600 dark:text-gray-300">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Current Status */}
      {status && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-white/80 text-sm">Current Surah</p>
                <p className="text-2xl font-bold">{status.currentSurah}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Average Score</p>
                <p className="text-2xl font-bold">{status.averageScore}/10</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Total Records</p>
                <p className="text-2xl font-bold">{status.totalRecords}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Last Updated</p>
                <p className="text-lg font-semibold">
                  {status.lastUpdated 
                    ? new Date(status.lastUpdated).toLocaleDateString() 
                    : 'Never'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Progress Form */}
      {showForm && (
        <Card className="border-2 border-primary/20 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 dark:text-white">
              <BookOpen className="h-5 w-5 text-primary" />
              Add Progress Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">{error}</div>
              )}

              <div>
                <Label className="dark:text-gray-300">Surah *</Label>
                <Input 
                  {...register('surah')}
                  placeholder="e.g., Al-Baqarah"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                {errors.surah && <p className="text-red-500 text-xs mt-1">{errors.surah.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="dark:text-gray-300">Ayah From *</Label>
                  <Input 
                    {...register('ayahFrom')}
                    type="number"
                    placeholder="1"
                    min="1"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.ayahFrom && <p className="text-red-500 text-xs mt-1">{errors.ayahFrom.message}</p>}
                </div>
                <div>
                  <Label className="dark:text-gray-300">Ayah To *</Label>
                  <Input 
                    {...register('ayahTo')}
                    type="number"
                    placeholder="5"
                    min="1"
                    className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                  {errors.ayahTo && <p className="text-red-500 text-xs mt-1">{errors.ayahTo.message}</p>}
                </div>
              </div>
              
              <div>
                <Label className="dark:text-gray-300">Score (1-10) *</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setValue('score', String(num), { shouldValidate: true })}
                      className={`w-10 h-10 rounded-full font-medium transition-all ${
                        score === String(num)
                          ? 'bg-primary text-white scale-110 shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                {errors.score && <p className="text-red-500 text-xs mt-1">{errors.score.message}</p>}
              </div>

              <div>
                <Label className="dark:text-gray-300">Notes</Label>
                <Textarea
                  {...register('notes')}
                  placeholder="Add feedback or notes..."
                  rows={3}
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Progress'}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Progress History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg dark:text-white">Progress History</h3>
        
        {progress.length === 0 ? (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="py-8 text-center text-gray-500 dark:text-gray-400">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p>No progress records yet</p>
            </CardContent>
          </Card>
        ) : (
          progress.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-accent" />
                        <span className="text-sm font-medium">{record.score}/10</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg dark:text-white">
                      Surah {record.surah} - Ayah {record.ayahFrom}-{record.ayahTo}
                    </h3>
                    {record.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{record.notes}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        {new Date(record.createdAt).toLocaleDateString()} • By {record.teacher.fullName}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}