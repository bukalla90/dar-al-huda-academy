// src/lib/action/application.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getApplications(): Promise<{
  success: boolean;
  applications?: Array<{
    id: string;
    fullName: string;
    age: number;
    country: string;
    phone: string;
    email: string;
    desiredCourse: string;
    status: string;
    createdAt: Date;
  }>;
  error?: string;
}> {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, applications };
  } catch (error) {
    return { success: false, error: 'Failed to fetch applications' };
  }
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as 'PENDING' | 'ACCEPTED' | 'REJECTED' },
    });

    revalidatePath('/admin/applications');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update application' };
  }
}