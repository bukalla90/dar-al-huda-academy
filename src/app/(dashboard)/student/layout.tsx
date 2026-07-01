// src/app/(dashboard)/student/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';
import { StudentNav } from '@/components/student/student-nav';

export const metadata: Metadata = {
  title: {
    default: 'Student Dashboard - Dar Al Huda Online Quran Academy',
    template: '%s | Dar Al Huda Student Portal',
  },
  description: 'Student learning portal for Dar Al Huda Online Quran Academy. Access Quran lessons, view progress, join online classes, download learning materials, and track your memorization journey.',
  keywords: [
    'Quran student portal',
    'learn Quran online',
    'Quran memorization',
    'Tajweed learning',
    'Hifz program',
    'online Quran classes',
    'Dar Al Huda Academy',
    'Quran recitation practice',
    'Nazirah Quran reading',
    'Quran revision tools',
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
    title: 'Student Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Access your Quran lessons, track memorization progress, join live classes, and download learning materials from your student portal.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Student Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Learn Quran online with expert teachers. Track your progress and memorize with ease.',
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