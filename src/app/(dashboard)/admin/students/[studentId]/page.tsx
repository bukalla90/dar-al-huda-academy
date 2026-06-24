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
  Save,
  Loader2,
  CreditCard,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
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

const statusIcon: Record<string, typeof CheckCircle> = {
  PAID: CheckCircle,
  UNPAID: XCircle,
  PARTIAL: AlertTriangle,
  OVERDUE: Clock,
};

const statusColor: Record<string, string> = {
  PAID: 'text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400',
  UNPAID: 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400',
  PARTIAL: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30 dark:text-yellow-400',
  OVERDUE: 'text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400',
};

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
        body: JSON.stringify({ teacherId: editTeacher || null, courseType: editCourse, isActive: editStatus === 'active' }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Student updated!');
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
        body: JSON.stringify({ studentId, month: paymentMonth, amount: parseFloat(paymentAmount), status: paymentStatus }),
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
          <p className="text-gray-500 dark:text-gray-400">Loading student details...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-500 dark:text-gray-400">Student not found</p>
        <Link href="/admin/students" className="text-primary hover:underline mt-2 inline-block">Back to Students</Link>
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
            <Button variant="ghost" size="icon" className="dark:hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5 dark:text-gray-300" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{student.fullName}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{student.courseType.replace(/_/g, ' ')} • Age {student.age} • {student.country}</p>
          </div>
        </div>
        <Button onClick={handleUpdateStudent} disabled={saving} className="bg-primary">
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      {success && <div className="bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-sm">{success}</div>}
      {error && <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm">{error}</div>}

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teacher</p>
            <p className="font-semibold dark:text-white">{student.teacher?.fullName || 'Unassigned'}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-accent dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Average Score</p>
            <p className="font-semibold text-2xl dark:text-white">{averageScore}/10</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-green-500 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Records</p>
            <p className="font-semibold text-2xl dark:text-white">{student.progress.length}</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-blue-500 dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="pt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</p>
            <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
              {student.user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Edit & Guardian */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader><CardTitle className="text-lg dark:text-white">Edit Student</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="dark:text-gray-300">Assign Teacher</Label>
              <Select value={editTeacher} onValueChange={setEditTeacher}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="">No teacher</SelectItem>
                  {teachers.map((t) => <SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="dark:text-gray-300">Course</Label>
              <Select value={editCourse} onValueChange={setEditCourse}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
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
              <Label className="dark:text-gray-300">Status</Label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-800">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardHeader><CardTitle className="text-lg dark:text-white">Guardian Information</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2 dark:text-gray-300">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium">{student.parentName}</span>
              <span className="text-gray-500 dark:text-gray-400">({student.relationship})</span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{student.parentPhone}</span>
            </div>
            <div className="flex items-center gap-2 dark:text-gray-300">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>WhatsApp: {student.parentWhatsapp}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment History Table */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg dark:text-white">Payment History</CardTitle>
          <Button size="sm" onClick={() => setShowPaymentForm(!showPaymentForm)}>
            <CreditCard className="h-4 w-4 mr-2" />
            Add Payment
          </Button>
        </CardHeader>
        <CardContent>
          {showPaymentForm && (
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="dark:text-gray-300">Month</Label>
                  <Input type="month" value={paymentMonth} onChange={(e) => setPaymentMonth(e.target.value)} className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Amount (ETB)</Label>
                  <Input type="number" value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="500" className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                </div>
                <div>
                  <Label className="dark:text-gray-300">Status</Label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="dark:bg-gray-800">
                      <SelectItem value="PAID">Paid</SelectItem>
                      <SelectItem value="UNPAID">Unpaid</SelectItem>
                      <SelectItem value="PARTIAL">Partial</SelectItem>
                      <SelectItem value="OVERDUE">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddPayment} disabled={saving} size="sm">Save Payment</Button>
            </div>
          )}

          {student.payments.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">No payments recorded</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Month</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Amount</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Notes</th>
                    <th className="text-right py-3 px-4 text-sm font-medium text-gray-500 dark:text-gray-400">Update</th>
                  </tr>
                </thead>
                <tbody>
                  {student.payments.map((payment) => {
                    const Icon = statusIcon[payment.status] || CreditCard;
                    return (
                      <tr key={payment.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4">
                          <p className="font-medium dark:text-white">{payment.month}</p>
                        </td>
                        <td className="py-3 px-4">
                          <p className="font-medium dark:text-white">ETB {payment.amount}</p>
                        </td>
                        <td className="py-3 px-4">
                          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[payment.status]}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {payment.status}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm text-gray-500 dark:text-gray-400">{payment.notes || '-'}</p>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Select value={payment.status} onValueChange={(value) => handleUpdatePaymentStatus(payment.id, value)}>
                            <SelectTrigger className="w-[110px] h-8 text-xs dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="dark:bg-gray-800">
                              <SelectItem value="PAID">Paid</SelectItem>
                              <SelectItem value="UNPAID">Unpaid</SelectItem>
                              <SelectItem value="PARTIAL">Partial</SelectItem>
                              <SelectItem value="OVERDUE">Overdue</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Progress Status */}
      {lastProgress && (
        <Card className="bg-gradient-to-r from-primary to-secondary text-white border-0">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div><p className="text-white/80 text-sm">Currently On</p><p className="text-2xl font-bold">Surah {lastProgress.surah}</p></div>
              <div><p className="text-white/80 text-sm">Last Score</p><p className="text-2xl font-bold">{lastProgress.score}/10</p></div>
              <div><p className="text-white/80 text-sm">Updated By</p><p className="text-2xl font-bold">{lastProgress.teacher.fullName}</p></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Progress History */}
      <Card className="dark:bg-gray-800 dark:border-gray-700">
        <CardHeader><CardTitle className="dark:text-white">Progress History</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {student.progress.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-4">No progress records</p>
            ) : (
              student.progress.map((record) => (
                <div key={record.id} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold dark:text-white">Surah {record.surah} - Ayah {record.ayahFrom}-{record.ayahTo}</h4>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-accent fill-accent" />
                        <span className="font-medium dark:text-gray-200">{record.score}/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{record.notes}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">By: {record.teacher.fullName}</p>
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