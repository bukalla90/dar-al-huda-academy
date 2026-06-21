// src/app/(dashboard)/student/layout.tsx
import type { Metadata } from 'next';

import { Toaster } from '@/components/ui/toaster';
import { StudentHeader } from '@/components/forms/student/student-header';
import { MobileNav } from '@/components/forms/student/mobile-nav';

export const metadata: Metadata = {
  title: 'Student Dashboard - Dar Al Huda',
  description: 'Student dashboard for Dar Al Huda Online Quran Academy',
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <MobileNav />
      <main className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {children}
      </main>
      <Toaster />
    </div>
  );
}