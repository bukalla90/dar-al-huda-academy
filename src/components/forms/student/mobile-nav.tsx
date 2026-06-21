// src/components/student/mobile-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  Download,
  GraduationCap,
} from 'lucide-react';

export function MobileNav(): React.ReactNode {
  const pathname = usePathname();

  const navItems = [
    { title: 'Dashboard', href: '/student', icon: LayoutDashboard },
    { title: 'Progress', href: '/student/progress', icon: BookOpen },
    { title: 'Classes', href: '/student/classes', icon: Calendar },
    { title: 'Materials', href: '/student/materials', icon: Download },
    { title: 'Teacher', href: '/student/teacher', icon: GraduationCap },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="flex items-center justify-around bg-white border-t border-gray-200 px-2 py-2">
        {navItems.map((item) => {
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
      </div>
    </div>
  );
}