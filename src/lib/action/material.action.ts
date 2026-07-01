'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Prisma } from '@/generated/prisma/client';

type CourseType = 'HIFZ' | 'TAJWEED' | 'NAZIRAH' | 'MURAJAAH' | 'AQIDAH' | 'FIQH' | 'HADITH' | 'ARABIC_LANGUAGE' | 'ISLAMIC_MANNERS';

const VALID_COURSE_TYPES: CourseType[] = [
  'HIFZ', 'TAJWEED', 'NAZIRAH', 'MURAJAAH', 
  'AQIDAH', 'FIQH', 'HADITH', 'ARABIC_LANGUAGE', 'ISLAMIC_MANNERS'
];

function isValidCourseType(value: string): value is CourseType {
  return VALID_COURSE_TYPES.includes(value as CourseType);
}

export async function uploadMaterial(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  url?: string;
}> {
  try {
    const cookieStore = await cookies();
    const teacherId = cookieStore.get('teacherId')?.value;
    const userRole = cookieStore.get('userRole')?.value;
    const userId = cookieStore.get('userId')?.value;

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const studentId = (formData.get('studentId') as string) || null;
    const courseTypeRaw = formData.get('courseType') as string | null;
    
    const courseType: CourseType | null = courseTypeRaw && isValidCourseType(courseTypeRaw) 
      ? courseTypeRaw 
      : null;

    if (!file || !title) {
      return { success: false, error: 'File and title are required' };
    }

    let type: 'PDF' | 'AUDIO' | 'IMAGE' = 'PDF';
    if (file.type.startsWith('audio/')) type = 'AUDIO';
    else if (file.type.startsWith('image/')) type = 'IMAGE';

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', dataURI);
    cloudinaryFormData.append('upload_preset', 'dar-al-huda-unsigned');
    cloudinaryFormData.append('folder', 'dar-al-huda-materials');

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    let uploadUrl: string;
    if (type === 'PDF') {
      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`;
    } else if (type === 'AUDIO') {
      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`;
    } else {
      uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    }
    
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: cloudinaryFormData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      return { success: false, error: 'Upload failed. Please try again.' };
    }

    const data = await response.json();

    // Determine who is uploading
    let uploadedBy = 'Admin';
    if (userRole === 'TEACHER') {
      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
        select: { fullName: true },
      });
      uploadedBy = teacher?.fullName || 'Teacher';
    } else if (userRole === 'ADMIN' && userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { username: true },
      });
      uploadedBy = user?.username || 'Admin';
    }

    await prisma.material.create({
      data: {
        title,
        fileUrl: data.secure_url,
        type,
        courseType: courseType,
        uploadedBy: uploadedBy,
        studentId: studentId || null,
      },
    });

    revalidatePath('/admin/materials');
    revalidatePath('/student');
    return { success: true, url: data.secure_url };
  } catch (error) {
    console.error('Upload error:', error);
    return { success: false, error: 'Failed to upload file. Please try again.' };
  }
}

type MaterialWithRelations = {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  courseType: CourseType | null;
  uploadedBy: string;
  createdAt: Date;
  student: { fullName: string } | null;
};

export async function getMaterials(courseType?: string): Promise<{
  success: boolean;
  materials?: MaterialWithRelations[];
  error?: string;
}> {
  try {
    const whereClause: Record<string, unknown> = {};
    
    if (courseType && isValidCourseType(courseType)) {
      whereClause.OR = [
        { courseType: courseType },
        { courseType: null }
      ];
    }

    const materials = await prisma.material.findMany({
      where: whereClause as Prisma.MaterialWhereInput,
      select: {
        id: true,
        title: true,
        fileUrl: true,
        type: true,
        courseType: true,
        uploadedBy: true,
        createdAt: true,
        student: {
          select: {
            fullName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return { 
      success: true, 
      materials: materials.map(material => ({
        id: material.id,
        title: material.title,
        fileUrl: material.fileUrl,
        type: material.type as string,
        courseType: material.courseType as CourseType | null,
        uploadedBy: material.uploadedBy,
        createdAt: material.createdAt,
        student: material.student ? { fullName: material.student.fullName } : null,
      }))
    };
  } catch (error) {
    return { success: false, error: 'Failed to fetch materials' };
  }
}

export async function deleteMaterial(materialId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.material.delete({
      where: { id: materialId },
    });

    revalidatePath('/admin/materials');
    revalidatePath('/student');
    return { success: true };
  } catch (error) {
    console.error('Delete error:', error);
    return { success: false, error: 'Failed to delete material' };
  }
}