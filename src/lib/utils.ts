// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export function getRoleBadgeColor(role: 'ADMIN' | 'TEACHER' | 'STUDENT'): string {
  const colors = {
    ADMIN: 'bg-red-100 text-red-800',
    TEACHER: 'bg-blue-100 text-blue-800',
    STUDENT: 'bg-green-100 text-green-800',
  }
  return colors[role]
}

export function getPaymentStatusColor(status: 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE'): string {
  const colors = {
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-gray-100 text-gray-800',
    PARTIAL: 'bg-yellow-100 text-yellow-800',
    OVERDUE: 'bg-red-100 text-red-800',
  }
  return colors[status]
}