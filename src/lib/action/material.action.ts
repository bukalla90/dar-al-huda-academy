'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { Prisma } from '@/generated/prisma/client';

// Define the CourseType enum locally to avoid import issues
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

    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const studentId = (formData.get('studentId') as string) || null;
    const courseTypeRaw = formData.get('courseType') as string | null;
    
    // Validate and cast courseType
    const courseType: CourseType | null = courseTypeRaw && isValidCourseType(courseTypeRaw) 
      ? courseTypeRaw 
      : null;

    if (!file || !title) {
      return { success: false, error: 'File and title are required' };
    }

    let type: 'PDF' | 'AUDIO' | 'IMAGE' = 'PDF';
    if (file.type.startsWith('audio/')) type = 'AUDIO';
    else if (file.type.startsWith('image/')) type = 'IMAGE';

    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', 'dar-al-huda-unsigned');
    cloudinaryFormData.append('folder', 'dar-al-huda-materials');

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary error:', errorData);
      return { success: false, error: 'Upload failed. Please try again.' };
    }

    const data = await response.json();

    let finalTeacherId = teacherId;
    if (!finalTeacherId || userRole === 'ADMIN') {
      const anyTeacher = await prisma.teacher.findFirst();
      if (anyTeacher) {
        finalTeacherId = anyTeacher.id;
      } else {
        return { success: false, error: 'No teacher found. Create a teacher first.' };
      }
    }

    await prisma.material.create({
      data: {
        title,
        fileUrl: data.secure_url,
        type,
        courseType: courseType, // Now properly typed as CourseType | null
        teacherId: finalTeacherId,
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

// Define proper type for material with relations
type MaterialWithRelations = {
  id: string;
  title: string;
  fileUrl: string;
  type: string;
  courseType: CourseType | null;
  createdAt: Date;
  teacher: { fullName: string };
  student: { fullName: string } | null;
};

export async function getMaterials(courseType?: string): Promise<{
  success: boolean;
  materials?: MaterialWithRelations[];
  error?: string;
}> {
  try {
    // Build where clause without any type
    const whereClause: Record<string, unknown> = {};
    
    // If courseType is provided and valid, get materials for that course OR all courses (null)
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
        createdAt: true,
        teacher: {
          select: {
            fullName: true,
          },
        },
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
        ...material,
        type: material.type as string,
        courseType: material.courseType as CourseType | null,
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