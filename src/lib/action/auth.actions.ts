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
    // Get client IP
    const clientIP = await getClientIP();

    // Check rate limit for both username and IP
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
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.` 
      };
    }

    if (!user.isActive) {
      return { success: false, error: 'Account is deactivated. Contact admin.' };
    }

    const isValidPassword = await compare(data.password, user.passwordHash);
    if (!isValidPassword) {
      return { 
        success: false, 
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.` 
      };
    }

    if (user.role !== data.role) {
      return { success: false, error: `This account is not a ${data.role.toLowerCase()}. Please select the correct role.` };
    }

    // Successful login - set cookies
    const cookieStore = await cookies();
    
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    cookieStore.set('userRole', user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    
    if (user.teacher?.id) {
      cookieStore.set('teacherId', user.teacher.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }
    
    if (user.student?.id) {
      cookieStore.set('studentId', user.student.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
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
  'use server';
  
  const cookieStore = await cookies();
  cookieStore.delete('userId');
  cookieStore.delete('userRole');
  cookieStore.delete('teacherId');
  cookieStore.delete('studentId');
  
  redirect('/login');
}