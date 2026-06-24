// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  
  // Get cookies
  const userId = request.cookies.get('userId')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  // Public routes - accessible without login
  const publicRoutes = ['/', '/login', '/forgot-password'];
  if (publicRoutes.includes(pathname)) {
    // If already logged in and trying to access login, redirect to dashboard
    if (pathname === '/login' && userId && userRole) {
      const dashboardUrl = getDashboardUrl(userRole);
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
    return NextResponse.next();
  }

  // Static files and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Not logged in - redirect to login
  if (!userId || !userRole) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Role-based access control
  if (pathname.startsWith('/admin') && userRole !== 'ADMIN') {
    const dashboardUrl = getDashboardUrl(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  if (pathname.startsWith('/teacher') && userRole !== 'TEACHER') {
    const dashboardUrl = getDashboardUrl(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  if (pathname.startsWith('/student') && userRole !== 'STUDENT') {
    const dashboardUrl = getDashboardUrl(userRole);
    return NextResponse.redirect(new URL(dashboardUrl, request.url));
  }

  return NextResponse.next();
}

function getDashboardUrl(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin';
    case 'TEACHER':
      return '/teacher';
    case 'STUDENT':
      return '/student';
    default:
      return '/login';
  }
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};