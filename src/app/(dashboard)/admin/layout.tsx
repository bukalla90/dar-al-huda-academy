// src/app/(dashboard)/admin/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { MobileNav } from '@/components/admin/mobile-nav';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: {
    default: 'Admin Dashboard - Dar Al Huda Online Quran Academy',
    template: '%s | Dar Al Huda Admin Panel',
  },
  description: 'Administration panel for Dar Al Huda Online Quran Academy. Manage students, teachers, classes, materials, payments, and monitor academy performance.',
  keywords: [
    'Quran academy admin',
    'education management',
    'online Quran school',
    'student management system',
    'teacher management',
    'Islamic education administration',
    'Dar Al Huda Academy',
    'Quran learning platform',
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
    title: 'Admin Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Complete administration panel for managing the online Quran academy.',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Admin Dashboard - Dar Al Huda Online Quran Academy',
    description: 'Complete administration panel for the online Quran academy.',
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

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): Promise<React.ReactNode> {
  const user = await getLoggedInUser();
  
  if (!user || user.userRole !== 'ADMIN') {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        <AdminHeader />
        <MobileNav />
        <main className="py-6 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 min-h-screen">
          {children}
        </main>
      </div>
      <Toaster />
    </div>
  );
}