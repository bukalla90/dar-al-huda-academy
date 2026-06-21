// src/lib/actions/auth.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { LoginDTO, ChangePasswordDTO } from '@/lib/dto/auth.dto';
import { hash, compare } from 'bcryptjs';
import { revalidatePath } from 'next/cache';
import { Student, Teacher } from '@/generated/prisma/client';


interface AuthenticatedUser {
  id: string;
  username: string;
  role: 'ADMIN' | 'TEACHER' | 'STUDENT';
  isActive: boolean;
  teacher: Pick<Teacher, 'id' | 'fullName'> | null;
  student: Pick<Student, 'id' | 'fullName'> | null;
}

export async function loginUser(data: LoginDTO): Promise<{ success: boolean; error?: string; user?: AuthenticatedUser }> {
  try {
    const validated = LoginDTO.parse(data);
    
    const user = await prisma.user.findUnique({
      where: { username: validated.username },
      include: {
        teacher: {
          select: {
            id: true,
            fullName: true,
          },
        },
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
    });

    if (!user || !user.isActive) {
      return { success: false, error: 'Invalid credentials' };
    }

    const isValidPassword: boolean = await compare(validated.password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid credentials' };
    }

    const authenticatedUser: AuthenticatedUser = {
      id: user.id,
      username: user.username,
      role: user.role,
      isActive: user.isActive,
      teacher: user.teacher,
      student: user.student,
    };

    return { success: true, user: authenticatedUser };
  } catch (error) {
    return { success: false, error: 'Login failed' };
  }
}

export async function changePassword(
  userId: string, 
  data: ChangePasswordDTO
): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = ChangePasswordDTO.parse(data);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const isValidCurrent: boolean = await compare(validated.currentPassword, user.passwordHash);
    if (!isValidCurrent) {
      return { success: false, error: 'Current password is incorrect' };
    }

    const newHash: string = await hash(validated.newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });

    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Password change failed' };
  }
}