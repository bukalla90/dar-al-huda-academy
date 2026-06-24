// src/lib/auth.ts
import { cookies } from 'next/headers';

export interface LoggedInUser {
  userId: string;
  userRole: string;
  teacherId?: string;
  studentId?: string;
}

export async function getLoggedInUser(): Promise<LoggedInUser | null> {
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

export function getDashboardUrl(role: string): string {
  switch (role) {
    case 'ADMIN': return '/admin';
    case 'TEACHER': return '/teacher';
    case 'STUDENT': return '/student';
    default: return '/login';
  }
}