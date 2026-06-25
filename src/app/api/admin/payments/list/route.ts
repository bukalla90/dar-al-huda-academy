// src/app/api/admin/payments/list/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month') || String(new Date().getMonth() + 1).padStart(2, '0');
    const year = searchParams.get('year') || String(new Date().getFullYear());
    const page = Number(searchParams.get('page')) || 1;
    const pageSize = 10;
    const paymentMonth = `${year}-${month}`;

    const [students, totalCount, allStudents] = await Promise.all([
      prisma.student.findMany({
        include: {
          payments: {
            where: { month: paymentMonth },
            take: 1,
          },
        },
        orderBy: { fullName: 'asc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.student.count(),
      prisma.student.findMany({
        include: {
          payments: {
            where: { month: paymentMonth },
            take: 1,
          },
        },
      }),
    ]);

    const paidCount = allStudents.filter(s => s.payments[0]?.status === 'PAID').length;
    const unpaidCount = allStudents.filter(s => !s.payments[0] || s.payments[0]?.status !== 'PAID').length;

    return NextResponse.json({
      success: true,
      students,
      totalCount,
      totalPages: Math.ceil(totalCount / pageSize),
      paidCount,
      unpaidCount,
    });
  } catch (error) {
    console.error('Payments list error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch payments' }, { status: 500 });
  }
}