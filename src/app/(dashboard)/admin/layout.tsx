// src/app/(dashboard)/admin/layout.tsx
import type { Metadata } from 'next';
import { AdminHeader } from '@/components/admin/admin-header';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { MobileNav } from '@/components/admin/mobile-nav';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'Admin Dashboard - Dar Al Huda',
  description: 'Admin dashboard for Dar Al Huda Online Quran Academy',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <div className="lg:pl-72">
        {/* Header */}
        <AdminHeader />
        
        {/* Mobile Navigation */}
        <MobileNav />

        {/* Page Content */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>

      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}