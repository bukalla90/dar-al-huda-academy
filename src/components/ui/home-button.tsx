// src/components/ui/home-button.tsx
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export function HomeButton(): React.ReactNode {
  return (
    <Link href="/">
      <Button variant="ghost" size="sm" className="text-gray-600 hover:text-primary">
        <Home className="h-4 w-4 mr-2" />
        Home
      </Button>
    </Link>
  );
}