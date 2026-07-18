'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type NotificationItem = {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

/**
 * Fetch all notifications for the current user.
 */
export async function getNotifications(): Promise<{
  data?: NotificationItem[];
  unreadCount?: number;
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    const notifications = await prisma.notification.findMany({
      where: { recipientId: userId },
      orderBy: { createdAt: 'desc' },
      take: 50,
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    const unreadCount = notifications.filter((n) => !n.isRead).length;
    return { data: notifications as NotificationItem[], unreadCount };
  } catch (error) {
    console.error('GET_NOTIFICATIONS_ERROR:', error);
    return { error: 'Failed to fetch notifications' };
  }
}

/**
 * Mark all notifications as read for the current user.
 */
export async function markAllNotificationsRead(): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    await prisma.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('MARK_NOTIFICATIONS_READ_ERROR:', error);
    return { error: 'Failed to mark notifications as read' };
  }
}
