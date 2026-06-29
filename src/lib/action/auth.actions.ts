// src/lib/action/auth.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { compare } from 'bcryptjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { checkLoginRateLimit, getClientIP } from '@/lib/rate-limit';

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
    const clientIP = await getClientIP();

    // Check rate limit
    const rateLimitResult = await checkLoginRateLimit(data.username, clientIP);
    if (!rateLimitResult.success) {
      return { success: false, error: rateLimitResult.error };
    }

    const user = await prisma.user.findUnique({
      where: { username: data.username },
      include: {
        teacher: { select: { id: true } },
        student: { select: { id: true } },
      },
    });

    if (!user) {
      return {
        success: false,
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.`,
      };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated. Contact admin.' };
    }

    const isValidPassword = await compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      return {
        success: false,
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.`,
      };
    }

    if (user.role !== data.role) {
      const roleLabels: Record<string, string> = {
        ADMIN: 'Admin',
        TEACHER: 'Ustaz',
        STUDENT: 'Student',
      };
      return {
        success: false,
        error: `This account is a ${roleLabels[user.role] || user.role}. Please select the correct role.`,
      };
    }

    const cookieStore = await cookies();
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    };

    // Set auth cookies
    cookieStore.set('userId', user.id, cookieOptions);
    cookieStore.set('userRole', user.role, cookieOptions);

    if (user.teacher?.id) {
      cookieStore.set('teacherId', user.teacher.id, cookieOptions);
    }

    if (user.student?.id) {
      cookieStore.set('studentId', user.student.id, cookieOptions);
    }

    let redirectUrl = '/';
    if (user.role === 'ADMIN') redirectUrl = '/admin';
    else if (user.role === 'TEACHER') redirectUrl = '/teacher';
    else if (user.role === 'STUDENT') redirectUrl = '/student';

    return { success: true, redirectUrl };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Login failed. Please try again.' };
  }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.delete('userId');
  cookieStore.delete('userRole');
  cookieStore.delete('teacherId');
  cookieStore.delete('studentId');

  redirect('/login');
}

// Refresh session - extends cookie expiry
export async function refreshSession(): Promise<boolean> {
  try {
    const user = await getLoggedInUserFromCookies();
    if (!user) return false;

    const cookieStore = await cookies();
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    };

    cookieStore.set('userId', user.userId, cookieOptions);
    cookieStore.set('userRole', user.userRole, cookieOptions);
    if (user.teacherId) cookieStore.set('teacherId', user.teacherId, cookieOptions);
    if (user.studentId) cookieStore.set('studentId', user.studentId, cookieOptions);

    return true;
  } catch {
    return false;
  }
}

// Validate session - checks if user still exists and is active
export async function validateSession(): Promise<boolean> {
  try {
    const user = await getLoggedInUserFromCookies();
    if (!user) return false;

    const dbUser = await prisma.user.findUnique({
      where: { id: user.userId },
      select: { isActive: true },
    });

    return !!dbUser?.isActive;
  } catch {
    return false;
  }
}

// Internal helper - not exported
async function getLoggedInUserFromCookies(): Promise<{
  userId: string;
  userRole: string;
  teacherId?: string;
  studentId?: string;
} | null> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    const userRole = cookieStore.get('userRole')?.value;
    const teacherId = cookieStore.get('teacherId')?.value;
    const studentId = cookieStore.get('studentId')?.value;

    if (!userId || !userRole) return null;
    return { userId, userRole, teacherId, studentId };
  } catch {
    return null;
  }
}