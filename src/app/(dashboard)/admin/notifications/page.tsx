// src/app/(dashboard)/admin/notifications/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getNotifications } from '@/lib/action/notification.action';
import { MarkAllReadButton } from '@/components/admin/mark-all-read-button';
import { MarkReadButton } from '@/components/admin/mark-read-button';
import { Bell, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default async function NotificationsPage(): Promise<React.ReactNode> {
  const result = await getNotifications();
  const notifications = result.success && result.notifications ? result.notifications : [];

  return (
    <div className="space-y-6 pb-20 lg:pb-0">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {notifications.filter(n => !n.isRead).length} unread
          </p>
        </div>
        <MarkAllReadButton />
      </div>

      {notifications.length === 0 ? (
        <Card className="dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
            <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <Card key={notification.id} 
              className={`${notification.isRead ? 'opacity-60' : 'border-l-4 border-l-primary'} dark:bg-gray-800 dark:border-gray-700 transition-all`}>
              <CardContent className="pt-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {notification.type === 'PASSWORD_RESET' ? (
                      <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-red-600" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <Bell className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{notification.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-400">
                          {notification.type.replace(/_/g, ' ')}
                        </Badge>
                        {notification.username && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            User: {notification.username}
                          </Badge>
                        )}
                        <span className="text-xs text-gray-400">
                          {new Date(notification.createdAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {notification.isRead ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <MarkReadButton notificationId={notification.id} />
                    )}
                  </div>
                </div>
                {notification.type === 'PASSWORD_RESET' && !notification.isRead && (
                  <div className="mt-3 pt-3 border-t dark:border-gray-700">
                    <Link href="/admin/settings">
                      <Button size="sm" className="bg-primary">
                        Go to Settings to Reset Password
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}