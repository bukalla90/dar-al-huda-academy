// src/lib/dto/progress.dto.ts
import { z } from 'zod';

export const CreateProgressDTO = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  surah: z.string(),
  ayahFrom: z.number().positive(),
  ayahTo: z.number().positive(),
  notes: z.string(),
  score: z.number().min(1).max(10),
});

export const UpdateProgressDTO = z.object({
  id: z.string(),
  surah: z.string().optional(),
  ayahFrom: z.number().positive().optional(),
  ayahTo: z.number().positive().optional(),
  notes: z.string().optional(),
  score: z.number().min(1).max(10).optional(),
});

export type CreateProgressDTO = z.infer<typeof CreateProgressDTO>;
export type UpdateProgressDTO = z.infer<typeof UpdateProgressDTO>;