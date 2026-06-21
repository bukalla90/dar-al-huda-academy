// src/lib/actions/admin.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import type { Student, Teacher, Payment, Application } from '@/generated/prisma/client';

interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  activeStudents: number;
  paidStudents: number;
  unpaidStudents: number;
  upcomingClasses: number;
  pendingApplications: number;
  monthlyRevenue: number;
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
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.student.count({
        where: { user: { isActive: true } },
      }),
      prisma.payment.count({
        where: { 
          status: 'PAID',
          month: currentMonth,
        },
      }),
      prisma.payment.count({
        where: { 
          status: 'UNPAID',
          month: currentMonth,
        },
      }),
      prisma.classSession.count({
        where: {
          scheduledAt: { gte: new Date() },
          status: 'SCHEDULED',
        },
      }),
      prisma.application.count({
        where: { status: 'PENDING' },
      }),
      prisma.payment.findMany({
        where: {
          status: 'PAID',
          month: currentMonth,
        },
        select: { amount: true },
      }),
    ]);

    const monthlyRevenue = paymentsThisMonth.reduce(
      (sum: number, payment: Pick<Payment, 'amount'>) => sum + payment.amount, 
      0
    );

    const stats: DashboardStats = {
      totalStudents,
      totalTeachers,
      activeStudents,
      paidStudents,
      unpaidStudents,
      upcomingClasses,
      pendingApplications,
      monthlyRevenue,
      totalCourses: 9, // From our course list
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
      prisma.student.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          createdAt: true,
        },
      }),
      prisma.teacher.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          createdAt: true,
        },
      }),
      prisma.payment.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          amount: true,
          status: true,
          createdAt: true,
          student: {
            select: { fullName: true },
          },
        },
      }),
      prisma.application.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          fullName: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    const activities: RecentActivity[] = [
      ...recentStudents.map((student: { id: string; fullName: string; createdAt: Date }) => ({
        id: student.id,
        type: 'STUDENT' as const,
        title: 'New Student Registered',
        description: `${student.fullName} joined the academy`,
        timestamp: student.createdAt,
        status: 'Active',
      })),
      ...recentTeachers.map((teacher: { id: string; fullName: string; createdAt: Date }) => ({
        id: teacher.id,
        type: 'TEACHER' as const,
        title: 'New Teacher Added',
        description: `${teacher.fullName} joined as teacher`,
        timestamp: teacher.createdAt,
        status: 'Active',
      })),
      ...recentPayments.map((payment: { 
        id: string; 
        amount: number; 
        status: string; 
        createdAt: Date;
        student: { fullName: string } 
      }) => ({
        id: payment.id,
        type: 'PAYMENT' as const,
        title: 'Payment Update',
        description: `${payment.student.fullName} - $${payment.amount} - ${payment.status}`,
        timestamp: payment.createdAt,
        status: payment.status,
      })),
      ...recentApplications.map((app: { 
        id: string; 
        fullName: string; 
        status: string; 
        createdAt: Date 
      }) => ({
        id: app.id,
        type: 'APPLICATION' as const,
        title: 'New Application',
        description: `${app.fullName} applied for courses`,
        timestamp: app.createdAt,
        status: app.status,
      })),
    ]
      .sort((a: RecentActivity, b: RecentActivity) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    return { success: true, activities };
  } catch (error) {
    return { success: false, error: 'Failed to fetch recent activity' };
  }
}

export async function getChartData(): Promise<{
  success: boolean;
  chartData?: {
    studentDistribution: ChartData[];
    paymentOverview: ChartData[];
    courseEnrollment: ChartData[];
  };
  error?: string;
}> {
  try {
    const [studentsByCourse, paymentsByStatus] = await Promise.all([
      prisma.student.groupBy({
        by: ['courseType'],
        _count: { id: true },
      }),
      prisma.payment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
          month: new Date().toISOString().slice(0, 7),
        },
      }),
    ]);

    const courseColors: Record<string, string> = {
      HIFZ: '#0F766E',
      TAJWEED: '#10B981',
      NAZIRAH: '#14B8A6',
      MURAJAAH: '#0D9488',
      AQIDAH: '#F59E0B',
      FIQH: '#F97316',
      HADITH: '#EF4444',
      ARABIC_LANGUAGE: '#8B5CF6',
      ISLAMIC_MANNERS: '#EC4899',
    };

    const studentDistribution: ChartData[] = studentsByCourse.map((item) => ({
      label: item.courseType.replace(/_/g, ' '),
      value: item._count.id,
      color: courseColors[item.courseType] || '#6B7280',
    }));

    const paymentOverview: ChartData[] = paymentsByStatus.map((item) => {
      const colorMap: Record<string, string> = {
        PAID: '#10B981',
        UNPAID: '#6B7280',
        PARTIAL: '#F59E0B',
        OVERDUE: '#EF4444',
      };
      return {
        label: item.status,
        value: item._count.id,
        color: colorMap[item.status] || '#6B7280',
      };
    });

    return {
      success: true,
      chartData: {
        studentDistribution,
        paymentOverview,
        courseEnrollment: studentDistribution, // Same data, different context
      },
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch chart data' };
  }
}