// src/lib/action/material.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function uploadMaterial(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const cookieStore = await cookies();
    const teacherId = cookieStore.get('teacherId')?.value;
    const userRole = cookieStore.get('userRole')?.value;

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const studentId = (formData.get('studentId') as string) || null;

    if (!file || !title) {
      return { success: false, error: 'File and title are required' };
    }

    // Determine file type
    let type: 'PDF' | 'AUDIO' | 'IMAGE' = 'PDF';
    if (file.type.startsWith('audio/')) type = 'AUDIO';
    else if (file.type.startsWith('image/')) type = 'IMAGE';

    // Save file locally
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = path.join(uploadsDir, fileName);
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${fileName}`;

    // If admin is uploading, find a default teacher or use the first teacher
    let finalTeacherId = teacherId;
    
    if (!finalTeacherId || userRole === 'ADMIN') {
      // Find any teacher to assign the material to
      const anyTeacher = await prisma.teacher.findFirst();
      if (anyTeacher) {
        finalTeacherId = anyTeacher.id;
      } else {
        return { success: false, error: 'No teacher found. Create a teacher first.' };
      }
    }

    // Save to database
    await prisma.material.create({
      data: {
        title,
        fileUrl,
        type,
        teacherId: finalTeacherId,
        studentId: studentId || null,
      },
    });

    revalidatePath('/admin/materials');
    return { success: true };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload material' };
  }
}

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