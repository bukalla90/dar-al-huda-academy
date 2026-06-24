// src/app/(dashboard)/admin/layout.tsx
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { MobileNav } from '@/components/admin/mobile-nav';
import { Toaster } from '@/components/ui/toaster';
import { getLoggedInUser } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Dar Al Huda',
  description: 'Admin dashboard for Dar Al Huda Online Quran Academy',
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