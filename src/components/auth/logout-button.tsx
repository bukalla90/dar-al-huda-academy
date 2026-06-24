// src/components/auth/logout-button.tsx
'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { logoutUser } from '@/lib/action/auth.actions';

export function LogoutButton(): React.ReactNode {
  return (
    <form action={logoutUser}>
      <Button 
        type="submit"
        variant="ghost" 
        className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Log out
      </Button>
    </form>
  );
}

export function LogoutIconButton(): React.ReactNode {
  return (
    <form action={logoutUser}>
      <Button 
        type="submit"
        variant="ghost" 
        size="icon"
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <LogOut className="h-5 w-5" />
      </Button>
    </form>
  );
}