// src/app/(dashboard)/student/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { BookOpen } from 'lucide-react';
import Link from 'next/link';
import { LogoutButton } from '@/components/auth/logout-button';

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
      <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/student" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">Dar Al Huda</span>
            </Link>
            
            <nav className="flex items-center gap-4">
              <Link href="/student" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary">
                Dashboard
              </Link>
              <Link href="/student/settings" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary">
                Settings
              </Link>
              <Link href="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary">
                Home
              </Link>
              <LogoutButton />
            </nav>
          </div>
        </div>
      </header>
      
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-20 lg:pb-6">
        {children}
      </main>
      <Toaster />
    </div>
  );
}