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
              scheduledAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
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
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    // Get ALL materials for this student (course-filtered)
    const allMaterials = await prisma.material.findMany({
      where: {
        OR: [
          // Materials assigned specifically to this student
          {
            studentId: studentId,
            OR: [
              { courseType: student.courseType },
              { courseType: null },
            ],
          },
          // General materials (not assigned to any specific student)
          {
            studentId: null,
            OR: [
              { courseType: student.courseType },
              { courseType: null },
            ],
          },
        ],
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
        type: true,
        courseType: true,
        uploadedBy: true,
        createdAt: true,
        student: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 15,
    });

    // Separate into student-specific and general materials
    const studentMaterials = allMaterials.filter(m => m.student !== null);
    const generalMaterials = allMaterials.filter(m => m.student === null);

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
        uploadedBy: m.uploadedBy,
      })),
    };

    // Transform general materials
    const transformedGeneralMaterials = generalMaterials.map(m => ({
      id: m.id,
      title: m.title,
      fileUrl: m.fileUrl,
      type: m.type,
      courseType: m.courseType,
      uploadedBy: m.uploadedBy,
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