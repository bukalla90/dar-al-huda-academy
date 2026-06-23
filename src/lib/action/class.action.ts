// src/lib/action/class.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getTeacherSessions(teacherId: string): Promise<{
  success: boolean;
  sessions?: Array<{
    id: string;
    scheduledAt: Date;
    meetingUrl: string;
    status: string;
    student: {
      id: string;
      fullName: string;
    };
  }>;
  error?: string;
}> {
  try {
    const sessions = await prisma.classSession.findMany({
      where: { teacherId },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return { success: true, sessions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch sessions' };
  }
}

export async function getTeacherStudents(teacherId: string): Promise<{
  success: boolean;
  students?: Array<{
    id: string;
    fullName: string;
    courseType: string;
  }>;
  error?: string;
}> {
  try {
    const students = await prisma.student.findMany({
      where: { teacherId },
      select: {
        id: true,
        fullName: true,
        courseType: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return { success: true, students };
  } catch (error) {
    return { success: false, error: 'Failed to fetch students' };
  }
}

export async function createClassSession(data: {
  teacherId: string;
  studentId: string;
  date: string;
  time: string;
}): Promise<{ success: boolean; error?: string; meetingUrl?: string }> {
  try {
    const roomName = `dar-al-huda-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;
    
    const scheduledAt = new Date(`${data.date}T${data.time}:00`);

    await prisma.classSession.create({
      data: {
        teacherId: data.teacherId,
        studentId: data.studentId,
        scheduledAt,
        meetingUrl,
        status: 'SCHEDULED',
      },
    });

    revalidatePath('/teacher/schedule');
    return { success: true, meetingUrl };
  } catch (error) {
    return { success: false, error: 'Failed to create session' };
  }
}

export async function getClasses(): Promise<{
  success: boolean;
  sessions?: Array<{
    id: string;
    scheduledAt: Date;
    meetingUrl: string;
    status: string;
    teacher: { fullName: string };
    student: { fullName: string };
  }>;
  error?: string;
}> {
  try {
    const sessions = await prisma.classSession.findMany({
      include: {
        teacher: { select: { fullName: true } },
        student: { select: { fullName: true } },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    return { success: true, sessions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch classes' };
  }
}