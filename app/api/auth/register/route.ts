import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    // ── Validation ──────────────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required.' },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // ── Check for existing account ───────────────────────────────────────
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing && existing.emailVerified) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ── Create (or re-use pending) user ──────────────────────────────────
    const hashedPassword = await bcryptjs.hash(password, 12);

    const user = existing
      ? await prisma.user.update({
          where: { email },
          data: { password: hashedPassword, name: name || email.split('@')[0] },
        })
      : await prisma.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            password: hashedPassword,
          },
        });

    // ── Generate token & send email ──────────────────────────────────────
    const verificationRecord = await generateVerificationToken(user.email!);
    console.log('[REGISTER] Token created:', {
      email: user.email,
      token: verificationRecord.token,
      expires: verificationRecord.expires,
    });

    await sendVerificationEmail(user.email!, verificationRecord.token);
    console.log('[REGISTER] Email sent to:', user.email);

    return NextResponse.json(
      { message: 'Verification email sent. Please check your inbox.' },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[REGISTER ERROR]', err);
    return NextResponse.json(
      { error: err.message ?? 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
