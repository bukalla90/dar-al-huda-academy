// src/app/api/admin/teachers/list/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    const teachers = await prisma.teacher.findMany({
      select: { id: true, fullName: true, email: true },
      orderBy: { fullName: 'asc' },
    });

    return NextResponse.json({ success: true, teachers });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch teachers' }, { status: 500 });
  }
}