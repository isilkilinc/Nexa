import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { MessageCircle, BellOff } from 'lucide-react';
import Link from 'next/link';

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !(session.user as any).id) {
    redirect('/api/auth/signin');
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

  return (
    <div className="min-h-screen flex flex-col relative px-4 pt-12 pb-24">
      <h1 className="font-orbitron font-black text-xl tracking-wider mb-6" style={{ color: 'var(--text-primary)' }}>
        MESSAGES
      </h1>
      
      {participantRows.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-16">
          <MessageCircle size={40} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
          <p className="font-rajdhani text-sm" style={{ color: 'var(--text-muted)' }}>
            Henüz bir mesajlaşma yok
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {participantRows.map((p) => {
            const conv = p.conversation;
            const other = conv.participants.find((pp) => pp.userId !== userId);
            const lastMsg = conv.messages[0] ?? null;
            const otherName = other?.user.name || 'Unknown';
            const otherInitial = otherName[0]?.toUpperCase() || '?';
            
            return (
              <Link 
                href={`/messages/${conv.id}`} 
                key={conv.id}
                className="glass glass-hover rounded-2xl p-4 flex items-center gap-4 relative"
              >
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-black font-orbitron flex-shrink-0" 
                  style={{ background: 'var(--neon-color)' }}
                >
                  {otherInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-base flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      {otherName}
                      {p.isMuted && <BellOff size={14} className="text-red-400" />}
                    </p>
                  </div>
                  <p className="text-sm truncate font-rajdhani" style={{ color: 'var(--text-secondary)' }}>
                    {(() => {
                      if (!lastMsg) return 'No messages yet';
                      if (lastMsg.type === 'SYSTEM' && lastMsg.content === 'CONNECTION_ACCEPTED') {
                        return lastMsg.senderId === userId
                          ? "You accepted the request. Say hello!"
                          : `${otherName} accepted your request. Say hello!`;
                      }
                      return lastMsg.content;
                    })()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
