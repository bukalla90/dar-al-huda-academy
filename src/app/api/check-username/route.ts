// src/app/api/check-username/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username || username.length < 4) {
      return NextResponse.json({ available: false });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    return NextResponse.json({ available: false, error: 'Failed to check username' }, { status: 500 });
  }
}