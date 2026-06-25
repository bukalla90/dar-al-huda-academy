// src/app/api/student/dashboard/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const studentId = cookieStore.get('studentId')?.value;

    if (!studentId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { id: true, username: true, isActive: true } },
        teacher: { select: { id: true, fullName: true, phone: true, email: true } },
        progress: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { teacher: { select: { fullName: true } } },
        },
        sessionStudents: {
          include: {
            session: {
              select: {
                id: true,
                scheduledAt: true,
                meetingUrl: true,
                status: true,
              },
            },
          },
          where: {
            session: {
              scheduledAt: { gte: new Date() },
              status: { in: ['SCHEDULED', 'LIVE'] },
            },
          },
          orderBy: { session: { scheduledAt: 'asc' } },
          take: 10,
        },
        payments: {
          orderBy: { month: 'desc' },
          take: 5,
        },
        materials: {
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const generalMaterials = await prisma.material.findMany({
      where: { studentId: null },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Transform sessions data for the frontend
    const transformedStudent = {
      ...student,
      sessions: student.sessionStudents.map(ss => ({
        id: ss.session.id,
        scheduledAt: ss.session.scheduledAt,
        meetingUrl: ss.session.meetingUrl,
        status: ss.session.status,
      })),
      sessionStudents: undefined,
    };

    return NextResponse.json({ success: true, student: transformedStudent, generalMaterials });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}