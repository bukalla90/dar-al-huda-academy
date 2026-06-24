// src/lib/action/class.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

interface SessionWithStudent {
  id: string;
  scheduledAt: Date;
  meetingUrl: string;
  status: string;
  student: {
    id: string;
    fullName: string;
  };
}

interface StudentOption {
  id: string;
  fullName: string;
  courseType: string;
}

interface SessionWithBoth {
  id: string;
  scheduledAt: Date;
  meetingUrl: string;
  status: string;
  teacher: { fullName: string };
  student: { fullName: string };
}

export async function getTeacherSessions(teacherId: string): Promise<{
  success: boolean;
  sessions?: SessionWithStudent[];
  error?: string;
}> {
  try {
    const sessions: SessionWithStudent[] = await prisma.classSession.findMany({
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
    console.error('getTeacherSessions error:', error);
    return { success: false, error: 'Failed to fetch sessions' };
  }
}

export async function getTeacherStudents(teacherId: string): Promise<{
  success: boolean;
  students?: StudentOption[];
  error?: string;
}> {
  try {
    const students: StudentOption[] = await prisma.student.findMany({
      where: { 
        teacherId,
        user: { isActive: true },
      },
      select: {
        id: true,
        fullName: true,
        courseType: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return { success: true, students };
  } catch (error) {
    console.error('getTeacherStudents error:', error);
    return { success: false, error: 'Failed to fetch students' };
  }
}

export async function createClassSession(data: {
  teacherId: string;
  studentId: string;
  date: string;
  time: string;
}): Promise<{ 
  success: boolean; 
  error?: string; 
  meetingUrl?: string;
}> {
  try {
    // Validate inputs
    if (!data.teacherId || !data.studentId || !data.date || !data.time) {
      return { success: false, error: 'All fields are required' };
    }

    // Check if student belongs to this teacher
    const student = await prisma.student.findFirst({
      where: {
        id: data.studentId,
        teacherId: data.teacherId,
      },
    });

    if (!student) {
      return { success: false, error: 'Student not found or not assigned to you' };
    }

    // Generate unique room name
    const roomName = `dar-al-huda-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    const meetingUrl = `https://meet.jit.si/${roomName}`;
    
    const scheduledAt = new Date(`${data.date}T${data.time}:00`);

    // Check if time is in the future
    if (scheduledAt <= new Date()) {
      return { success: false, error: 'Please select a future date and time' };
    }

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
    console.error('createClassSession error:', error);
    return { success: false, error: 'Failed to create session. Please try again.' };
  }
}

export async function getClasses(): Promise<{
  success: boolean;
  sessions?: SessionWithBoth[];
  error?: string;
}> {
  try {
    const sessions: SessionWithBoth[] = await prisma.classSession.findMany({
      include: {
        teacher: { select: { fullName: true } },
        student: { select: { fullName: true } },
      },
      orderBy: { scheduledAt: 'desc' },
      take: 50,
    });

    return { success: true, sessions };
  } catch (error) {
    console.error('getClasses error:', error);
    return { success: false, error: 'Failed to fetch classes' };
  }
}

export async function deleteClassSession(sessionId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.classSession.delete({
      where: { id: sessionId },
    });

    revalidatePath('/teacher/schedule');
    return { success: true };
  } catch (error) {
    console.error('deleteClassSession error:', error);
    return { success: false, error: 'Failed to delete session' };
  }
}

export async function getClassSessionById(sessionId: string): Promise<{
  success: boolean;
  session?: SessionWithBoth | null;
  error?: string;
}> {
  try {
    const session = await prisma.classSession.findUnique({
      where: { id: sessionId },
      include: {
        teacher: { select: { fullName: true } },
        student: { select: { fullName: true } },
      },
    });

    if (!session) {
      return { success: false, error: 'Session not found' };
    }

    return { success: true, session };
  } catch (error) {
    console.error('getClassSessionById error:', error);
    return { success: false, error: 'Failed to fetch session' };
  }
}

export async function getUpcomingSessionsForStudent(studentId: string): Promise<{
  success: boolean;
  sessions?: SessionWithStudent[];
  error?: string;
}> {
  try {
    const sessions: SessionWithStudent[] = await prisma.classSession.findMany({
      where: {
        studentId,
        scheduledAt: { gte: new Date() },
        status: 'SCHEDULED',
      },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { scheduledAt: 'asc' },
      take: 10,
    });

    return { success: true, sessions };
  } catch (error) {
    console.error('getUpcomingSessionsForStudent error:', error);
    return { success: false, error: 'Failed to fetch sessions' };
  }
}