// src/app/(dashboard)/admin/students/[studentId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  Star, 
  BookOpen, 
  TrendingUp, 
  User, 
  Phone, 
  MapPin,
  Save,
  Loader2,
  CreditCard,
  GraduationCap,
} from 'lucide-react';
import Link from 'next/link';

interface StudentDetail {
  id: string;
  fullName: string;
  age: number;
  country: string;
  phone: string;
  courseType: string;
  parentName: string;
  parentPhone: string;
  parentWhatsapp: string;
  relationship: string;
  teacherId: string | null;
  user: {
    isActive: boolean;
    username: string;
  };
  teacher: {
    id: string;
    fullName: string;
  } | null;
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
  payments: Array<{
    id: string;
    month: string;
    amount: number;
    status: string;
    notes: string | null;
  }>;
}

interface TeacherOption {
  id: string;
  fullName: string;
  email: string;
}

export default function AdminStudentDetailPage(): React.ReactNode {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;

  const [student, setStudent] = useState<StudentDetail | null>(null);
  const [teachers, setTeachers] = useState<TeacherOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Edit states
  const [editTeacher, setEditTeacher] = useState<string>('');
  const [editCourse, setEditCourse] = useState<string>('');
  const [editStatus, setEditStatus] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState<boolean>(false);
  const [paymentMonth, setPaymentMonth] = useState<string>('');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>('UNPAID');

  useEffect(() => {
    if (studentId) {
      loadData();
    }
  }, [studentId]);

  async function loadData(): Promise<void> {
    setLoading(true);
    try {
      const [studentRes, teachersRes] = await Promise.all([
        fetch(`/api/admin/students/${studentId}`),
        fetch('/api/admin/teachers/list'),
      ]);

      const studentData = await studentRes.json();
      const teachersData = await teachersRes.json();

      if (studentData.success) {
        setStudent(studentData.student);
        setEditTeacher(studentData.student.teacherId || '');
        setEditCourse(studentData.student.courseType);
        setEditStatus(studentData.student.user.isActive ? 'active' : 'inactive');
      }

      if (teachersData.success) {
        setTeachers(teachersData.teachers);
      }
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateStudent(): Promise<void> {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: editTeacher || null,
          courseType: editCourse,
          isActive: editStatus === 'active',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Student updated successfully!');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update');
      }
    } catch (err) {
      setError('Failed to update student');
    } finally {
      setSaving(false);
    }
  }

  async function handleAddPayment(): Promise<void> {
    if (!paymentMonth || !paymentAmount) {
      setError('Please fill payment details');
      return;
    }

    setSaving(true);
    try {
      const res = await fetch('/api/admin/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          month: paymentMonth,
          amount: parseFloat(paymentAmount),
          status: paymentStatus,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess('Payment added!');
        setShowPaymentForm(false);
        setPaymentMonth('');
        setPaymentAmount('');
        loadData();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to add payment');
      }
    } catch (err) {
      setError('Failed to add payment');
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdatePaymentStatus(paymentId: string, status: string): Promise<void> {
    try {
      await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      setError('Failed to update payment');
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-gray-500">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500">Student not found</p>
        <Link href="/admin/students" className="text-primary hover:underline mt-2 inline-block">
          Back to Students
        </Link>
      </div>
    );
  }

  const averageScore = student.progress.length > 0
    ? Math.round(student.progress.reduce((sum, p) => sum + p.score, 0) / student.progress.length)
    : 0;

  const lastProgress = student.progress[0];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/students">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{student.fullName}</h1>
            <p className="text-sm text-gray-500">{student.courseType.replace(/_/g, ' ')} • Age {student.age} • {student.country}</p>
          </div>
        </div>
        <Button onClick={handleUpdateStudent} disabled={saving} className="bg-primary">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {success && (
        <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm">{success}</div>
      )}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm">{error}</div>
      )}

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <User className="h-4 w-4" /> Teacher
            </div>
            <p className="font-semibold">{student.teacher?.fullName || 'Unassigned'}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Star className="h-4 w-4" /> Average Score
            </div>
            <p className="font-semibold text-2xl">{averageScore}/10</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BookOpen className="h-4 w-4" /> Records
            </div>
            <p className="font-semibold text-2xl">{student.progress.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <TrendingUp className="h-4 w-4" /> Status
            </div>
            <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
              {student.user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Edit Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Edit Student</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Assign Teacher</Label>
              <Select value={editTeacher} onValueChange={setEditTeacher}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No teacher</SelectItem>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Course</Label>
              <Select value={editCourse} onValueChange={setEditCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HIFZ">Hifz</SelectItem>
                  <SelectItem value="TAJWEED">Tajweed</SelectItem>
                  <SelectItem value="NAZIRAH">Nazirah</SelectItem>
                  <SelectItem value="MURAJAAH">Murajaah</SelectItem>
                  <SelectItem value="AQIDAH">Aqidah</SelectItem>
                  <SelectItem value="FIQH">Fiqh</SelectItem>
                  <SelectItem value="HADITH">Hadith</SelectItem>
                  <SelectItem value="ARABIC_LANGUAGE">Arabic Language</SelectItem>
                  <SelectItem value="ISLAMIC_MANNERS">Islamic Manners</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Guardian Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Guardian Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{student.parentName}</span>
              <span className="text-gray-500">({student.relationship})</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{student.parentPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>WhatsApp: {student.parentWhatsapp}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Payments</CardTitle>
          <Button size="sm" onClick={() => setShowPaymentForm(!showPaymentForm)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          {showPaymentForm && (
            <div className="mb-6 p-4 bg-gray-50 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Month</Label>
                  <Input 
                    type="month" 
                    value={paymentMonth} 
                    onChange={(e) => setPaymentMonth(e.target.value)}
                  />
                </div>
                <div>
                  <Label>Amount ($)</Label>
                  <Input 
                    type="number" 
                    value={paymentAmount} 
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="50"
                  />
                </div>
                <div>
                  <Label>Status</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="PARTIAL">Partial</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddPayment} disabled={saving} size="sm">
                Save Payment
              </Button>
            </div>
          )}

          <div className="space-y-2">
            {student.payments.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No payments recorded</p>
            ) : (
              student.payments.map((payment) => (
                <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{payment.month}</p>
                    <p className="text-sm text-gray-500">${payment.amount}</p>
                  </div>
                  <Select 
                    value={payment.status} 
                    onValueChange={(value) => handleUpdatePaymentStatus(payment.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="PARTIAL">Partial</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Current Status */}
      {lastProgress && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Currently On</p>
                <p className="text-2xl font-bold">Surah {lastProgress.surah}</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Last Score</p>
                <p className="text-2xl font-bold">{lastProgress.score}/10</p>
              </div>
              <div>
                <p className="text-white/80 text-sm">Updated By</p>
                <p className="text-2xl font-bold">{lastProgress.teacher.fullName}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress History */}
      <Card>
        <CardHeader>
          <CardTitle>Progress History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {student.progress.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No progress records</p>
            ) : (
              student.progress.map((record) => (
                <div key={record.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">
                        Surah {record.surah} - Ayah {record.ayahFrom}-{record.ayahTo}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-medium">{record.score}/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400">
                        {new Date(record.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-400">By: {record.teacher.fullName}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}