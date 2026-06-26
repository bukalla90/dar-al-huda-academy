// src/app/(dashboard)/teacher/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { TeacherNav } from '@/components/teacher/teacher-nav';

export const metadata: Metadata = {
  title: 'Teacher Dashboard - Dar Al Huda',
  description: 'Teacher dashboard for Dar Al Huda Online Quran Academy',
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'TEACHER') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <TeacherNav />
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}