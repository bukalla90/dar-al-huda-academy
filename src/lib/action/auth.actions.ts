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
    console.log('=================================');
    console.log('LOGIN ATTEMPT');
    console.log('Username:', data.username);
    console.log('Selected Role:', data.role);
    console.log('=================================');

    // Get client IP
    const clientIP = await getClientIP();

    // Check rate limit
    const rateLimitResult = await checkLoginRateLimit(
      data.username,
      clientIP
    );

    if (!rateLimitResult.success) {
      console.log('Rate limit failed:', rateLimitResult.error);

      return {
        success: false,
        error: rateLimitResult.error,
      };
    }

    const user = await prisma.user.findUnique({
      where: {
        username: data.username,
      },
      include: {
        teacher: {
          select: {
            id: true,
          },
        },
        student: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      console.log('User found: false');

      return {
        success: false,
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.`,
      };
    }

    console.log('User found: true');
    console.log('User ID:', user.id);
    console.log('Username:', user.username);
    console.log('Role:', user.role);
    console.log('Active:', user.isActive);
    console.log('Password Hash:', user.passwordHash);

    if (!user.isActive) {
      console.log('Account inactive');

      return {
        success: false,
        error: 'Account is deactivated. Contact admin.',
      };
    }

    const isValidPassword = await compare(
      data.password,
      user.passwordHash
    );

    console.log('Entered Password:', data.password);
    console.log('Password Valid:', isValidPassword);

    if (!isValidPassword) {
      console.log('Password comparison failed');

      return {
        success: false,
        error: `Invalid username or password. ${rateLimitResult.remaining} attempts remaining.`,
      };
    }

    console.log('Password comparison successful');

    if (user.role !== data.role) {
      console.log('Role mismatch');
      console.log('Database Role:', user.role);
      console.log('Selected Role:', data.role);

      return {
        success: false,
        error: `This account is not a ${data.role.toLowerCase()}. Please select the correct role.`,
      };
    }

    console.log('Role validation successful');
    console.log('Creating cookies...');

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

    if (user.role === 'ADMIN') {
      redirectUrl = '/admin';
    } else if (user.role === 'TEACHER') {
      redirectUrl = '/teacher';
    } else if (user.role === 'STUDENT') {
      redirectUrl = '/student';
    }

    console.log('Login successful');
    console.log('Redirect URL:', redirectUrl);

    return {
      success: true,
      redirectUrl,
    };
  } catch (error) {
    console.error('=================================');
    console.error('LOGIN ERROR');
    console.error(error);
    console.error('=================================');

    return {
      success: false,
      error: 'Login failed. Please try again.',
    };
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