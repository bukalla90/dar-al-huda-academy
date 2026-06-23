// src/lib/action/auth.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';

interface LoginData {
  username: string;
  password: string;
  role: string;
}

export async function loginUser(data: LoginData): Promise<{
  success: boolean;
  error?: string;
  redirectUrl?: string;
}> {
  try {
    // Find user by username
    const user = await prisma.user.findUnique({
      where: { username: data.username },
      include: {
        teacher: true,
        student: true,
      },
    });

    if (!user) {
      return { success: false, error: 'Invalid username or password' };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated. Contact admin.' };
    }

    // Check password
    const isValidPassword = await compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid username or password' };
    }

    // Check role matches
    if (user.role !== data.role) {
      return { success: false, error: `This account is not a ${data.role.toLowerCase()}. Please select the correct role.` };
    }

    // Check teacher/student record exists
    if (user.role === 'TEACHER' && !user.teacher) {
      return { success: false, error: 'Teacher profile not found. Contact admin.' };
    }

    if (user.role === 'STUDENT' && !user.student) {
      return { success: false, error: 'Student profile not found. Contact admin.' };
    }

    // Redirect based on role
    let redirectUrl = '/';
    if (user.role === 'ADMIN') {
      redirectUrl = '/admin';
    } else if (user.role === 'TEACHER') {
      redirectUrl = '/teacher';
    } else if (user.role === 'STUDENT') {
      redirectUrl = '/student';
    }

    return { success: true, redirectUrl };
  } catch (error) {
    return { success: false, error: 'Login failed. Please try again.' };
  }
}