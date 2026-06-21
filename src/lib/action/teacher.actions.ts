// src/lib/actions/teacher.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { CreateTeacherDTO, UpdateTeacherDTO } from '@/lib/dto/teacher.dto';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import type { Teacher, User, Student } from '@/generated/prisma/client';

interface TeacherWithRelations {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string | null;
  user: Pick<User, 'id' | 'username' | 'isActive'>;
  students: Pick<Student, 'id'>[];
}

export async function createTeacher(data: CreateTeacherDTO): Promise<{ success: boolean; error?: string; teacherId?: string }> {
  try {
    const validated = CreateTeacherDTO.parse(data);
    
    const passwordHash: string = await hash(validated.password, 12);
    
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
          bio: validated.bio,
        },
      });

      return teacher;
    });

    revalidatePath('/admin/teachers');
    return { success: true, teacherId: teacher.id };
  } catch (error) {
    return { success: false, error: 'Failed to create teacher' };
  }
}

export async function getTeachers(): Promise<{ success: boolean; teachers?: TeacherWithRelations[]; error?: string }> {
  try {
    const teachers: TeacherWithRelations[] = await prisma.teacher.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            isActive: true,
          },
        },
        students: {
          select: {
            id: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, teachers };
  } catch (error) {
    return { success: false, error: 'Failed to fetch teachers' };
  }
}