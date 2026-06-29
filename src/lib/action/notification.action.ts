// src/lib/action/notification.action.ts
'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createNotification(data: {
  type: string;
  title: string;
  message: string;
  username?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    await prisma.notification.create({
      data: {
        type: data.type,
        title: data.title,
        message: data.message,
        username: data.username || null,
      },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Create notification error:', error);
    return { success: false, error: 'Failed to create notification' };
  }
}

export async function getNotifications(): Promise<{
  success: boolean;
  notifications?: Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    username: string | null;
    isRead: boolean;
    createdAt: Date;
  }>;
  error?: string;
}> {
  try {
    const notifications = await prisma.notification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return { success: true, notifications };
  } catch (error) {
    console.error('Get notifications error:', error);
    return { success: false, error: 'Failed to fetch notifications' };
  }
}

export async function markNotificationAsRead(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Mark as read error:', error);
    return { success: false, error: 'Failed to mark as read' };
  }
}

export async function markAllNotificationsAsRead(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    revalidatePath('/admin');
    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Mark all as read error:', error);
    return { success: false, error: 'Failed to mark all as read' };
  }
}

export async function getUnreadCount(): Promise<{
  success: boolean;
  count?: number;
  error?: string;
}> {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false },
    });

    return { success: true, count };
  } catch (error) {
    console.error('Get unread count error:', error);
    return { success: false, error: 'Failed to fetch count' };
  }
}

export async function deleteNotification(notificationId: string): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.notification.delete({
      where: { id: notificationId },
    });

    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Delete notification error:', error);
    return { success: false, error: 'Failed to delete notification' };
  }
}

export async function clearAllNotifications(): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    await prisma.notification.deleteMany({});

    revalidatePath('/admin/notifications');
    return { success: true };
  } catch (error) {
    console.error('Clear all notifications error:', error);
    return { success: false, error: 'Failed to clear notifications' };
  }
}