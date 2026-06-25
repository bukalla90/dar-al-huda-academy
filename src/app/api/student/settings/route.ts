// src/app/api/student/settings/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hash, compare } from 'bcryptjs';
import { cookies } from 'next/headers';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get('userId')?.value;
    if (!userId) return NextResponse.json({ success: false, error: 'Not authenticated' }, { status: 401 });

    const body = await request.json();
    const { currentPassword, newPassword, newUsername } = body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });

    const isValid = await compare(currentPassword, user.passwordHash);
    if (!isValid) return NextResponse.json({ success: false, error: 'Current password is incorrect' }, { status: 400 });

    const newHash = await hash(newPassword, 12);
    await prisma.user.update({
      where: { id: userId },
      data: { 
        passwordHash: newHash,
        ...(newUsername && newUsername.length >= 4 ? { username: newUsername } : {}),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 });
  }
}