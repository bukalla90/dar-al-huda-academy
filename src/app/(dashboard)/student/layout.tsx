// src/app/(dashboard)/student/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { LogoutButton } from '@/components/auth/logout-button';
import { StudentNav } from '@/components/student/student-nav';

export const metadata: Metadata = {
  title: 'Student Dashboard - Dar Al Huda',
  description: 'Student dashboard for Dar Al Huda Online Quran Academy',
};

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'STUDENT') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      <StudentNav />
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20 lg:pb-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}