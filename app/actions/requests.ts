'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// ─── Apply to a listing ───────────────────────────────────────────────────────

export async function createRequest(listingId: string, initialMessage?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'You must be logged in to send a request' };
    }

    const senderId = (session.user as any).id as string;

    // Verify listing exists and get creator
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { creatorId: true, game: true, title: true },
    });

    if (!listing) return { error: 'Listing not found' };
    if (listing.creatorId === senderId) {
      return { error: 'You cannot request to join your own listing' };
    }

    // Check for duplicate request
    const existingRequest = await prisma.request.findFirst({
      where: { listingId, senderId },
    });
    if (existingRequest) {
      return { error: 'You have already sent a request for this listing' };
    }

    // Get sender name for the notification message
    const sender = await prisma.user.findUnique({
      where: { id: senderId },
      select: { name: true },
    });
    const senderName = sender?.name || 'Someone';

    // Create request + notification atomically
    await prisma.$transaction([
      prisma.request.create({
        data: { 
          listingId, 
          senderId, 
          status: 'PENDING',
          initialMessage: initialMessage?.trim() || null
        },
      }),
      prisma.notification.create({
        data: {
          recipientId: listing.creatorId,
          senderId,
          message: `${senderName} applied to join your listing "${listing.title}" (${listing.game}).`,
        },
      }),
    ]);

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('CREATE_REQUEST_ERROR:', error);
    return { error: `Failed to send request: ${error instanceof Error ? error.message : String(error)}` };
  }
}

// ─── Manage Requests (owner-only) ────────────────────────────────────────────

export type RequestWithSender = {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  initialMessage: string | null;
  createdAt: Date;
  sender: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
};

/**
 * Fetch all incoming requests for a listing.
 * Only the listing creator may call this.
 */
export async function getRequestsForListing(
  listingId: string
): Promise<{ data?: RequestWithSender[]; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }

    const userId = (session.user as any).id as string;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { creatorId: true },
    });

    if (!listing) return { error: 'Listing not found' };
    if (listing.creatorId !== userId) return { error: 'Forbidden' };

    const requests = await prisma.request.findMany({
      where: { listingId },
      orderBy: { createdAt: 'desc' },
      include: {
        sender: { select: { id: true, name: true, email: true, image: true } },
      },
    });

    return { data: requests as RequestWithSender[] };
  } catch (error) {
    console.error('GET_REQUESTS_ERROR:', error);
    return { error: 'Failed to fetch requests' };
  }
}

/**
 * Accept or reject an incoming request.
 * Only the listing creator may call this.
 * On ACCEPTED: atomically creates a Conversation + notification to the sender.
 */
export async function updateRequestStatus(
  requestId: string,
  status: 'ACCEPTED' | 'REJECTED'
): Promise<{ success?: boolean; conversationId?: string; error?: string }> {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !(session.user as any).id) {
      return { error: 'Unauthorized' };
    }

    const ownerId = (session.user as any).id as string;

    // Load request with listing + sender
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        listing: { select: { creatorId: true, game: true, title: true } },
        sender: { select: { name: true } },
      },
    });

    if (!request) return { error: 'Request not found' };
    if (request.listing.creatorId !== ownerId) return { error: 'Forbidden' };

    if (status === 'ACCEPTED') {
      console.log("Accepting request, starting conversation creation...");

      // Run everything atomically, return the created conversation directly
      const newConversation = await prisma.$transaction(async (tx) => {
        // 1. Update request status
        await tx.request.update({
          where: { id: requestId },
          data: { status: 'ACCEPTED' },
        });

        // 2. Notify the sender that they were accepted
        const ownerUser = await tx.user.findUnique({
          where: { id: ownerId },
          select: { name: true },
        });
        const ownerName = ownerUser?.name || 'The listing owner';

        await tx.notification.create({
          data: {
            recipientId: request.senderId,
            senderId: ownerId,
            message: `${ownerName} accepted your request for "${request.listing.title}"! You can now chat.`,
          },
        });

        // 3. Handle Conversation (Check for existing first)
        let conversation = await tx.conversation.findFirst({
          where: {
            AND: [
              { participants: { some: { userId: ownerId } } },
              { participants: { some: { userId: request.senderId } } }
            ]
          }
        });

        const newMessages = [
          ...(request.initialMessage
            ? [
                {
                  content: request.initialMessage,
                  type: 'USER' as const,
                  senderId: request.senderId,
                },
              ]
            : []),
          {
            content: 'CONNECTION_ACCEPTED',
            type: 'SYSTEM' as const,
            senderId: ownerId,
          },
        ];

        if (conversation) {
          console.log("Appending to existing conversation between:", ownerId, request.senderId);
          await tx.message.createMany({
            data: newMessages.map(m => ({ ...m, conversationId: conversation!.id }))
          });
        } else {
          console.log("Creating new conversation and participants between:", ownerId, request.senderId);
          conversation = await tx.conversation.create({
            data: {
              participants: {
                create: [
                  { userId: ownerId },
                  { userId: request.senderId },
                ],
              },
              messages: {
                create: newMessages,
              },
            },
          });
        }

        return conversation;
      });

      revalidatePath('/');
      revalidatePath('/messages');
      return { success: true, conversationId: newConversation.id };

    } else {
      // REJECTED — just update the status
      await prisma.request.update({
        where: { id: requestId },
        data: { status: 'REJECTED' },
      });
      revalidatePath('/');
      return { success: true };
    }
  } catch (error) {
    console.error('UPDATE_REQUEST_STATUS_ERROR:', error);
    return { error: 'Failed to update request status' };
  }
}