'use server';

import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function createListing(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    console.log("SERVER SESSION DEBUG:", session);
    
    if (!session?.user || !(session.user as any).id) {
      return { error: 'You must be logged in to create a listing' };
    }

    const userId = (session.user as any).id as string;
    const title = formData.get('title') as string;
    let game = formData.get('game') as string;
    const customGame = formData.get('customGame') as string | null;
    const description = formData.get('description') as string;
    
    if (game === 'Other' && customGame) {
      game = customGame;
    }
    
    const micRequired = formData.get('micRequired') === 'true';
    const is18Plus = formData.get('is18Plus') === 'true';
    const genderPreference = formData.get('genderPreference') as string | null;
    const playtime = formData.get('playtime') as string | null;
    const specificTime = formData.get('specificTime') as string | null;
    const experience = formData.get('experience') as string | null;

    if (!title || !game || !description) {
      return { error: 'All fields are required' };
    }

    await prisma.listing.create({
      data: {
        title,
        game,
        description,
        micRequired,
        is18Plus,
        genderPreference: genderPreference || null,
        playtime: playtime || null,
        specificTime: specificTime || null,
        experience: experience || null,
        creatorId: userId,
      },
    });

    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error("DETAILED LISTING ERROR:", error);
    return { error: 'Failed to create listing. Please try again.' };
  }
}
