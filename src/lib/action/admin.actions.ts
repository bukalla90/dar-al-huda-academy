// src/lib/action/admin.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import type { Payment } from '@/generated/prisma/client';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeStudents: number;
  paidStudents: number;
  unpaidStudents: number;
  upcomingClasses: number;
  pendingApplications: number;
  monthlyIncome: number;
  teacherSalaries: number;
  netIncome: number;
  totalCourses: number;
}

interface RecentActivity {
  id: string;
  type: 'STUDENT' | 'TEACHER' | 'PAYMENT' | 'APPLICATION';
  title: string;
  description: string;
  timestamp: Date;
  status: string;
}

interface ChartData {
  label: string;
  value: number;
  color: string;
}

export async function getDashboardStats(): Promise<{
  success: boolean;
  stats?: DashboardStats;
  error?: string;
}> {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7);

    const [
      totalStudents,
      totalTeachers,
      activeStudents,
      paidStudents,
      unpaidStudents,
      upcomingClasses,
      pendingApplications,
      paymentsThisMonth,
      teachers,
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.student.count({ where: { user: { isActive: true } } }),
      prisma.payment.count({ where: { status: 'PAID', month: currentMonth } }),
      prisma.payment.count({ where: { status: 'UNPAID', month: currentMonth } }),
      prisma.classSession.count({ where: { scheduledAt: { gte: new Date() }, status: 'SCHEDULED' } }),
      prisma.application.count({ where: { status: 'PENDING' } }),
      prisma.payment.findMany({ where: { status: 'PAID', month: currentMonth }, select: { amount: true } }),
      prisma.teacher.findMany({ select: { salary: true } }),
    ]);

    const monthlyIncome = paymentsThisMonth.reduce((sum: number, p: Pick<Payment, 'amount'>) => sum + p.amount, 0);
    const teacherSalaries = teachers.reduce((sum: number, t: { salary: number | null }) => sum + (t.salary || 0), 0);
    const netIncome = monthlyIncome - teacherSalaries;

    const stats: DashboardStats = {
      totalStudents,
      totalTeachers,
      activeStudents,
      paidStudents,
      unpaidStudents,
      upcomingClasses,
      pendingApplications,
      monthlyIncome,
      teacherSalaries,
      netIncome,
      totalCourses: 9,
    };

    return { success: true, stats };
  } catch (error) {
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

export async function getRecentActivity(): Promise<{
  success: boolean;
  activities?: RecentActivity[];
  error?: string;
}> {
  try {
    const [recentStudents, recentTeachers, recentPayments, recentApplications] = await Promise.all([
      prisma.student.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, createdAt: true } }),
      prisma.teacher.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, createdAt: true } }),
      prisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, amount: true, status: true, createdAt: true, student: { select: { fullName: true } } } }),
      prisma.application.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, status: true, createdAt: true } }),
    ]);

    const activities: RecentActivity[] = [
      ...recentStudents.map((s) => ({ id: s.id, type: 'STUDENT' as const, title: 'New Student', description: `${s.fullName} joined`, timestamp: s.createdAt, status: 'Active' })),
      ...recentTeachers.map((t) => ({ id: t.id, type: 'TEACHER' as const, title: 'New Teacher', description: `${t.fullName} added`, timestamp: t.createdAt, status: 'Active' })),
      ...recentPayments.map((p) => ({ id: p.id, type: 'PAYMENT' as const, title: 'Payment', description: `${p.student.fullName} - ETB ${p.amount}`, timestamp: p.createdAt, status: p.status })),
      ...recentApplications.map((a) => ({ id: a.id, type: 'APPLICATION' as const, title: 'Application', description: `${a.fullName} applied`, timestamp: a.createdAt, status: a.status })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return { success: true, activities };
  } catch (error) {
    return { success: false, error: 'Failed to fetch recent activity' };
  }
}

export async function getChartData(year?: string): Promise<{
  success: boolean;
  chartData?: {
    courseEnrollment: ChartData[];
    paymentOverview: ChartData[];
    monthlyIncome: ChartData[];
  };
  error?: string;
}> {
  try {
    const selectedYear = year || new Date().getFullYear().toString();

    // Course enrollment
    const studentsByCourse = await prisma.student.groupBy({ by: ['courseType'], _count: { id: true } });
    const courseColors: Record<string, string> = {
      HIFZ: '#0F766E', TAJWEED: '#10B981', NAZIRAH: '#14B8A6', MURAJAAH: '#0D9488',
      AQIDAH: '#F59E0B', FIQH: '#F97316', HADITH: '#EF4444', ARABIC_LANGUAGE: '#8B5CF6', ISLAMIC_MANNERS: '#EC4899',
    };

    const courseEnrollment: ChartData[] = studentsByCourse.map((item) => ({
      label: item.courseType.replace(/_/g, ' '),
      value: item._count.id,
      color: courseColors[item.courseType] || '#6B7280',
    }));

    // Payment overview for current month
    const paymentsByStatus = await prisma.payment.groupBy({
      by: ['status'],
      _count: { id: true },
      where: { month: new Date().toISOString().slice(0, 7) },
    });

    const paymentColors: Record<string, string> = { PAID: '#10B981', UNPAID: '#6B7280', PARTIAL: '#F59E0B', OVERDUE: '#EF4444' };
    const paymentOverview: ChartData[] = paymentsByStatus.map((item) => ({
      label: item.status,
      value: item._count.id,
      color: paymentColors[item.status] || '#6B7280',
    }));

    // Monthly income for the selected year (12 months)
    const monthlyIncome: ChartData[] = [];
    for (let i = 1; i <= 12; i++) {
      const month = `${selectedYear}-${String(i).padStart(2, '0')}`;
      const payments = await prisma.payment.findMany({
        where: { month, status: 'PAID' },
        select: { amount: true },
      });
      const total = payments.reduce((sum: number, p) => sum + p.amount, 0);
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      monthlyIncome.push({ label: monthNames[i - 1], value: total, color: '#0F766E' });
    }

    return { success: true, chartData: { courseEnrollment, paymentOverview, monthlyIncome } };
  } catch (error) {
    return { success: false, error: 'Failed to fetch chart data' };
  }
}