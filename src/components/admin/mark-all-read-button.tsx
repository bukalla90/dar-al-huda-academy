// src/components/admin/mark-all-read-button.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { markAllNotificationsAsRead } from '@/lib/action/notification.action';

export function MarkAllReadButton(): React.ReactNode {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  async function handleMarkAll(): Promise<void> {
    setLoading(true);
    await markAllNotificationsAsRead();
    router.refresh();
    setLoading(false);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleMarkAll} disabled={loading}
      className="dark:border-gray-600 dark:text-gray-300">
      <CheckCircle className="h-4 w-4 mr-2" />
      Mark All Read
    </Button>
  );
}