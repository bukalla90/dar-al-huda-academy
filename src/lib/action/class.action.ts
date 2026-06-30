// src/lib/action/class.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

interface SessionWithStudents {
  id: string;
  scheduledAt: Date;
  meetingUrl: string;
  status: string;
  sessionStudents: Array<{
    student: { id: string; fullName: string };
    joinedAt: Date | null;
  }>;
}

interface StudentOption {
  id: string;
  fullName: string;
  courseType: string;
}

async function getTeacherId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('teacherId')?.value || null;
}

async function autoUpdateSessions(teacherId: string): Promise<void> {
  const now = new Date();
  
  await prisma.classSession.updateMany({
    where: {
      teacherId,
      status: 'SCHEDULED',
      scheduledAt: { lt: now },
    },
    data: { status: 'MISSED' },
  });
}

export async function getTeacherSessions(): Promise<{
  success: boolean;
  sessions?: SessionWithStudents[];
  error?: string;
}> {
  try {
    const teacherId = await getTeacherId();
    if (!teacherId) return { success: false, error: 'Not authenticated' };

    await autoUpdateSessions(teacherId);

    const sessions = await prisma.classSession.findMany({
      where: { teacherId },
      include: {
        sessionStudents: {
          include: {
            student: { select: { id: true, fullName: true } },
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    return { success: true, sessions };
  } catch (error) {
    console.error('getTeacherSessions error:', error);
    return { success: false, error: 'Failed to fetch sessions' };
  }
}

export async function getTeacherStudents(): Promise<{
  success: boolean;
  students?: StudentOption[];
  error?: string;
}> {
  try {
    const teacherId = await getTeacherId();
    if (!teacherId) return { success: false, error: 'Not authenticated' };

    const students = await prisma.student.findMany({
      where: { teacherId, user: { isActive: true } },
      select: { id: true, fullName: true, courseType: true },
      orderBy: { fullName: 'asc' },
    });

    return { success: true, students };
  } catch (error) {
    return { success: false, error: 'Failed to fetch students' };
  }
}

export async function createClassSession(data: {
  studentIds: string[];
  date: string;
  time: string;
  meetingUrl: string;
}): Promise<{ success: boolean; error?: string; meetingUrl?: string }> {
  try {
    const teacherId = await getTeacherId();
    if (!teacherId) return { success: false, error: 'Not authenticated' };

    if (!data.studentIds || data.studentIds.length === 0) {
      return { success: false, error: 'Please select at least one student' };
    }

    if (!data.date || !data.time) {
      return { success: false, error: 'Date and time are required' };
    }

    if (!data.meetingUrl || !data.meetingUrl.includes('zoom.us')) {
      return { success: false, error: 'Please provide a valid Zoom meeting link' };
    }

    // FIX: Create date properly - interpret as UTC+3 (Ethiopia time)
    // The form sends date as "2024-01-15" and time as "09:15"
    // We need to create a date that represents 9:15 AM in Ethiopia (UTC+3)
    const [hours, minutes] = data.time.split(':').map(Number);
    
    // Create date in UTC by subtracting 3 hours from Ethiopia time
    // Ethiopia 9:15 AM = UTC 6:15 AM
    const scheduledAt = new Date(`${data.date}T00:00:00.000Z`);
    scheduledAt.setUTCHours(hours - 3, minutes, 0, 0);

    if (scheduledAt <= new Date()) {
      return { success: false, error: 'Please select a future date and time' };
    }

    const students = await prisma.student.findMany({
      where: { id: { in: data.studentIds }, teacherId },
      select: { id: true },
    });

    if (students.length !== data.studentIds.length) {
      return { success: false, error: 'Some students are not assigned to you' };
    }

    await prisma.classSession.create({
      data: {
        teacherId,
        scheduledAt,
        meetingUrl: data.meetingUrl,
        status: 'SCHEDULED',
        sessionStudents: {
          create: data.studentIds.map((studentId) => ({ studentId })),
        },
      },
    });

    revalidatePath('/teacher/schedule');
    return { success: true, meetingUrl: data.meetingUrl };
  } catch (error) {
    console.error('createClassSession error:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function updateClassSession(data: {
  sessionId: string;
  date: string;
  time: string;
  meetingUrl: string;
  studentIds: string[];
}): Promise<{ success: boolean; error?: string }> {
  try {
    const teacherId = await getTeacherId();
    if (!teacherId) return { success: false, error: 'Not authenticated' };

    if (!data.studentIds || data.studentIds.length === 0) {
      return { success: false, error: 'Please select at least one student' };
    }

    // Same UTC-3 fix for Ethiopia time
    const [hours, minutes] = data.time.split(':').map(Number);
    const scheduledAt = new Date(`${data.date}T00:00:00.000Z`);
    scheduledAt.setUTCHours(hours - 3, minutes, 0, 0);

    await prisma.$transaction([
      prisma.sessionStudent.deleteMany({ where: { sessionId: data.sessionId } }),
      prisma.classSession.update({
        where: { id: data.sessionId },
        data: {
          scheduledAt,
          meetingUrl: data.meetingUrl,
          sessionStudents: {
            create: data.studentIds.map((studentId) => ({ studentId })),
          },
        },
      }),
    ]);

    revalidatePath('/teacher/schedule');
    return { success: true };
  } catch (error) {
    console.error('updateClassSession error:', error);
    return { success: false, error: 'Failed to update session' };
  }
}

export async function deleteClassSession(sessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.classSession.delete({ where: { id: sessionId } });
    revalidatePath('/teacher/schedule');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete session' };
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
    sessionStudents: Array<{
      student: { fullName: string };
      joinedAt: Date | null;
    }>;
  }>;
  error?: string;
}> {
  try {
    const sessions = await prisma.classSession.findMany({
      include: {
        teacher: { select: { fullName: true } },
        sessionStudents: {
          include: { student: { select: { fullName: true } } },
        },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    return { success: true, sessions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch classes' };
  }
}

export async function getClassSessionById(sessionId: string): Promise<{
  success: boolean;
  session?: {
    id: string;
    scheduledAt: Date;
    meetingUrl: string;
    status: string;
    teacher: { fullName: string };
    sessionStudents: Array<{
      student: { id: string; fullName: string };
      joinedAt: Date | null;
    }>;
  } | null;
  error?: string;
}> {
  try {
    const session = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        teacher: { select: { fullName: true } },
        sessionStudents: {
          include: { student: { select: { id: true, fullName: true } } },
        },
      },
    });

    if (!session) return { success: false, error: 'Session not found' };
    return { success: true, session };
  } catch (error) {
    return { success: false, error: 'Failed to fetch session' };
  }
}

export async function getUpcomingSessionsForStudent(studentId: string): Promise<{
  success: boolean;
  sessions?: Array<{
    id: string;
    scheduledAt: Date;
    meetingUrl: string;
    status: string;
  }>;
  error?: string;
}> {
  try {
    const sessions = await prisma.classSession.findMany({
      where: {
        sessionStudents: { some: { studentId } },
        scheduledAt: { gte: new Date() },
        status: { in: ['SCHEDULED', 'LIVE'] },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    });

    return { success: true, sessions };
  } catch (error) {
    return { success: false, error: 'Failed to fetch sessions' };
  }
}