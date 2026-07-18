import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import ChatClient from './ChatClient';
import ChatHeader from './ChatHeader';
import { markConversationAsRead } from '@/app/actions/messages';

export default async function ChatPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !(session.user as any).id) {
    redirect('/api/auth/signin');
  }
  
  const userId = (session.user as any).id as string;
  const conversationId = params.id;

  // Verify participation and fetch conversation
  const participant = await prisma.conversationParticipant.findUnique({
    where: { conversationId_userId: { conversationId, userId } },
    include: {
      conversation: {
        include: {
          participants: {
            include: { user: { select: { id: true, name: true, image: true } } },
          },
          messages: {
            orderBy: { createdAt: 'asc' },
            include: { sender: { select: { id: true, name: true, image: true } } }
          },
        },
      },
    },
  });

  if (!participant) {
    notFound(); // Triggers the 404 if user tries to access a chat they aren't part of or doesn't exist
  }

  // Mark as read immediately
  await markConversationAsRead(conversationId);

  const conv = participant.conversation;
  const other = conv.participants.find((p) => p.userId !== userId)?.user;
  const otherName = other?.name || 'Unknown';
  const otherInitial = otherName[0]?.toUpperCase() || '?';

  return (
    <div className="flex flex-col h-[100dvh] max-h-[100dvh] overflow-hidden relative w-full chat-detail-container">
      <ChatHeader 
        conversationId={conversationId}
        otherName={otherName}
        otherInitial={otherInitial}
        initialIsMuted={participant.isMuted}
      />

      <ChatClient 
        conversationId={conversationId} 
        initialMessages={conv.messages} 
        currentUserId={userId} 
      />
    </div>
  );
}
