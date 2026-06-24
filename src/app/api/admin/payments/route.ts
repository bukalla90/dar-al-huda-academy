// src/app/api/admin/payments/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json();
    
    await prisma.payment.create({
      data: {
        studentId: body.studentId,
        amount: body.amount,
        month: body.month,
        status: body.status,
        currency: 'USD',
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('POST payment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create payment' }, { status: 500 });
  }
}