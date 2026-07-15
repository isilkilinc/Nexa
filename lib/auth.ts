import type { NextAuthOptions } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import GoogleProvider from 'next-auth/providers/google';
import DiscordProvider from 'next-auth/providers/discord';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
    }),

    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('No account found. Please register first.');
        }

        const isValid = await bcryptjs.compare(credentials.password, user.password);
        if (!isValid) {
          throw new Error('Incorrect password. Please try again.');
        }

        if (!user.emailVerified) {
          throw new Error(
            'Email not verified. Please check your inbox and click the verification link.'
          );
        }

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],

  // Must use 'database' strategy when PrismaAdapter is active.
  // Using 'jwt' with an adapter breaks OAuth providers (Google, Discord)
  // because NextAuth can't persist the session, causing a silent redirect loop.
  session: { strategy: 'database' },

  callbacks: {
    async signIn({ account }) {
      // Allow all OAuth sign-ins (Google, Discord, etc.)
      if (account?.type === 'oauth') {
        return true;
      }
      // For credentials, the authorize() function handles validation
      return true;
    },
    async session({ session, user }) {
      if (user && session.user) {
        (session.user as any).id = user.id;
      }
      return session;
    },
  },

  pages: { signIn: '/signup' },
  secret: process.env.NEXTAUTH_SECRET,
};
