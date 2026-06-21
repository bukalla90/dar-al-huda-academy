// src/lib/dto/auth.dto.ts
import { z } from 'zod';

export const LoginDTO = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const ChangePasswordDTO = z.object({
  currentPassword: z.string().min(6),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const ForgotPasswordDTO = z.object({
  email: z.string().email('Invalid email address'),
});

export const ResetPasswordDTO = z.object({
  token: z.string(),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type LoginDTO = z.infer<typeof LoginDTO>;
export type ChangePasswordDTO = z.infer<typeof ChangePasswordDTO>;
export type ForgotPasswordDTO = z.infer<typeof ForgotPasswordDTO>;
export type ResetPasswordDTO = z.infer<typeof ResetPasswordDTO>;