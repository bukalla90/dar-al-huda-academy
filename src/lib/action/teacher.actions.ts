// src/lib/action/teacher.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { CreateTeacherDTO } from '@/lib/dto/teacher.dto';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

export async function createTeacher(data: CreateTeacherDTO): Promise<{ 
  success: boolean; 
  error?: string; 
  teacherId?: string;
}> {
  try {
    const validated = CreateTeacherDTO.parse(data);

    const existingUser = await prisma.user.findUnique({
      where: { username: validated.username },
    });

    if (existingUser) {
      return { success: false, error: `Username "${validated.username}" is already taken.` };
    }

    const existingEmail = await prisma.teacher.findUnique({
      where: { email: validated.email },
    });

    if (existingEmail) {
      return { success: false, error: `Email "${validated.email}" is already registered.` };
    }
    
    const passwordHash = await hash(validated.password, 12);
    
    const teacher = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: validated.username,
          passwordHash,
          role: 'TEACHER',
        },
      });

      const teacher = await tx.teacher.create({
        data: {
          userId: user.id,
          fullName: validated.fullName,
          email: validated.email,
          phone: validated.phone,
          salary: validated.salary || null,
          bio: validated.bio || null,
        },
      });

      return teacher;
    });

    revalidatePath('/admin/teachers');
    return { success: true, teacherId: teacher.id };
  } catch (error) {
    console.error('Create teacher error:', error);
    return { success: false, error: 'Failed to create teacher.' };
  }
}

export async function getTeachers(): Promise<{ 
  success: boolean; 
  teachers?: Array<{
    id: string;
    fullName: string;
    email: string;
    phone: string;
    salary: number | null;
    bio: string | null;
    user: {
      id: string;
      username: string;
      isActive: boolean;
    };
    students: Array<{ id: string }>;
  }>;
  error?: string;
}> {
  try {
    const teachers = await prisma.teacher.findMany({
      include: {
        user: { select: { id: true, username: true, isActive: true } },
        students: { select: { id: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, teachers };
  } catch (error) {
    return { success: false, error: 'Failed to fetch teachers' };
  }
}

export async function deleteTeacher(teacherId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacherId },
      select: { userId: true },
    });

    if (!teacher) {
      return { success: false, error: 'Teacher not found' };
    }

    // Delete all related records first to avoid foreign key constraints
    // NOTE: Material no longer has teacherId, so we skip that
    await prisma.$transaction([
      prisma.classSession.deleteMany({ where: { teacherId } }),
      prisma.studentProgress.deleteMany({ where: { teacherId } }),
      // Materials are NOT deleted - they stay with uploadedBy field
      prisma.student.updateMany({ where: { teacherId }, data: { teacherId: null } }),
    ]);

    // Now delete the user (cascades to teacher)
    await prisma.user.delete({
      where: { id: teacher.userId },
    });

    revalidatePath('/admin/teachers');
    revalidatePath('/admin/materials');
    return { success: true };
  } catch (error) {
    console.error('Delete teacher error:', error);
    return { success: false, error: 'Failed to delete teacher' };
  }
}