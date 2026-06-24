// src/lib/action/progress.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

interface CreateProgressData {
  studentId: string;
  teacherId: string;
  surah: string;
  ayahFrom: number;
  ayahTo: number;
  score: number;
  notes: string;
  type: string;
}

export async function createProgress(data: CreateProgressData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.studentProgress.create({
      data: {
        studentId: data.studentId,
        teacherId: data.teacherId,
        surah: data.surah,
        ayahFrom: data.ayahFrom,
        ayahTo: data.ayahTo,
        score: data.score,
        notes: data.notes,
      },
    });

    revalidatePath(`/teacher/students/${data.studentId}`);
    return { success: true };
  } catch (error) {
    console.error('Create progress error:', error);
    return { success: false, error: 'Failed to save progress' };
  }
}

export async function getStudentProgress(studentId: string): Promise<{
  success: boolean;
  progress?: Array<{
    id: string;
    surah: string;
    ayahFrom: number;
    ayahTo: number;
    score: number;
    notes: string;
    createdAt: Date;
    teacher: { fullName: string };
  }>;
  error?: string;
}> {
  try {
    const progress = await prisma.studentProgress.findMany({
      where: { studentId },
      include: {
        teacher: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, progress };
  } catch (error) {
    return { success: false, error: 'Failed to fetch progress' };
  }
}

export async function getStudentCurrentStatus(studentId: string): Promise<{
  success: boolean;
  status?: {
    currentSurah: string;
    currentJuz: string;
    averageScore: number;
    totalRecords: number;
    lastUpdated: Date | null;
  };
  error?: string;
}> {
  try {
    const progress = await prisma.studentProgress.findMany({
      where: { studentId },
      orderBy: { createdAt: 'desc' },
    });

    const currentSurah = progress[0]?.surah || 'Not started';
    const averageScore = progress.length > 0
      ? Math.round(progress.reduce((sum, p) => sum + p.score, 0) / progress.length)
      : 0;

    return {
      success: true,
      status: {
        currentSurah,
        currentJuz: 'Juz 1',
        averageScore,
        totalRecords: progress.length,
        lastUpdated: progress[0]?.createdAt || null,
      },
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch status' };
  }
}