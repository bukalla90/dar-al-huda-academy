// src/lib/action/material.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getMaterials(): Promise<{
  success: boolean;
  materials?: Array<{
    id: string;
    title: string;
    fileUrl: string;
    type: string;
    createdAt: Date;
    teacher: { fullName: string };
    student: { fullName: string } | null;
  }>;
  error?: string;
}> {
  try {
    const materials = await prisma.material.findMany({
      include: {
        teacher: { select: { fullName: true } },
        student: { select: { fullName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { success: true, materials };
  } catch (error) {
    return { success: false, error: 'Failed to fetch materials' };
  }
}