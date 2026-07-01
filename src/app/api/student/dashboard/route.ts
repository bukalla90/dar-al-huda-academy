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
              scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) }, // From today onwards
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

    // Get general materials that are either:
    // 1. Assigned to this student's course type
    // 2. Available for all courses (courseType: null)
    // AND not already assigned to this specific student
    const generalMaterials = await prisma.material.findMany({
      where: {
        studentId: null, // Not assigned to a specific student
        OR: [
          { courseType: student.courseType }, // Materials for student's course
          { courseType: null }, // Materials for all courses
        ],
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        type: true,
        courseType: true,
        createdAt: true,
        teacher: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });

    // Also get student-specific materials with course info
    const studentMaterials = await prisma.material.findMany({
      where: {
        studentId: studentId,
        OR: [
          { courseType: student.courseType }, // Materials for student's course
          { courseType: null }, // Materials for all courses
        ],
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        type: true,
        courseType: true,
        createdAt: true,
        teacher: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Transform sessions data for the frontend
    const transformedStudent = {
      id: student.id,
      fullName: student.fullName,
      courseType: student.courseType,
      age: student.age,
      country: student.country,
      phone: student.phone,
      scheduleTime: student.scheduleTime,
      user: student.user,
      teacher: student.teacher,
      progress: student.progress,
      sessions: student.sessionStudents.map(ss => ({
        id: ss.session.id,
        scheduledAt: ss.session.scheduledAt.toISOString(),
        meetingUrl: ss.session.meetingUrl,
        status: ss.session.status,
      })),
      payments: student.payments,
      materials: studentMaterials.map(m => ({
        id: m.id,
        title: m.title,
        fileUrl: m.fileUrl,
        type: m.type,
        courseType: m.courseType,
      })),
    };

    // Transform general materials
    const transformedGeneralMaterials = generalMaterials.map(m => ({
      id: m.id,
      title: m.title,
      fileUrl: m.fileUrl,
      type: m.type,
      courseType: m.courseType,
    }));

    return NextResponse.json({ 
      success: true, 
      student: transformedStudent, 
      generalMaterials: transformedGeneralMaterials 
    });
  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}