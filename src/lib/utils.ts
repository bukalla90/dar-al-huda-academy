// src/lib/utils.ts
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return 'N/A'
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

export function getInitials(name: string): string {
  if (!name) return '??'
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getRoleBadgeColor(role: 'ADMIN' | 'TEACHER' | 'STUDENT'): string {
  const colors = {
    ADMIN: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    TEACHER: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    STUDENT: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  }
  return colors[role]
}

export function getPaymentStatusColor(status: 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE'): string {
  const colors = {
    PAID: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    UNPAID: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    PARTIAL: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    OVERDUE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status]
}

export function getSessionStatusColor(status: string): string {
  const colors: Record<string, string> = {
    SCHEDULED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    LIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    COMPLETED: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    MISSED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

export function getTimeRemaining(targetDate: Date | string): string {
  const now = new Date()
  const target = new Date(targetDate)
  const diffMs = target.getTime() - now.getTime()
  
  if (diffMs < 0) return 'Past'
  
  const diffMinutes = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffDays > 0) return `${diffDays}d ${diffHours % 24}h`
  if (diffHours > 0) return `${diffHours}h ${diffMinutes % 60}m`
  if (diffMinutes > 0) return `${diffMinutes}m`
  return 'Less than 1m'
}

export function truncate(str: string, length: number): string {
  if (!str) return ''
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function formatCurrency(amount: number, currency: string = 'ETB'): string {
  return `${currency} ${amount.toLocaleString()}`
}