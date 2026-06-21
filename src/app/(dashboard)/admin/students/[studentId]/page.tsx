// src/app/(dashboard)/admin/students/[studentId]/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Star, BookOpen, TrendingUp, User, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

async function getStudentProgress(studentId: string) {
  const student = await prisma.student.findUnique({
    where: { id: studentId },
    include: {
      user: {
        select: { isActive: true, username: true },
      },
      teacher: {
        select: { fullName: true },
      },
      progress: {
        orderBy: { createdAt: 'desc' },
        include: {
          teacher: {
            select: { fullName: true },
          },
        },
      },
      payments: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
    },
  });
  return student;
}

export default async function StudentDetailPage({
  params,
}: {
  params: { studentId: string };
}): Promise<React.ReactNode> {
  const student = await getStudentProgress(params.studentId);

  if (!student) return <div>Student not found</div>;

  const averageScore = student.progress.length > 0
    ? Math.round(student.progress.reduce((sum, p) => sum + p.score, 0) / student.progress.length)
    : 0;

  const lastProgress = student.progress[0];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/students">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{student.fullName}</h1>
          <p className="text-sm text-gray-500">{student.courseType.replace(/_/g, ' ')}</p>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <User className="h-4 w-4" />
              Teacher
            </div>
            <p className="font-semibold">{student.teacher?.fullName || 'Unassigned'}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-accent">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <Star className="h-4 w-4" />
              Average Score
            </div>
            <p className="font-semibold text-2xl">{averageScore}/10</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <BookOpen className="h-4 w-4" />
              Progress Records
            </div>
            <p className="font-semibold text-2xl">{student.progress.length}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
              <TrendingUp className="h-4 w-4" />
              Status
            </div>
            <Badge variant={student.user.isActive ? 'success' : 'secondary'}>
              {student.user.isActive ? 'Active' : 'Inactive'}
            </Badge>
          </CardContent>
        </Card>
      </div>

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
            {student.progress.map((record) => (
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
                    <p className="text-xs text-gray-400">
                      By: {record.teacher.fullName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {student.payments.map((payment) => (
              <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{payment.month}</p>
                  <p className="text-sm text-gray-500">${payment.amount}</p>
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
        </CardContent>
      </Card>
    </div>
  );
}