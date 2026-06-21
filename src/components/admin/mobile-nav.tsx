// src/components/admin/mobile-nav.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CreditCard,
  Calendar,
  BookOpen,
  Settings,
  ClipboardList,
  X,
  BookMarked,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
}

const mobileNavItems: MobileNavItem[] = [
  { title: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { title: 'Students', href: '/admin/students', icon: Users },
  { title: 'Teachers', href: '/admin/teachers', icon: GraduationCap },
  { title: 'Applications', href: '/admin/applications', icon: ClipboardList },
  { title: 'Payments', href: '/admin/payments', icon: CreditCard },
  { title: 'Classes', href: '/admin/classes', icon: Calendar },
  { title: 'Materials', href: '/admin/materials', icon: BookOpen },
  { title: 'Settings', href: '/admin/settings', icon: Settings },
];

export function MobileNav(): JSX.Element {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
        <div className="flex items-center justify-around bg-white border-t border-gray-200 px-2 py-2">
          {mobileNavItems.slice(0, 5).map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 p-2 rounded-lg transition-colors',
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-gray-500 hover:text-primary'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.title}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setIsOpen(true)}
            className="flex flex-col items-center gap-1 p-2 text-gray-500 hover:text-primary"
          >
            <BookMarked className="h-5 w-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </div>

      {/* Full mobile menu overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-gray-50'
                    )}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs font-medium text-center">{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}