// src/lib/dto/teacher.dto.ts
import { z } from 'zod';

export const CreateTeacherDTO = z.object({
  username: z.string().min(4, 'Username must be at least 4 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(7, 'Phone number must be at least 7 digits'),
  salary: z.number().min(0, 'Salary must be a positive number').optional(),
  bio: z.string().optional(),
});

export const UpdateTeacherDTO = z.object({
  id: z.string(),
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(7, 'Phone number must be at least 7 digits').optional(),
  salary: z.number().min(0, 'Salary must be a positive number').optional(),
  bio: z.string().optional(),
});

export type CreateTeacherDTO = z.infer<typeof CreateTeacherDTO>;
export type UpdateTeacherDTO = z.infer<typeof UpdateTeacherDTO>;