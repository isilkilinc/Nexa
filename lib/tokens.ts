import crypto from 'crypto';
import { prisma } from './prisma';

const TOKEN_EXPIRY_HOURS = 24;

/**
 * Generates a secure random verification token, saves it to the
 * VerificationToken table (deleting any previous token for this email first),
 * and returns the record.
 */
export async function generateVerificationToken(email: string) {
  const token = crypto.randomUUID();
  const expires = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

  // Remove any stale token for this email
  await prisma.verificationToken.deleteMany({
    where: { identifier: email },
  });

  return prisma.verificationToken.create({
    data: { identifier: email, token, expires },
  });
}

/**
 * Looks up a VerificationToken by its token string.
 * Returns null if not found.
 */
export async function getVerificationToken(token: string) {
  return prisma.verificationToken.findUnique({
    where: { token },
  });
}

/**
 * Deletes a VerificationToken record by token string.
 */
export async function deleteVerificationToken(token: string) {
  return prisma.verificationToken.delete({
    where: { token },
  });
}
