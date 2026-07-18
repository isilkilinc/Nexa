import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import HomeFeedClient from '@/components/feed/HomeFeedClient';
import { LFGPost } from '@/lib/mockData';

export default async function HomePage() {
  // ── 1. Who is logged in? ──────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  const currentUserId = (session?.user as any)?.id as string | undefined;

  // ── 2. Fetch all listings ─────────────────────────────────────────────────
  const dbListings = await prisma.listing.findMany({
    orderBy: { createdAt: 'desc' },
    include: { creator: true },
  });

  // ── 3. Fetch this user's existing requests (one query) ───────────────────
  //    Result: Map<listingId, RequestStatus>
  const existingRequestsMap = new Map<string, 'PENDING' | 'ACCEPTED' | 'REJECTED'>();
  if (currentUserId) {
    const userRequests = await prisma.request.findMany({
      where: { senderId: currentUserId },
      select: { listingId: true, status: true },
    });
    for (const r of userRequests) {
      existingRequestsMap.set(r.listingId, r.status);
    }
  }

  // ── 4. Map to LFGPost ─────────────────────────────────────────────────────
  const formattedListings: LFGPost[] = dbListings.map((listing) => {
    const msAgo = Date.now() - new Date(listing.createdAt).getTime();
    const minsAgo = Math.floor(msAgo / 60000);
    const hoursAgo = Math.floor(minsAgo / 60);
    const timestamp = hoursAgo > 0 ? `${hoursAgo}h ago` : `${minsAgo}m ago`;

    return {
      id: listing.id,
      creatorId: listing.creatorId,
      initialRequestStatus: existingRequestsMap.get(listing.id) ?? 'none',
      user: {
        id: listing.creator.id,
        username: listing.creator.name || 'Unknown',
        displayName: listing.creator.name || 'Unknown',
        avatar: listing.creator.image || '',
        status: 'online',
        level: 1,
      },
      game: listing.game,
      gameColor: 'var(--neon-color)',
      gameEmoji: '🎮',
      gameCover: '/valorant.jpg',
      description: listing.description,
      lookingFor: listing.title,
      platform: ['PC'],
      playersNeeded: 1,
      playtime: listing.specificTime || listing.playtime || 'Flexible',
      timestamp,
      tags: [
        listing.status,
        ...(listing.micRequired ? ['🎤 Mic Req.'] : []),
        ...(listing.is18Plus ? ['🔞 18+ Only'] : []),
        ...(listing.genderPreference ? [listing.genderPreference] : []),
        ...(listing.experience ? [listing.experience] : []),
      ],
      likes: 0,
      comments: 0,
      behaviorScore: 10,
    };
  });

  return <HomeFeedClient initialListings={formattedListings} />;
}