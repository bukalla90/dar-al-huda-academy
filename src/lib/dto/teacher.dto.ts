// src/lib/dto/teacher.dto.ts
import { z } from 'zod';

export const CreateTeacherDTO = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  bio: z.string().optional(),
});

export const UpdateTeacherDTO = z.object({
  id: z.string(),
  fullName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  bio: z.string().optional(),
});

export type CreateTeacherDTO = z.infer<typeof CreateTeacherDTO>;
export type UpdateTeacherDTO = z.infer<typeof UpdateTeacherDTO>;