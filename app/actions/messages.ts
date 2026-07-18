'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ConversationSummary = {
  id: string;
  createdAt: Date;
  otherUser: {
    id: string;
    name: string | null;
    image: string | null;
  };
  lastMessage: {
    content: string;
    createdAt: Date;
    isMe: boolean;
  } | null;
};

export type MessageItem = {
  id: string;
  content: string;
  createdAt: Date;
  isMe: boolean;
  type: string;
  senderId: string;
  imageUrl?: string | null;
  audioUrl?: string | null;
  documentUrl?: string | null;
  documentName?: string | null;
  deletedForEveryone?: boolean;
  sender: {
    id: string;
    name: string | null;
    image: string | null;
  };
};

// ─── Fetch all conversations for the current user ────────────────────────────

export async function getConversations(): Promise<{
  data?: ConversationSummary[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    const participantRows = await prisma.conversationParticipant.findMany({
      where: { userId, hasHidden: false },
      include: {
        conversation: {
          include: {
            participants: {
              include: { user: { select: { id: true, name: true, image: true } } },
            },
            messages: {
              orderBy: { createdAt: 'desc' },
              take: 1,
            },
          },
        },
      },
      orderBy: { conversation: { createdAt: 'desc' } },
    });

    const summaries: ConversationSummary[] = participantRows.map((p) => {
      const conv = p.conversation;
      const other = conv.participants.find((pp) => pp.userId !== userId);
      const lastMsg = conv.messages[0] ?? null;

      return {
        id: conv.id,
        createdAt: conv.createdAt,
        otherUser: other
          ? { id: other.user.id, name: other.user.name, image: other.user.image }
          : { id: '', name: 'Unknown', image: null },
        lastMessage: lastMsg
          ? {
              content: lastMsg.content,
              createdAt: lastMsg.createdAt,
              isMe: lastMsg.senderId === userId,
            }
          : null,
      };
    });

    return { data: summaries };
  } catch (error) {
    console.error('GET_CONVERSATIONS_ERROR:', error);
    return { error: 'Failed to fetch conversations' };
  }
}

// ─── Fetch message history for a conversation ────────────────────────────────

export async function getMessages(conversationId: string): Promise<{
  data?: MessageItem[];
  error?: string;
}> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    // Auth: user must be a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) return { error: 'Forbidden' };

    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    const filteredMessages = messages
      .filter((m) => !m.deletedFor.includes(userId))
      .map((m) => {
        const isDeleted = m.deletedForEveryone;
        return {
          id: m.id,
          content: isDeleted ? 'This message was deleted' : m.content,
          createdAt: m.createdAt,
          isMe: m.senderId === userId,
          type: m.type,
          senderId: m.senderId,
          imageUrl: isDeleted ? null : m.imageUrl,
          audioUrl: isDeleted ? null : m.audioUrl,
          documentUrl: isDeleted ? null : m.documentUrl,
          documentName: isDeleted ? null : m.documentName,
          deletedForEveryone: isDeleted,
          sender: m.sender,
        };
      });

    return { data: filteredMessages };
  } catch (error) {
    console.error('GET_MESSAGES_ERROR:', error);
    return { error: 'Failed to fetch messages' };
  }
}

// ─── Send a message ──────────────────────────────────────────────────────────

export async function sendMessage(
  conversationId: string,
  content: string,
  imageUrl?: string,
  audioUrl?: string,
  documentUrl?: string,
  documentName?: string
): Promise<{ data?: MessageItem; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    if (!content.trim() && !imageUrl && !audioUrl && !documentUrl) return { error: 'Message cannot be empty' };

    // Auth: user must be a participant
    const participant = await prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });
    if (!participant) return { error: 'Forbidden' };

    const message = await prisma.message.create({
      data: { 
        conversationId, 
        senderId: userId, 
        content: content.trim(),
        imageUrl,
        audioUrl,
        documentUrl,
        documentName,
      },
      include: { sender: { select: { id: true, name: true, image: true } } },
    });

    // Unhide the conversation for all participants so they see the new message
    await prisma.conversationParticipant.updateMany({
      where: { conversationId },
      data: { hasHidden: false },
    });

    revalidatePath('/messages');
    return {
      data: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        isMe: true,
        type: message.type,
        senderId: message.senderId,
        imageUrl: message.imageUrl,
        audioUrl: message.audioUrl,
        documentUrl: message.documentUrl,
        documentName: message.documentName,
        deletedForEveryone: message.deletedForEveryone,
        sender: message.sender,
      },
    };
  } catch (error) {
    console.error('SEND_MESSAGE_ERROR:', error);
    return { error: 'Failed to send message' };
  }
}

// ─── Delete a message ────────────────────────────────────────────────────────

export async function deleteMessage(
  messageId: string,
  type: 'me' | 'everyone'
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    const message = await prisma.message.findUnique({
      where: { id: messageId },
    });

    if (!message) return { error: 'Message not found' };

    if (type === 'everyone') {
      if (message.senderId !== userId) {
        return { error: 'You can only delete your own messages for everyone' };
      }
      await prisma.message.update({
        where: { id: messageId },
        data: { deletedForEveryone: true },
      });
    } else {
      await prisma.message.update({
        where: { id: messageId },
        data: { deletedFor: { push: userId } },
      });
    }

    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    console.error('DELETE_MESSAGE_ERROR:', error);
    return { error: 'Failed to delete message' };
  }
}

// ─── Mute / Unmute a conversation ────────────────────────────────────────────

export async function toggleMute(
  conversationId: string,
  isMuted: boolean
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { isMuted },
    });

    revalidatePath(`/messages/${conversationId}`);
    return { success: true };
  } catch (error) {
    console.error('TOGGLE_MUTE_ERROR:', error);
    return { error: 'Failed to toggle mute status' };
  }
}

// ─── Mark conversation as read ───────────────────────────────────────────────

export async function markConversationAsRead(
  conversationId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { lastReadAt: new Date() },
    });

    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    console.error('MARK_READ_ERROR:', error);
    return { error: 'Failed to mark as read' };
  }
}

// ─── Get total unread count ──────────────────────────────────────────────────

export async function getUnreadCount(): Promise<{ count: number; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { count: 0, error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    const participants = await prisma.conversationParticipant.findMany({
      where: { userId, isMuted: false },
      select: { conversationId: true, lastReadAt: true },
    });

    let totalUnread = 0;

    for (const p of participants) {
      const unreadMessages = await prisma.message.count({
        where: {
          conversationId: p.conversationId,
          createdAt: { gt: p.lastReadAt },
          senderId: { not: userId }, // Don't count my own messages
        },
      });
      totalUnread += unreadMessages;
    }

    return { count: totalUnread };
  } catch (error) {
    console.error('GET_UNREAD_COUNT_ERROR:', error);
    return { count: 0, error: 'Failed to get unread count' };
  }
}

// ─── Delete (Hide) a conversation ────────────────────────────────────────────

export async function deleteConversation(
  conversationId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }
    const userId = (session.user as any).id as string;

    await prisma.conversationParticipant.update({
      where: { conversationId_userId: { conversationId, userId } },
      data: { hasHidden: true },
    });

    revalidatePath('/messages');
    return { success: true };
  } catch (error) {
    console.error('DELETE_CONV_ERROR:', error);
    return { error: 'Failed to delete conversation' };
  }
}
