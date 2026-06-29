// src/lib/action/admin.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { unstable_cache } from 'next/cache';
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

// Helper function for stats
async function fetchDashboardStats(): Promise<{ success: boolean; stats?: DashboardStats; error?: string }> {
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
    console.error('fetchDashboardStats error:', error);
    return { success: false, error: 'Failed to fetch dashboard stats' };
  }
}

// Cached version
export const getDashboardStats = unstable_cache(
  fetchDashboardStats,
  ['admin-dashboard-stats'],
  { revalidate: 60, tags: ['admin-stats'] }
);

// Helper function for recent activity
async function fetchRecentActivity(): Promise<{ success: boolean; activities?: RecentActivity[]; error?: string }> {
  try {
    const [recentStudents, recentTeachers, recentPayments, recentApplications] = await Promise.all([
      prisma.student.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, createdAt: true } }),
      prisma.teacher.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, createdAt: true } }),
      prisma.payment.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, amount: true, status: true, createdAt: true, student: { select: { fullName: true } } } }),
      prisma.application.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, fullName: true, status: true, createdAt: true } }),
    ]);

    const activities: RecentActivity[] = [
      ...recentStudents.map((s) => ({
        id: s.id, type: 'STUDENT' as const, title: 'New Student Registered',
        description: `${s.fullName} joined the academy`, timestamp: s.createdAt, status: 'Active',
      })),
      ...recentTeachers.map((t) => ({
        id: t.id, type: 'TEACHER' as const, title: 'New Teacher Added',
        description: `${t.fullName} joined as teacher`, timestamp: t.createdAt, status: 'Active',
      })),
      ...recentPayments.map((p) => ({
        id: p.id, type: 'PAYMENT' as const, title: 'Payment Update',
        description: `${p.student.fullName} - ETB ${p.amount} - ${p.status}`, timestamp: p.createdAt, status: p.status,
      })),
      ...recentApplications.map((a) => ({
        id: a.id, type: 'APPLICATION' as const, title: 'New Application',
        description: `${a.fullName} applied for courses`, timestamp: a.createdAt, status: a.status,
      })),
    ]
    .filter((activity) => activity.timestamp instanceof Date && !isNaN(activity.timestamp.getTime()))
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 10);

    return { success: true, activities };
  } catch (error) {
    console.error('fetchRecentActivity error:', error);
    return { success: false, error: 'Failed to fetch recent activity' };
  }
}

// Cached version
export const getRecentActivity = unstable_cache(
  fetchRecentActivity,
  ['admin-recent-activity'],
  { revalidate: 30, tags: ['admin-activity'] }
);

// Helper function for chart data
async function fetchChartData(year?: string): Promise<{ success: boolean; chartData?: { courseEnrollment: ChartData[]; paymentOverview: ChartData[]; monthlyIncome: ChartData[] }; error?: string }> {
  try {
    const selectedYear = year || new Date().getFullYear().toString();

    const [studentsByCourse, paymentsByStatus] = await Promise.all([
      prisma.student.groupBy({ by: ['courseType'], _count: { id: true } }),
      prisma.payment.groupBy({ by: ['status'], _count: { id: true }, where: { month: new Date().toISOString().slice(0, 7) } }),
    ]);

    const courseColors: Record<string, string> = {
      HIFZ: '#0F766E', TAJWEED: '#10B981', NAZIRAH: '#14B8A6', MURAJAAH: '#0D9488',
      AQIDAH: '#F59E0B', FIQH: '#F97316', HADITH: '#EF4444', ARABIC_LANGUAGE: '#8B5CF6', ISLAMIC_MANNERS: '#EC4899',
    };

    const courseEnrollment: ChartData[] = studentsByCourse.map((item) => ({
      label: item.courseType.replace(/_/g, ' '),
      value: item._count.id,
      color: courseColors[item.courseType] || '#6B7280',
    }));

    const paymentColors: Record<string, string> = { PAID: '#10B981', UNPAID: '#6B7280', PARTIAL: '#F59E0B', OVERDUE: '#EF4444' };
    const paymentOverview: ChartData[] = paymentsByStatus.map((item) => ({
      label: item.status, value: item._count.id, color: paymentColors[item.status] || '#6B7280',
    }));

    // Monthly income for selected year
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyIncomePromises = Array.from({ length: 12 }, (_, i) => {
      const month = `${selectedYear}-${String(i + 1).padStart(2, '0')}`;
      return prisma.payment.findMany({ where: { month, status: 'PAID' }, select: { amount: true } });
    });

    const monthlyResults = await Promise.all(monthlyIncomePromises);
    const monthlyIncome: ChartData[] = monthlyResults.map((payments, i) => ({
      label: monthNames[i],
      value: payments.reduce((sum, p) => sum + p.amount, 0),
      color: '#0F766E',
    }));

    return { success: true, chartData: { courseEnrollment, paymentOverview, monthlyIncome } };
  } catch (error) {
    console.error('fetchChartData error:', error);
    return { success: false, error: 'Failed to fetch chart data' };
  }
}

// Cached version
export const getChartData = unstable_cache(
  fetchChartData,
  ['admin-chart-data'],
  { revalidate: 60, tags: ['admin-charts'] }
);