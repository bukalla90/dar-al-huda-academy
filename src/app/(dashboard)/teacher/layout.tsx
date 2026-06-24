// src/app/(dashboard)/teacher/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { BookOpen, Home } from 'lucide-react';
import Link from 'next/link';
import { LogoutIconButton } from '@/components/auth/logout-button';
import { HomeButton } from '@/components/ui/home-button';

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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/teacher" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Dar Al Huda</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <HomeButton />
              <Link href="/teacher" className="text-sm font-medium text-gray-600 hover:text-primary">Dashboard</Link>
              <Link href="/teacher/students" className="text-sm font-medium text-gray-600 hover:text-primary">Students</Link>
              <Link href="/teacher/schedule" className="text-sm font-medium text-gray-600 hover:text-primary">Schedule</Link>
              <LogoutIconButton />
            </nav>
          </div>
        </div>
      </header>
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}