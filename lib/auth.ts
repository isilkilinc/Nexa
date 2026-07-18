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
        console.log("AUTH DEBUG: Starting authorize for email:", credentials?.email);
        if (!credentials?.email || !credentials?.password) {
          console.error("AUTH ERROR: Missing email or password");
          throw new Error('Email and password are required.');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          console.error("AUTH ERROR: User not found for email:", credentials.email);
          throw new Error('No account found. Please register first.');
        }

        if (!user.password) {
          console.error("AUTH ERROR: User found, but password hash is null (OAuth user?)");
          throw new Error('Account exists but has no password (try signing in with Google/Discord).');
        }
        
        console.log("AUTH DEBUG: User found in DB. ID:", user.id);

        const isValid = await bcryptjs.compare(credentials.password, user.password);
        console.log("AUTH DEBUG: Password match result:", isValid);
        
        if (!isValid) {
          console.error("AUTH ERROR: Invalid password for email:", credentials.email);
          throw new Error('Incorrect password. Please try again.');
        }

        const returnedUser = { id: user.id, name: user.name, email: user.email };
        console.log("AUTH DEBUG: Returning user object:", returnedUser);
        return returnedUser;
      },
    }),
  ],

  // Using 'jwt' strategy so CredentialsProvider sessions persist correctly.
  session: { strategy: 'jwt' },

  useSecureCookies: process.env.NODE_ENV === 'production',

  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        // Removed domain setting for localhost to prevent cookie mismatches
      },
    },
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      // Ensure the Auth callback strictly uses http://localhost:3001 in development
      const targetBase = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : baseUrl;
      if (url.startsWith('/')) return `${targetBase}${url}`;
      if (new URL(url).origin === targetBase) return url;
      return targetBase;
    },
    async signIn({ account }) {
      // Allow all OAuth sign-ins (Google, Discord, etc.)
      if (account?.type === 'oauth') {
        return true;
      }
      // For credentials, the authorize() function handles validation
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },

  pages: { signIn: '/signup' },
  secret: process.env.NEXTAUTH_SECRET,
};
