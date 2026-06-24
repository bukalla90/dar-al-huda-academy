// src/app/api/admin/payments/[paymentId]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
): Promise<NextResponse> {
  try {
    const { paymentId } = await params;
    const body = await request.json();
    
    await prisma.payment.update({
      where: { id: paymentId },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT payment error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update payment' }, { status: 500 });
  }
}