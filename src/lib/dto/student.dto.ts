// src/lib/dto/student.dto.ts
import { z } from 'zod';
import { type CourseType } from '@/types';

export const CreateStudentDTO = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
  fullName: z.string().min(2),
  age: z.number().min(4).max(100),
  country: z.string().min(2),
  phone: z.string().min(10),
  courseType: z.enum(['HIFZ', 'TAJWEED', 'NAZIRAH', 'MURAJAAH', 'AQIDAH', 'FIQH', 'HADITH', 'ARABIC_LANGUAGE', 'ISLAMIC_MANNERS']),
  teacherId: z.string().optional(),
  parentName: z.string().min(2),
  parentPhone: z.string().min(10),
  parentWhatsapp: z.string().min(10),
  relationship: z.string().min(2),
});

export const UpdateStudentDTO = z.object({
  id: z.string(),
  fullName: z.string().min(2).optional(),
  age: z.number().min(4).max(100).optional(),
  country: z.string().min(2).optional(),
  phone: z.string().min(10).optional(),
  courseType: z.enum(['HIFZ', 'TAJWEED', 'NAZIRAH', 'MURAJAAH', 'AQIDAH', 'FIQH', 'HADITH', 'ARABIC_LANGUAGE', 'ISLAMIC_MANNERS']).optional(),
  teacherId: z.string().optional(),
  parentName: z.string().min(2).optional(),
  parentPhone: z.string().min(10).optional(),
  parentWhatsapp: z.string().min(10).optional(),
  relationship: z.string().min(2).optional(),
});

export type CreateStudentDTO = z.infer<typeof CreateStudentDTO>;
export type UpdateStudentDTO = z.infer<typeof UpdateStudentDTO>;