// src/app/(dashboard)/teacher/students/[studentId]/page.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Save, BookOpen, Star, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createProgress, getStudentProgress, getStudentCurrentStatus } from '@/lib/action/progress.action';

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
  const [surah, setSurah] = useState<string>('');
  const [ayahFrom, setAyahFrom] = useState<string>('');
  const [ayahTo, setAyahTo] = useState<string>('');
  const [score, setScore] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [progress, setProgress] = useState<ProgressRecord[]>([]);
  const [status, setStatus] = useState<StudentStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [pageLoading, setPageLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');

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

    // Get teacherId from cookie
    const teacherId = document.cookie
      .split('; ')
      .find(row => row.startsWith('teacherId='))
      ?.split('=')[1];

    setPageLoading(false);
  }, [studentId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleAddProgress(): Promise<void> {
    if (!surah || !ayahFrom || !ayahTo || !score) {
      setError('Please fill all required fields');
      return;
    }

    const teacherId = document.cookie
      .split('; ')
      .find(row => row.startsWith('teacherId='))
      ?.split('=')[1];

    if (!teacherId) {
      setError('Teacher ID not found. Please login again.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await createProgress({
      studentId,
      teacherId,
      surah,
      ayahFrom: parseInt(ayahFrom),
      ayahTo: parseInt(ayahTo),
      score: parseInt(score),
      notes,
      type: 'MEMORIZATION',
    });

    if (result.success) {
      setSurah('');
      setAyahFrom('');
      setAyahTo('');
      setScore('');
      setNotes('');
      setShowForm(false);
      loadData();
    } else {
      setError(result.error || 'Failed to save progress');
    }

    setLoading(false);
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading student progress...</p>
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
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Student Progress</h1>
            <p className="text-sm text-gray-500">Track memorization and recitation</p>
          </div>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="bg-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Progress
        </Button>
      </div>

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
        <Card className="border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Add Progress Record
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
              )}

              <div>
                <Label>Surah *</Label>
                <Input 
                  value={surah} 
                  onChange={(e) => setSurah(e.target.value)}
                  placeholder="e.g., Al-Baqarah"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Ayah From *</Label>
                  <Input 
                    type="number"
                    value={ayahFrom} 
                    onChange={(e) => setAyahFrom(e.target.value)}
                    placeholder="1"
                    min="1"
                  />
                </div>
                <div>
                  <Label>Ayah To *</Label>
                  <Input 
                    type="number"
                    value={ayahTo} 
                    onChange={(e) => setAyahTo(e.target.value)}
                    placeholder="5"
                    min="1"
                  />
                </div>
              </div>
              
              <div>
                <Label>Score (1-10) *</Label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setScore(String(num))}
                      className={`w-10 h-10 rounded-full font-medium transition-all ${
                        score === String(num)
                          ? 'bg-primary text-white scale-110 shadow-lg'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Notes</Label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add feedback or notes..."
                  rows={3}
                />
              </div>

              <Button 
                onClick={handleAddProgress}
                disabled={loading}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Saving...' : 'Save Progress'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress History */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">Progress History</h3>
        
        {progress.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-gray-500">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No progress records yet</p>
            </CardContent>
          </Card>
        ) : (
          progress.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full">
                        <Star className="h-4 w-4 fill-accent" />
                        <span className="text-sm font-medium">{record.score}/10</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-lg">
                      Surah {record.surah} - Ayah {record.ayahFrom}-{record.ayahTo}
                    </h3>
                    {record.notes && (
                      <p className="text-sm text-gray-600 mt-2">{record.notes}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-xs text-gray-400">
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