// src/lib/dto/payment.dto.ts
import { z } from 'zod';

export const CreatePaymentDTO = z.object({
  studentId: z.string(),
  amount: z.number().positive('Amount must be positive'),
  currency: z.string().default('USD'),
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in format YYYY-MM'),
  status: z.enum(['PAID', 'UNPAID', 'PARTIAL', 'OVERDUE']).default('UNPAID'),
  notes: z.string().optional(),
});

export const UpdatePaymentStatusDTO = z.object({
  id: z.string(),
  status: z.enum(['PAID', 'UNPAID', 'PARTIAL', 'OVERDUE']),
  notes: z.string().optional(),
});

export type CreatePaymentDTO = z.infer<typeof CreatePaymentDTO>;
export type UpdatePaymentStatusDTO = z.infer<typeof UpdatePaymentStatusDTO>;