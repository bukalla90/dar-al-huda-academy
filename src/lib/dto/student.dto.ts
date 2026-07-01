// src/lib/dto/student.dto.ts
import { z } from 'zod';
import { type CourseType } from '@/types';

// Define course types array for reuse
const COURSE_TYPES = [
  'HIFZ', 
  'TAJWEED', 
  'NAZIRAH', 
  'MURAJAAH', 
  'AQIDAH', 
  'FIQH', 
  'HADITH', 
  'ARABIC_LANGUAGE', 
  'ISLAMIC_MANNERS'
] as const;

export const CreateStudentDTO = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  age: z.number().min(4, 'Age must be at least 4').max(100, 'Age must be at most 100'),
  country: z.string().min(2, 'Country must be at least 2 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  courseType: z.enum(COURSE_TYPES),
  scheduleTime: z.string().optional(), // ADDED: Schedule time field
  teacherId: z.string().optional(),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters'),
  parentPhone: z.string().min(10, 'Parent phone must be at least 10 characters'),
  parentWhatsapp: z.string().min(10, 'Parent WhatsApp must be at least 10 characters'),
  relationship: z.string().min(2, 'Relationship must be at least 2 characters'),
});

export const UpdateStudentDTO = z.object({
  id: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  age: z.number().min(4, 'Age must be at least 4').max(100, 'Age must be at most 100').optional(),
  country: z.string().min(2, 'Country must be at least 2 characters').optional(),
  phone: z.string().min(10, 'Phone must be at least 10 characters').optional(),
  courseType: z.enum(COURSE_TYPES).optional(),
  scheduleTime: z.string().optional(), // ADDED: Schedule time field
  teacherId: z.string().optional(),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters').optional(),
  parentPhone: z.string().min(10, 'Parent phone must be at least 10 characters').optional(),
  parentWhatsapp: z.string().min(10, 'Parent WhatsApp must be at least 10 characters').optional(),
  relationship: z.string().min(2, 'Relationship must be at least 2 characters').optional(),
});

// Export types
export type CreateStudentDTO = z.infer<typeof CreateStudentDTO>;
export type UpdateStudentDTO = z.infer<typeof UpdateStudentDTO>;