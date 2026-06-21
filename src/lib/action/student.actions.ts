// src/lib/action/student.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { CreateStudentDTO, UpdateStudentDTO } from '@/lib/dto/student.dto';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import type { Student, User, Teacher, Payment, Prisma } from '@/generated/prisma/client';
import type { CourseType } from '@/types';

export interface StudentWithRelations {
  id: string;
  fullName: string;
  age: number;
  country: string;
  phone: string;
  courseType: CourseType;
  parentName: string;
  parentPhone: string;
  parentWhatsapp: string;
  relationship: string;
  createdAt: Date;
  userId: string;
  teacherId: string | null;
  user: {
    id: string;
    username: string;
    isActive: boolean;
  };
  teacher: {
    id: string;
    fullName: string;
  } | null;
  payments: {
    id: string;
    status: string;
    month: string;
    amount: number;
  }[];
  _count?: {
    sessions: number;
    progress: number;
  };
}

export interface PaginatedResponse {
  students: StudentWithRelations[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface TeacherOption {
  id: string;
  fullName: string;
  email: string;
}

type StudentWhereInput = Prisma.StudentWhereInput;

export async function createStudent(data: CreateStudentDTO): Promise<{ 
  success: boolean; 
  error?: string; 
  studentId?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validated = CreateStudentDTO.parse(data);
    
    const existingUser = await prisma.user.findUnique({
      where: { username: validated.username },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: 'Username already exists',
        fieldErrors: { username: 'This username is already taken' }
      };
    }
    
    const passwordHash: string = await hash(validated.password, 12);
    
    const student = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          username: validated.username,
          passwordHash,
          role: 'STUDENT',
        },
      });

      const student = await tx.student.create({
        data: {
          userId: user.id,
          fullName: validated.fullName,
          age: validated.age,
          country: validated.country,
          phone: validated.phone,
          courseType: validated.courseType as CourseType,
          teacherId: validated.teacherId || null,
          parentName: validated.parentName,
          parentPhone: validated.parentPhone,
          parentWhatsapp: validated.parentWhatsapp,
          relationship: validated.relationship,
        },
      });

      return student;
    });

    revalidatePath('/admin/students');
    return { success: true, studentId: student.id };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to create student' };
  }
}

export async function updateStudent(data: UpdateStudentDTO): Promise<{ 
  success: boolean; 
  error?: string;
  fieldErrors?: Record<string, string>;
}> {
  try {
    const validated = UpdateStudentDTO.parse(data);
    const { id, ...updateData } = validated;

    const updatePayload: Prisma.StudentUpdateInput = {
      ...(updateData.fullName && { fullName: updateData.fullName }),
      ...(updateData.age && { age: updateData.age }),
      ...(updateData.country && { country: updateData.country }),
      ...(updateData.phone && { phone: updateData.phone }),
      ...(updateData.courseType && { courseType: updateData.courseType as CourseType }),
      ...(updateData.teacherId !== undefined && { teacherId: updateData.teacherId || null }),
      ...(updateData.parentName && { parentName: updateData.parentName }),
      ...(updateData.parentPhone && { parentPhone: updateData.parentPhone }),
      ...(updateData.parentWhatsapp && { parentWhatsapp: updateData.parentWhatsapp }),
      ...(updateData.relationship && { relationship: updateData.relationship }),
    };

    await prisma.student.update({
      where: { id },
      data: updatePayload,
    });

    revalidatePath('/admin/students');
    revalidatePath(`/admin/students/${id}`);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Failed to update student' };
  }
}

export async function deleteStudent(studentId: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    await prisma.user.delete({
      where: { id: student.userId },
    });

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete student' };
  }
}

export async function deactivateStudent(studentId: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false },
    });

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to deactivate student' };
  }
}

export async function activateStudent(studentId: string): Promise<{ 
  success: boolean; 
  error?: string;
}> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      select: { userId: true },
    });

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: true },
    });

    revalidatePath('/admin/students');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to activate student' };
  }
}

export async function getStudentsPaginated(
  page: number = 1,
  pageSize: number = 10,
  filters?: {
    search?: string;
    courseType?: string;
    teacherId?: string;
    status?: 'active' | 'inactive';
  }
): Promise<{
  success: boolean;
  data?: PaginatedResponse;
  error?: string;
}> {
  try {
    const whereConditions: StudentWhereInput[] = [];
    
    if (filters?.search) {
      whereConditions.push({
        OR: [
          { fullName: { contains: filters.search, mode: 'insensitive' } },
          { phone: { contains: filters.search } },
          { 
            user: { 
              username: { contains: filters.search, mode: 'insensitive' } 
            } 
          },
        ],
      });
    }
    
    if (filters?.courseType) {
      whereConditions.push({
        courseType: filters.courseType as CourseType,
      });
    }
    
    if (filters?.teacherId) {
      whereConditions.push({
        teacherId: filters.teacherId,
      });
    }
    
    if (filters?.status) {
      whereConditions.push({
        user: {
          isActive: filters.status === 'active',
        },
      });
    }

    const where: StudentWhereInput = whereConditions.length > 0 
      ? { AND: whereConditions } 
      : {};

    const [students, totalCount] = await Promise.all([
      prisma.student.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: {
            select: {
              id: true,
              username: true,
              isActive: true,
            },
          },
          teacher: {
            select: {
              id: true,
              fullName: true,
            },
          },
          payments: {
            orderBy: { createdAt: 'desc' },
            take: 1,
            select: {
              id: true,
              status: true,
              month: true,
              amount: true,
            },
          },
          _count: {
            select: {
              sessions: true,
              progress: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }) as unknown as StudentWithRelations[],
      prisma.student.count({ where }),
    ]);

    return {
      success: true,
      data: {
        students,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false, error: 'Failed to fetch students' };
  }
}

export async function getStudentById(studentId: string): Promise<{
  success: boolean;
  student?: StudentWithRelations;
  error?: string;
}> {
  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            isActive: true,
          },
        },
        teacher: {
          select: {
            id: true,
            fullName: true,
          },
        },
        payments: {
          orderBy: { month: 'desc' },
          take: 12,
        },
        sessions: {
          orderBy: { scheduledAt: 'desc' },
          take: 10,
          include: {
            teacher: {
              select: {
                fullName: true,
              },
            },
          },
        },
        progress: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            teacher: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    }) as unknown as StudentWithRelations | null;

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    return { success: true, student };
  } catch (error) {
    console.error('Error fetching student:', error);
    return { success: false, error: 'Failed to fetch student' };
  }
}

export async function getAllTeachers(): Promise<{
  success: boolean;
  teachers?: TeacherOption[];
  error?: string;
}> {
  try {
    const teachers: TeacherOption[] = await prisma.teacher.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
      },
      orderBy: { fullName: 'asc' },
    });

    return { success: true, teachers };
  } catch (error) {
    return { success: false, error: 'Failed to fetch teachers' };
  }
}