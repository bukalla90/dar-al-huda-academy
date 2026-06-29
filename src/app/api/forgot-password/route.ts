// src/app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const { username } = await request.json();

    if (!username || username.length < 3) {
      return NextResponse.json({ success: false, error: 'Please enter a valid username' }, { status: 400 });
    }

    // Find user and their profile
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        teacher: { select: { fullName: true } },
        student: { select: { fullName: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'Username not found. Please check and try again.' }, { status: 404 });
    }

    // Get full name
    const fullName = user.teacher?.fullName || user.student?.fullName || username;
    const role = user.role === 'TEACHER' ? 'Ustaz' : user.role === 'STUDENT' ? 'Student' : 'Admin';

    // Create notification with full name
    await prisma.notification.create({
      data: {
        type: 'PASSWORD_RESET',
        title: `Password Reset: ${fullName} (${role})`,
        message: `${fullName} (${role}) has requested a password reset. Their username is "${username}". Generate a new password from Settings and share it via phone or WhatsApp.`,
        username: username,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ success: false, error: 'Something went wrong' }, { status: 500 });
  }
}