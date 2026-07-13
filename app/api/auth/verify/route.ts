import { NextRequest, NextResponse } from 'next/server';
import { getVerificationToken, deleteVerificationToken } from '@/lib/tokens';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token.' }, { status: 400 });
  }

  try {
    // ── Look up the token ──────────────────────────────────────────────
    console.log('[VERIFY] Looking up token:', token);
    const verificationToken = await getVerificationToken(token);
    console.log('[VERIFY] Found record:', verificationToken);

    if (!verificationToken) {
      return NextResponse.json(
        {
          error:
            'This verification link is invalid or has already been used. ' +
            'Please register again to receive a new link.',
        },
        { status: 400 }
      );
    }

    // ── Check expiry ───────────────────────────────────────────────────
    if (new Date() > verificationToken.expires) {
      await deleteVerificationToken(token);
      return NextResponse.json(
        {
          error:
            'This verification link has expired (links are valid for 24 hours). ' +
            'Please register again to receive a new one.',
        },
        { status: 400 }
      );
    }

    // ── Mark email as verified ─────────────────────────────────────────
    await prisma.user.update({
      where: { email: verificationToken.identifier },
      data: { emailVerified: new Date() },
    });

    // ── Clean up the token ─────────────────────────────────────────────
    await deleteVerificationToken(token);

    return NextResponse.json({
      message:
        'Your email has been verified successfully! You can now log in to your Nexa account.',
    });
  } catch (err: any) {
    console.error('[VERIFY ERROR]', err);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
