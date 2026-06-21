// src/lib/action/class.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

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

export async function createClassSession(data: {
  teacherId: string;
  studentId: string;
  scheduledAt: Date;
  meetingUrl: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.classSession.create({
      data: {
        teacherId: data.teacherId,
        studentId: data.studentId,
        scheduledAt: data.scheduledAt,
        meetingUrl: data.meetingUrl,
        status: 'SCHEDULED',
      },
    });

    revalidatePath('/teacher/schedule');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create session' };
  }
}