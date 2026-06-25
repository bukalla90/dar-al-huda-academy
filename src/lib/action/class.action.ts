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

// Auto-update session statuses
async function autoUpdateSessions(teacherId: string): Promise<void> {
  const now = new Date();
  
  // Mark passed sessions as MISSED
  await prisma.classSession.updateMany({
    where: {
      teacherId,
      status: 'SCHEDULED',
      scheduledAt: { lt: now },
    },
    data: { status: 'MISSED' },
  });

  // Mark sessions with attendance as COMPLETED
  const missedSessions = await prisma.classSession.findMany({
    where: { teacherId, status: 'MISSED' },
    select: { id: true },
  });

  for (const session of missedSessions) {
    const hasAttendance = await prisma.sessionStudent.findFirst({
      where: { sessionId: session.id, joinedAt: { not: null } },
    });
    if (hasAttendance) {
      await prisma.classSession.update({
        where: { id: session.id },
        data: { status: 'COMPLETED' },
      });
    }
  }
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

    const scheduledAt = new Date(`${data.date}T${data.time}:00`);
    if (scheduledAt <= new Date()) {
      return { success: false, error: 'Please select a future date and time' };
    }

    // Verify all students belong to this teacher
    const students = await prisma.student.findMany({
      where: { id: { in: data.studentIds }, teacherId },
      select: { id: true },
    });

    if (students.length !== data.studentIds.length) {
      return { success: false, error: 'Some students are not assigned to you' };
    }

    const roomName = `dar-al-huda-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;

    await prisma.classSession.create({
      data: {
        teacherId,
        scheduledAt,
        meetingUrl,
        status: 'SCHEDULED',
        sessionStudents: {
          create: data.studentIds.map((studentId) => ({ studentId })),
        },
      },
    });

    revalidatePath('/teacher/schedule');
    return { success: true, meetingUrl };
  } catch (error) {
    console.error('createClassSession error:', error);
    return { success: false, error: 'Failed to create session' };
  }
}

export async function markAttendance(sessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const studentId = cookieStore.get('studentId')?.value;
    if (!studentId) return { success: false, error: 'Not authenticated' };

    await prisma.sessionStudent.updateMany({
      where: { sessionId, studentId, joinedAt: null },
      data: { joinedAt: new Date() },
    });

    await prisma.classSession.updateMany({
      where: { id: sessionId, status: 'SCHEDULED' },
      data: { status: 'LIVE' },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to mark attendance' };
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