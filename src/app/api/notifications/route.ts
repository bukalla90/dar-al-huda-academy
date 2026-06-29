// src/app/api/notifications/count/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false },
    });
    return NextResponse.json({ success: true, count });
  } catch {
    return NextResponse.json({ success: false, count: 0 });
  }
}