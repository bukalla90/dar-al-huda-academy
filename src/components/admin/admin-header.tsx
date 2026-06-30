// src/components/admin/admin-header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Menu, Settings, Home, Moon, Sun, X,
  Users, GraduationCap, ClipboardList, CreditCard,
  Calendar, BookOpen, Bell,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';
import { LogoutButton } from '@/components/auth/logout-button';

interface AdminHeaderProps {
  onMenuClick?: () => void;
}

export function AdminHeader({ onMenuClick }: AdminHeaderProps): React.ReactNode {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme === 'dark') {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    async function fetchCount(): Promise<void> {
      try {
        const res = await fetch('/api/notifications/count');
        const data = await res.json();
        if (data.success) {
          setUnreadCount(data.count);
        }
      } catch {}
    }
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  function toggleTheme(): void {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  return (
    <>
      <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="sr-only">Open sidebar</span>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

        <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
          <div className="flex items-center gap-3">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <Image
                src="/dar-al-huda-logo.svg"
                alt="Dar Al Huda Academy"
                width={180}
                height={56}
                className="h-8 sm:h-10 w-auto"
                unoptimized
              />
            </Link>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white hidden sm:block">Admin Dashboard</h1>
          </div>

          <div className="flex items-center gap-x-3 lg:gap-x-4 ml-auto">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                <Home className="h-5 w-5" />
              </Button>
            </Link>

            <Link href="/admin/notifications">
              <Button variant="ghost" size="icon" className="relative text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Button>
            </Link>

            <Button 
              variant="ghost" size="icon" onClick={toggleTheme}
              className="text-gray-700 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>

            <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200 dark:bg-gray-700" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {getInitials('Admin')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-lg" align="end">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium dark:text-white">Admin</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">admin@daralhuda.com</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <DropdownMenuItem asChild className="dark:hover:bg-gray-700 cursor-pointer">
                  <Link href="/admin/notifications" className="dark:text-gray-300">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="dark:hover:bg-gray-700 cursor-pointer">
                  <Link href="/admin/settings" className="dark:text-gray-300">
                    <Settings className="mr-2 h-4 w-4" />Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="dark:hover:bg-gray-700 cursor-pointer">
                  <Link href="/" className="dark:text-gray-300">
                    <Home className="mr-2 h-4 w-4" />Home
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="dark:bg-gray-700" />
                <div className="px-2 py-1.5">
                  <LogoutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
          <div className="fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="text-lg font-bold text-primary">Menu</span>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)} className="dark:text-gray-300">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-1">
              <Link href="/admin" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <Home className="h-5 w-5" /> Dashboard
              </Link>
              <Link href="/admin/notifications" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <Bell className="h-5 w-5" /> Notifications
                {unreadCount > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">{unreadCount}</span>
                )}
              </Link>
              <Link href="/admin/students" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <Users className="h-5 w-5" /> Students
              </Link>
              <Link href="/admin/teachers" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <GraduationCap className="h-5 w-5" /> Teachers
              </Link>
              <Link href="/admin/payments" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <CreditCard className="h-5 w-5" /> Payments
              </Link>
              <Link href="/admin/classes" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <Calendar className="h-5 w-5" /> Classes
              </Link>
              <Link href="/admin/materials" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <BookOpen className="h-5 w-5" /> Materials
              </Link>
              <Link href="/admin/settings" className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" onClick={() => setMobileMenuOpen(false)}>
                <Settings className="h-5 w-5" /> Settings
              </Link>
              <div className="pt-4 mt-4 border-t dark:border-gray-700">
                <LogoutButton />
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}