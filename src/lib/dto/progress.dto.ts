// src/lib/dto/progress.dto.ts
import { z } from 'zod';

export const CreateProgressDTO = z.object({
  studentId: z.string(),
  teacherId: z.string(),
  surah: z.string().min(1, 'Surah is required'),
  ayahFrom: z.number().positive('Ayah from must be positive'),
  ayahTo: z.number().positive('Ayah to must be positive'),
  notes: z.string(),
  score: z.number().min(1, 'Score must be at least 1').max(10, 'Score must be at most 10'),
}).refine(data => data.ayahTo >= data.ayahFrom, {
  message: 'End ayah must be greater than or equal to start ayah',
  path: ['ayahTo'],
});

export const UpdateProgressDTO = z.object({
  id: z.string(),
  surah: z.string().min(1, 'Surah is required').optional(),
  ayahFrom: z.number().positive('Ayah from must be positive').optional(),
  ayahTo: z.number().positive('Ayah to must be positive').optional(),
  notes: z.string().optional(),
  score: z.number().min(1, 'Score must be at least 1').max(10, 'Score must be at most 10').optional(),
}).refine(data => {
  // Only validate if both ayahFrom and ayahTo are provided
  if (data.ayahFrom !== undefined && data.ayahTo !== undefined) {
    return data.ayahTo >= data.ayahFrom;
  }
  return true;
}, {
  message: 'End ayah must be greater than or equal to start ayah',
  path: ['ayahTo'],
});

export type CreateProgressDTO = z.infer<typeof CreateProgressDTO>;
export type UpdateProgressDTO = z.infer<typeof UpdateProgressDTO>;