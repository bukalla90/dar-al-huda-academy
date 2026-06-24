// src/components/admin/admin-sidebar.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  Calendar,
  Settings,
  UserPlus,
  BookMarked,
} from 'lucide-react';

interface NavItem {
  title: string;
  href: string;
  icon: typeof LayoutDashboard;
  children?: NavItem[];
}

const adminNavItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Students',
    href: '/admin/students',
    icon: Users,
    children: [
      {
        title: 'All Students',
        href: '/admin/students',
        icon: Users,
      },
      {
        title: 'Add Student',
        href: '/admin/students/create',
        icon: UserPlus,
      },
    ],
  },
  {
    title: 'Teachers',
    href: '/admin/teachers',
    icon: GraduationCap,
    children: [
      {
        title: 'All Teachers',
        href: '/admin/teachers',
        icon: GraduationCap,
      },
      {
        title: 'Add Teacher',
        href: '/admin/teachers/create',
        icon: UserPlus,
      },
    ],
  },
  {
    title: 'Payments',
    href: '/admin/payments',
    icon: CreditCard,
  },
  {
    title: 'Classes',
    href: '/admin/classes',
    icon: Calendar,
  },
  {
    title: 'Materials',
    href: '/admin/materials',
    icon: BookOpen,
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
];

export function AdminSidebar(): React.ReactNode {
  const pathname = usePathname();

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary dark:bg-gray-900 px-6 pb-4 border-r dark:border-gray-800">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center gap-2">
          <BookMarked className="h-8 w-8 text-accent" />
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white">Dar Al Huda</span>
            <span className="text-xs text-white/70">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {adminNavItems.map((item) => {
                const isActive = pathname === item.href;
                const hasChildren = item.children && item.children.length > 0;
                const isParentActive = hasChildren && item.children?.some(
                  child => pathname.startsWith(child.href)
                );

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200',
                        isActive || isParentActive
                          ? 'bg-white/10 text-white dark:bg-gray-800 dark:text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/10 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800'
                      )}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.title}
                    </Link>

                    {/* Submenu */}
                    {hasChildren && (isActive || isParentActive) && (
                      <ul className="mt-1 space-y-1 pl-8">
                        {item.children?.map((child) => {
                          const isChildActive = pathname === child.href;
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={cn(
                                  'group flex gap-x-3 rounded-md p-2 text-sm leading-6 transition-all duration-200',
                                  isChildActive
                                    ? 'bg-white/20 text-white dark:bg-gray-700 dark:text-white'
                                    : 'text-white/60 hover:text-white hover:bg-white/5 dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-gray-800'
                                )}
                              >
                                <child.icon className="h-5 w-5 shrink-0" />
                                {child.title}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="mt-auto pb-4">
        <p className="text-xs text-white/50 dark:text-gray-500 text-center">
          Dar Al Huda Academy © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}