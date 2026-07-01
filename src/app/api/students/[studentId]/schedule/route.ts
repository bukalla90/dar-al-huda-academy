// src/app/api/students/[studentId]/schedule/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
): Promise<NextResponse> {
  try {
    const { studentId } = await params;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { scheduleTime: true },
    });

    return NextResponse.json({
      success: true,
      scheduleTime: student?.scheduleTime || null,
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch schedule' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const teacherId = cookieStore.get('teacherId')?.value;
    
    if (!teacherId) {
      return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });
    }

    const { studentId } = await params;
    const body = await request.json();
    const { scheduleTime } = body;

    if (!scheduleTime) {
      return NextResponse.json({ success: false, error: 'Schedule time is required' }, { status: 400 });
    }

    // Verify this student belongs to the teacher
    const student = await prisma.student.findFirst({
      where: { id: studentId, teacherId },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found or not assigned to you' }, { status: 404 });
    }

    await prisma.student.update({
      where: { id: studentId },
      data: { scheduleTime },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update schedule' }, { status: 500 });
  }
}