// src/types/index.ts
export type UserRole = 'ADMIN' | 'TEACHER' | 'STUDENT';




export type CourseType = 
  | 'HIFZ' 
  | 'TAJWEED' 
  | 'NAZIRAH' 
  | 'MURAJAAH' 
  | 'AQIDAH' 
  | 'FIQH' 
  | 'HADITH' 
  | 'ARABIC_LANGUAGE' 
  | 'ISLAMIC_MANNERS';

export type PaymentStatus = 'PAID' | 'UNPAID' | 'PARTIAL' | 'OVERDUE';

export type AttendanceStatus = 'PRESENT' | 'ABSENT';

export type ApplicationStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

// Course data structure for display
export interface CourseData {
  id: CourseType;
  titleEn: string;
  titleAm: string;
  descriptionEn: string;
  descriptionAm: string;
  icon: string; // Lucide icon name
  category: 'QURAN' | 'ISLAMIC_STUDIES';
}

export interface User {
  id: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Teacher {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  bio: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Student {
  id: string;
  userId: string;
  teacherId: string | null;
  fullName: string;
  age: number;
  country: string;
  phone: string;
  courseType: CourseType;
  parentName: string;
  parentPhone: string;
  parentWhatsapp: string;
  relationship: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Application {
  id: string;
  fullName: string;
  age: number;
  country: string;
  phone: string;
  email: string;
  desiredCourse: CourseType;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClassSession {
  id: string;
  teacherId: string;
  studentId: string;
  meetingUrl: string;
  scheduledAt: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Attendance {
  id: string;
  studentId: string;
  sessionId: string;
  status: AttendanceStatus;
  createdAt: Date;
}

export interface Material {
  id: string;
  title: string;
  fileUrl: string;
  teacherId: string;
  studentId: string | null;
  type: 'PDF' | 'AUDIO' | 'IMAGE';
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProgress {
  id: string;
  studentId: string;
  teacherId: string;
  surah: string;
  ayahFrom: number;
  ayahTo: number;
  notes: string;
  score: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  currency: string; // Default: "USD" or "ETB"
  month: string; // Format: "2024-01"
  status: PaymentStatus;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}