// src/app/api/admin/students/[studentId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
): Promise<NextResponse> {
  try {
    const { studentId } = await params;
    
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: { select: { isActive: true, username: true } },
        teacher: { select: { id: true, fullName: true } },
        progress: {
          orderBy: { createdAt: 'desc' },
          include: { teacher: { select: { fullName: true } } },
        },
        payments: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!student) {
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error) {
    console.error('GET student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch student' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ studentId: string }> }
): Promise<NextResponse> {
  try {
    const { studentId } = await params;
    const body = await request.json();
    
    await prisma.student.update({
      where: { id: studentId },
      data: {
        teacherId: body.teacherId || null,
        courseType: body.courseType,
      },
    });

    if (body.isActive !== undefined) {
      const student = await prisma.student.findUnique({
        where: { id: studentId },
        select: { userId: true },
      });
      
      if (student) {
        await prisma.user.update({
          where: { id: student.userId },
          data: { isActive: body.isActive },
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT student error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 500 });
  }
}