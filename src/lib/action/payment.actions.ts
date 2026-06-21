// src/lib/actions/payment.actions.ts
'use server';

import { prisma } from '@/lib/prisma';
import { CreatePaymentDTO, UpdatePaymentStatusDTO } from '@/lib/dto/payment.dto';
import { revalidatePath } from 'next/cache';
import { Payment } from '@/generated/prisma/client';


interface PaymentWithStudent {
  id: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE';
  notes: string | null;
  student: {
    id: string;
    fullName: string;
  };
}

interface PaymentSummary {
  total: number;
  paid: number;
  unpaid: number;
  partial: number;
  overdue: number;
  totalAmount: number;
  collectedAmount: number;
}

interface StudentPayment {
  id: string;
  amount: number;
  currency: string;
  month: string;
  status: 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE';
  notes: string | null;
  createdAt: Date;
}

export async function createPayment(data: CreatePaymentDTO): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = CreatePaymentDTO.parse(data);

    await prisma.payment.create({
      data: {
        studentId: validated.studentId,
        amount: validated.amount,
        currency: validated.currency,
        month: validated.month,
        status: validated.status,
        notes: validated.notes,
      },
    });

    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to create payment record' };
  }
}

export async function updatePaymentStatus(data: UpdatePaymentStatusDTO): Promise<{ success: boolean; error?: string }> {
  try {
    const validated = UpdatePaymentStatusDTO.parse(data);

    await prisma.payment.update({
      where: { id: validated.id },
      data: {
        status: validated.status,
        notes: validated.notes,
      },
    });

    revalidatePath('/admin/payments');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update payment status' };
  }
}

export async function getStudentPayments(studentId: string): Promise<{ 
  success: boolean; 
  payments?: StudentPayment[];
  error?: string;
}> {
  try {
    const payments: StudentPayment[] = await prisma.payment.findMany({
      where: { studentId },
      orderBy: { month: 'desc' },
      select: {
        id: true,
        amount: true,
        currency: true,
        month: true,
        status: true,
        notes: true,
        createdAt: true,
      },
    });

    return { success: true, payments };
  } catch (error) {
    return { success: false, error: 'Failed to fetch payments' };
  }
}

export async function getPaymentsByMonth(month: string): Promise<{
  success: boolean;
  payments?: PaymentWithStudent[];
  error?: string;
}> {
  try {
    const payments: PaymentWithStudent[] = await prisma.payment.findMany({
      where: { month },
      include: {
        student: {
          select: {
            id: true,
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, payments };
  } catch (error) {
    return { success: false, error: 'Failed to fetch payments' };
  }
}

export async function getPaymentSummary(): Promise<{
  success: boolean;
  summary?: PaymentSummary;
  error?: string;
}> {
  try {
    const payments: Pick<Payment, 'status' | 'amount'>[] = await prisma.payment.findMany({
      where: {
        month: new Date().toISOString().slice(0, 7), // Current month
      },
      select: {
        status: true,
        amount: true,
      },
    });

    const summary: PaymentSummary = {
      total: payments.length,
      paid: payments.filter((p: Pick<Payment, 'status' | 'amount'>) => p.status === 'PAID').length,
      unpaid: payments.filter((p: Pick<Payment, 'status' | 'amount'>) => p.status === 'UNPAID').length,
      partial: payments.filter((p: Pick<Payment, 'status' | 'amount'>) => p.status === 'PARTIAL').length,
      overdue: payments.filter((p: Pick<Payment, 'status' | 'amount'>) => p.status === 'OVERDUE').length,
      totalAmount: payments.reduce((sum: number, p: Pick<Payment, 'status' | 'amount'>) => sum + p.amount, 0),
      collectedAmount: payments
        .filter((p: Pick<Payment, 'status' | 'amount'>) => p.status === 'PAID')
        .reduce((sum: number, p: Pick<Payment, 'status' | 'amount'>) => sum + p.amount, 0),
    };

    return { success: true, summary };
  } catch (error) {
    return { success: false, error: 'Failed to fetch payment summary' };
  }
}