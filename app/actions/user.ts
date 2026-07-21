'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─── Block / Unblock a user ──────────────────────────────────────────────────

export async function blockUser(blockedId: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const blockerId = (session.user as any).id as string;

    if (blockerId === blockedId) {
      return { error: 'You cannot block yourself' };
    }

    const existingBlock = await prisma.block.findUnique({
      where: {
        blockerId_blockedId: {
          blockerId,
          blockedId,
        },
      },
    });

    if (existingBlock) {
      await prisma.block.delete({
        where: { id: existingBlock.id },
      });
    } else {
      await prisma.block.create({
        data: { blockerId, blockedId },
      });
    }

    revalidatePath('/messages');
    revalidatePath(`/profile/${blockedId}`);
    return { success: true };
  } catch (error) {
    console.error('BLOCK_USER_ERROR:', error);
    return { error: 'Failed to block/unblock user' };
  }
}

// ─── Report a user ─────────────────────────────────────────────────────────

export async function reportUser(reportedId: string, reason: string): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const reporterId = (session.user as any).id as string;

    if (reporterId === reportedId) {
      return { error: 'You cannot report yourself' };
    }

    if (!reason.trim()) {
      return { error: 'Reason is required' };
    }

    await prisma.report.create({
      data: { reporterId, reportedId, reason: reason.trim() },
    });

    return { success: true };
  } catch (error) {
    console.error('REPORT_USER_ERROR:', error);
    return { error: 'Failed to report user' };
  }
}
