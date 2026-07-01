// src/app/(dashboard)/teacher/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { TeacherNav } from '@/components/teacher/teacher-nav';

export const metadata: Metadata = {
  title: {
    default: 'Teacher Dashboard - Dar Al Huda Online Quran Academy',
    template: '%s | Dar Al Huda Teacher Portal',
  },
  description: 'Teacher portal for Dar Al Huda Online Quran Academy. Manage students, track progress, schedule classes, and monitor Quran memorization and recitation performance.',
  keywords: [
    'Quran teacher dashboard',
    'online Quran teaching',
    'Islamic education',
    'Quran memorization tracker',
    'student progress management',
    'Dar Al Huda Academy',
    'online Quran academy',
    'Islamic studies teacher',
    'Quran recitation teaching',
  ],
  authors: [{ name: 'Dar Al Huda Academy' }],
  creator: 'Dar Al Huda Academy',
  publisher: 'Dar Al Huda Academy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://dar-al-huda-academy.vercel.app'),
  openGraph: {
    type: 'website',
    siteName: 'Dar Al Huda Academy',
    title: 'Teacher Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Manage your students, track Quran memorization progress, schedule classes, and monitor performance from your teacher dashboard.',
    locale: 'en_US',
    images: [
      {
        url: '/og-teacher.jpg',
        width: 1200,
        height: 630,
        alt: 'Dar Al Huda Teacher Portal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Teacher Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Manage your students and track Quran memorization progress.',
    images: ['/og-teacher.jpg'],
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  category: 'Education',
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