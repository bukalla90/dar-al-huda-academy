// src/components/admin/mark-read-button.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { markNotificationAsRead } from '@/lib/action/notification.action';

export function MarkReadButton({ notificationId }: { notificationId: string }): React.ReactNode {
  const [read, setRead] = useState<boolean>(false);

  async function handleMarkRead(): Promise<void> {
    await markNotificationAsRead(notificationId);
    setRead(true);
  }

  if (read) return <Check className="h-5 w-5 text-green-500" />;

  return (
    <Button variant="ghost" size="sm" onClick={handleMarkRead} className="text-primary">
      Mark Read
    </Button>
  );
}